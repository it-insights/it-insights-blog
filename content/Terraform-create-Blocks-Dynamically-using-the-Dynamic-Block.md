---
title: Terraform - create Blocks Dynamically - using the Dynamic Block
category:
  - PowerShell
  - Azure
  - Terraform
  - IaC
  - Infrastructure
  - Automation
  - PowerShell
author: Christoph Burmeister
keywords:
  - PowerShell
  - Azure
  - Terraform
  - IaC
  - Infrastructure
  - Automation
date: 2022-10-19 05:00:00
tags:
---

Some resources in Terraform allow to pass them a list if multiple values can be set - for instance, DNS servers for the **azurerm_virtual_network** can be set this way. However, on the same resouce, you can add subnet during the creation and this would not work in the same way, because each subnet requires their own subnet-block in the resource. However, Terraform offers a way to create mutiple blocks of the same kind dynamically - using the dynamic-block.

<!-- more -->
<!-- toc -->

# Introduction
Using the dynamic-block can be a little much at first, because its an advanced topic. However, you have gotten use to it, its a blast to work with.

# Usage
As shown in the [Azure Vnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network#example-usage) resource shown below, each subnet requires its own subnet block.

```powershell
resource "azurerm_virtual_network" "vnet" {
  name                = "test-vnet"
  location            = azurerm_resource_group.network_rg.location
  resource_group_name = azurerm_resource_group.network_rg.name
  address_space       = ["10.0.0.0/16"]
  dns_servers         = ["10.0.0.4", "10.0.0.5"]

  subnet {
    name           = "subnet1"
    address_prefix = "10.0.1.0/24"
  }

  subnet {
    name           = "subnet2"
    address_prefix = "10.0.2.0/24"
    security_group = azurerm_network_security_group.example.id
  }
}
```

Using the dynamic-block, you can write a module to create, in this case Azure Virtual Networks (Vnet) including their subnet config and provide the subnets as a list.
```powershell
# variables
variable "subnet" {
  type        = list(object({
    name           = string
    address_prefix = string
    security_group = string
  }))

  description = "Subnet list with CIDR and NSG assignment"
}

# resources
resource "azurerm_virtual_network" "vnet" {
  name                = "test-vnet"
  location            = azurerm_resource_group.network_rg.location
  resource_group_name = azurerm_resource_group.network_rg.name
  address_space       = ["10.0.0.0/16"]
  dns_servers         = ["10.0.0.4", "10.0.0.5"]

  dynamic "subnet" {
    for_each = var.subnets

    content {
      name           = subnet.value.name
      address_prefix = subnet.value.address_prefix
      security_group = subnet.value.security_group == "" ? null : subnet.value.source_addresses
    }
  }
}
```

So, how does this work exactly?<br>
As shown above, instead of providing the block name for the subnet, we added a dynamic-block named subnet. The naming of the dynamic block is important, as it must be named like the block the resouce expects. In this case: subnet. Each dynamic-block has a for_each statement. This is the list of blocks you want to create, typically provided as a list in form of a variable. Last, the actual properties are provided in the content block. You address each property using the following notation: **\<name of block\>.value.\<name of property\>** - in this case, subnet.value.name and so on.

It helps to provide those information in form of a variable as shown above and to put this resource into a module.

You can even nest several dynamic block within each other. One example for this would be the Azure Firewall Rule Collection Group (hate this name...).

```powershell
# variables
variable "application_rule_collection" {
  type        = list(object({
    name     = string
    priority = number
    action   = string
    rules    = list(object({
      name = string
      source_addresses  = list(string)
      destination_fqdns = list(string)
      protocols = list(object({
        type = string
        port = number
      }))
    }))
  }))

  description = "application_rule_collection"
}

variable "network_rule_collection" {
  type        = list(object({
      name     = string
      priority = number
      action   = string
      rules = list(object({
        name                  = string
        protocols             = list(string)
        source_addresses      = list(string)
        destination_addresses = list(string)
        destination_ports     = list(string)
      }))
    }))

  description = "network_rule_collection"
}

# resources
 resource "azurerm_firewall_policy_rule_collection_group" "firewall_policy_collections" {
  name               = var.name
  firewall_policy_id = var.firewall_policy_id
  priority           = var.priority

  dynamic "network_rule_collection" {
    for_each = var.network_rule_collection
    content {
      name     = network_rule_collection.value.name
      priority = network_rule_collection.value.priority
      action   = network_rule_collection.value.action

      dynamic "rule" {
        for_each = network_rule_collection.value.rules

        content {
          name                  = rule.value.name
          protocols             = rule.value.protocols
          source_addresses      = rule.value.source_addresses
          destination_addresses = rule.value.destination_addresses
          destination_ports     = rule.value.destination_ports
        }
      }
    }
  }

  dynamic "application_rule_collection" {
    for_each = var.application_rule_collection

    content {
      name     = application_rule_collection.value.name
      priority = application_rule_collection.value.priority
      action   = application_rule_collection.value.action

      dynamic "rule" {
        for_each = application_rule_collection.value.rules

        content {
          name              = rule.value.name
          source_addresses  = rule.value.source_addresses
          destination_fqdns = rule.value.destination_fqdns

          dynamic "protocols" {
            for_each = rule.value.protocols

            content {
              type = protocols.value.type
              port = protocols.value.port
            }
          }
        }
      }
    }
  }
}

```

As you can see in the application_rule_collection setion, there are three nested level of the dynmic-block and there is no limit on how many you can nest together.

I did put together a repo with an example deployment, you can find it [here](https://github.com/chrburmeister/terraform-dynamic).

I hope this was helpful!
