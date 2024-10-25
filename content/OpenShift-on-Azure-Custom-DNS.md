---
title: OpenShift on Azure - Custom DNS
tags:
  - RedHat
  - OpenShift
  - Azure
  - Automation
  - DNS
  - Ansible
  - Kubernetes
category: RedHat OpenShift
author: Christoph Burmeister
date: 2019-03-03 21:02:00
---

If you are using RedHat OpenShift on Azure as your container platform, you are most likely using Azure DNS to resolve names of your cluster nodes – at least when you deployed it using the [ARM-Template](https://github.com/Microsoft/openshift-container-platform) provided by Microsoft with Azure as the OpenShift cloud provider instead of an “Bare-Metal” installation on Azure VMs without an cloud provider config.

<!-- more -->

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Disclaimer:
The explained scenario down below is currently not officially supported by RedHat and you should be very careful if you use it in a production grade environment because it may impact applications on your Cluster.
::

All the pods running on your compute nodes will have the same DNS servers as the host, because it’s the default inheritance in Kubernetes.

Servers on Azure receive their IP configuration from the Azure DHCP-service. This results in configurations on the server - on Linux, the file /etc/resolve.conf gets filled with the custom DNS servers configured in your VNET.

If you run the command:

```bash
hostname -f
```

you will get the hostname and the Azure internal DNS-Name, something like:

```bash
server1.tido0jwesfsdflksjkl7485wi4392jf.gx.internal.cloudapp.net
```

This means, your pods will not be able to use the DNS-suffix of your local domain to resolve DNS-names,
Assuming you want to use your local domain for DNS, you need to modify the file

```bash
sudo vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

and add the property DOMAIN=yourdomain.local

```bash
DEVICE=eth0
ONBOOT=yes
BOOTPROTO=dhcp
TYPE=Ethernet
USERCTL=no
PEERDNS=yes
IPV6INIT=no
NM_CONTROLLED=yes
DHCP_HOSTNAME=server1
DOMAIN=yourdomain.local
```

After restarting the server, your server has the wanted fqdn

```bash
hostname -f

server1.yourdomain.local
```

Of course you should apply these changes using Ansible to all nodes in your cluster and you must update the inventory file because now your hosts need to use the new fqdn.
