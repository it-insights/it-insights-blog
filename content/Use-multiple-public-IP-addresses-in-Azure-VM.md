---
title: Use multiple public IP addresses in Azure VM
tags:
  - CLI
  - Azure
  - Automation
  - ARM
  - IaC
category: Azure
author: Jan-Henrik Damaschke

keywords:
  - CLI
  - Azure
  - Automation
  - ARM
  - IaC
  - Azure CLI
  - ARM templates
  - Virtual Machine
  - VM
  - Ubuntu
  - Bash
  - Routing
  - SKU
  - Size
  - Batch
  - Iteration
date: 2019-08-19 05:00:00
---

Sometimes multiple external IP address on an Azure Virtual Machine (VM) are needed for a deployed application or script. We will setup a multi NIC VM with one public IP per interface and route some traffic through different interfaces.

<!-- more -->
<!-- toc -->

## Introduction

Azure has support for multiple network interface cards (NICs) as well as multiple public IP address resources for quite some time now. The number of NICs that can be attached to a VM depends on the SKU aka size aka badge of the VM. As we will deploy a template with 4 NICs, we will use a DS3v2 from the DSv2-series, as this is one of the sizes, where you can attach 4 NICs to a VM with 4 cores and have enough compute power. The limitations regarding the number of NICs are listed on the Microsoft Docs for the corresponding SKU, here are the ones for the DSv2-series:

| Size            | vCPU | Memory: GiB | ... | Max NICs / Expected network bandwidth (Mbps) |
| --------------- | ---- | ----------- | --- | -------------------------------------------- |
| Standard_DS1_v2 | 1    | 3.5         | ... | 2 / 750                                      |
| Standard_DS2_v2 | 2    | 7           | ... | 2 / 1500                                     |
| Standard_DS3_v2 | 4    | 14          | ... | 4 / 3000                                     |
| Standard_DS4_v2 | 8    | 28          | ... | 8 / 6000                                     |
| Standard_DS5_v2 | 16   | 56          | ... | 8 / 12000                                    |

## Arm Template

We will create the following resources using our ARM template:

- A new VNET (you can of course use your own existing one, just see the [ARM quickstart repo](https://github.com/Azure/azure-quickstart-templates) for references)
- n public IP addresses
- n network interface
- A virtual machine that uses all the above resources

### Parameters

Let's start with the basics. We need some parameters and some variables. For the sake of simplicity, we will not parameterize things like VNET reference or subnet prefix.

```json
{
  "parameters": {
    "vmName": {
      "type": "string",
      "defaultValue": "proxyVm",
      "metadata": {
        "description": "Name of the VM"
      }
    },
    "vmSku": {
      "type": "string",
      "defaultValue": "Standard_DS3_v2",
      "metadata": {
        "description": "VM SKU. Be aware of NIC count limitations."
      }
    },
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "VM admin username, certain standard values are not allowed."
      }
    },
    "adminPassword": {
      "type": "securestring",
      "metadata": {
        "description": "Password for VM admin. Please chose a secure random password with at least 16 characters."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    },
    "nicCount": {
      "type": "int",
      "defaultValue": 4,
      "minValue": 1,
      "maxValue": 20,
      "metadata": {
        "description": "Numbers of NICs and PIPs to be deployed."
      }
    }
  }
}
```

### Variables

The variables are quite simplistic. We create the name of the VNET from the `vmName` parameter and create the variables for the most current version of Ubuntu 19.04 from the Azure marketplace.

```json
{
  "variables": {
    "subnetName": "subnet01",
    "virtualNetworkName": "[concat(parameters('vmName'), '-vnet')]",
    "publisher": "Canonical",
    "offer": "UbuntuServer",
    "sku": "19.04",
    "version": "19.04.201907241",
    "vnetPrefix": "10.0.0.0/24",
    "subnetPrefix": "10.0.0.0/24"
  }
}
```

::callout{icon="i-heroicons-information-circle" color="blue"}
If you want to know how to find the designated version or offer, [Azure Docs has you covered](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/cli-ps-findimage#navigate-the-images)!
::

### Resource iteration

As we want to be able to change how many NICs are deployed, we will use the [`copy` object of ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-multiple#resource-iteration). This object helps us to deploy multiple instances of a specific resource without duplicating the resource block. A resource, using the `copy` property looks like this:

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "[concat(parameters('vmName'), copyIndex(), '-pip')]",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
  ],
  "copy": {
    "name": "proxyVmPipCopy",
    "count": "[parameters('nicCount')]"
  },
  "properties": {
    "publicIPAllocationMethod": "Static"
  }
}
```

Here, we use the `copyIndex()` function to access the current index of enumeration to generate the name of the public IP address.
We will use resource iteration with the copy object for public IP addresses and network interfaces.

In the below example, we use the `copyIndex()` function to generate the `ipConfigurations` property for the NICs.

```json
{
  "properties": {
    "ipConfigurations": [
      {
        "name": "ipconfig1",
        "properties": {
          "primary": "[if(greater(copyIndex(), 0), 'false', 'true')]",
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]"
          },
          "privateIPAllocationMethod": "Dynamic",
          "publicIpAddress": {
            "id": "[resourceId('Microsoft.Network/publicIpAddresses', concat(parameters('vmName'), copyIndex(), '-pip'))]"
          }
        }
      }
    ]
  }
}
```

With multiple NICs attached to a VM, there has to be one network interface that is marked as primary. To take this into consideration, we compare the current `copyIndex` with 0 and if the index is greater than 0, the value is set to true. In other words, the first NIC is the primary one, all following will be set as secondary.

### Property iteration

The copy object becomes really useful, when used at a property level. So if we want to have multiple data disks deployed with a VM or like in our example multiple NICs attached, we can also use the `copyIndex()` function.
There is just one very important difference, we have to create a new "nested" copy object and refence to it by using the name as a parameter in the `copyIndex()` function.

```json
{
  "networkProfile": {
    "copy": [{
      "name": "networkInterfaces",
      "count": "[parameters('nicCount')]",
      "input": {
        "properties": {
          "primary": "[if(greater(copyIndex('networkInterfaces'), 0), 'false', 'true')]"
        },
        "id": "[resourceId('Microsoft.Network/networkInterfaces', concat(parameters('vmName'), copyIndex('networkInterfaces'), '-nic'))]"
      }
    }]
  }
}
```

In line 2 we create a new copy object, but this time as an array object. The parameters `name` and `count` are the same as before and in addition the `input` property contains the block of ARM code that needs to be iterated.
As mentioned before, we have to use the name of the `copy` object, when getting the current iteration. This happens with `copyIndex('networkInterfaces')` in line 7 and 9.

## Use multiple NICs with Ubuntu

If we want to use the multiple IP addresses for internet access, we have to adjust the routing a little bit. We basically set multiple standard gateways with different priorities and let the application that uses the network decide which interface to use. By default the one with the lowest priority will be used. I have configured the routes as follows:

```bash
ip route add default via 10.0.0.1 dev eth1 metric 101
ip route add default via 10.0.0.1 dev eth2 metric 102
ip route add default via 10.0.0.1 dev eth3 metric 103
```

The routes should look something like this afterwards:

```bash
root@proxyVm:/home/proxyVmadm# ip route show
default via 10.0.0.1 dev eth0 proto dhcp metric 100
default via 10.0.0.1 dev eth1 metric 101
default via 10.0.0.1 dev eth2 metric 102
default via 10.0.0.1 dev eth3 metric 103
10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.6
10.0.0.0/24 dev eth3 proto kernel scope link src 10.0.0.4
10.0.0.0/24 dev eth2 proto kernel scope link src 10.0.0.7
10.0.0.0/24 dev eth1 proto kernel scope link src 10.0.0.5
168.63.129.16 via 10.0.0.1 dev eth0 proto dhcp metric 100
169.254.169.254 via 10.0.0.1 dev eth0 proto dhcp metric 100
```

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
After a VM restart, the routes will reset. To persist the routes, add them to the `/etc/network/interfaces` file (Ubuntu) or `etc/sysconfig/network-scripts/route.ethX` (Centos/RHEL).
::

Now let's see, if all external interfaces are operational by using curl and ipify.org to determine our current external ip address:

```bash
root@vmAdm:/home/vmAdm# curl --interface eth0 api.ipify.org?format=json -w "\n"
{"ip":"40.113.151.139"}
root@vmAdm:/home/vmAdm# curl --interface eth1 api.ipify.org?format=json -w "\n"
{"ip":"40.113.150.10"}
root@vmAdm:/home/vmAdm# curl --interface eth2 api.ipify.org?format=json -w "\n"
{"ip":"40.114.255.212"}
root@vmAdm:/home/vmAdm# curl --interface eth3 api.ipify.org?format=json -w "\n"
{"ip":"40.114.249.137"}
```

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
To reduce complexity, this template does not contain a Network Security Group (NSG). Keep in mind that the VM will be reachable over all public ip from the internet. If you don't want inbound connectivity at all or just for one interface, create and configure a nsg. Never leave a VM exposed to the public internet without a good reason (ADFS, honeypot, etc.).
::

You can find the full ARM template example on [Github](https://gist.github.com/itpropro/3d9ece2dd785b730d39165b86145db80) (truncated preview):
{% ghcode <https://gist.github.com/itpropro/3d9ece2dd785b730d39165b86145db80> 1 15 %}

I hope this post helped explaining the possibilities of the copy object and how to use multiple external IPs in Azure. Like always, share the post if you like it and feel free to update and use the snippets in you own scripts :wink:
