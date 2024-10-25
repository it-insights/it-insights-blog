---
title: Terraform Deployment Structure
tags:
  - Azure
  - Terraform
  - MVP
  - Infrastructure as Code
  - IaC
category: Azure
  - Terraform
  - Infrastructure as Code
author: Christoph Burmeister

date: 2022-01-21 05:45:00
---

Using Terraform has become mainstream at this point and I would like to share with you, how I like to structure my deployments.

<!-- more -->
<!-- toc -->

## Introduction

When you write Terraform deployments, you have a specific goal. However, you might want to reuse code you wrote previously and this is where modules comes into play.
Modules play a big role if you want to become more efficient and create new deployments faster.
The goal is to create one generalized deployments, that can be used to deploy several environments.

## Disclaimer

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
This is not a Terraform tutorial and it will not explain how Terraform works.
::

## TL;DR

Check out my [terraform](https://github.com/chrburmeister/terraform) repository on GitHub.

## General Files

In your repo, create a folder called **terraform**.
This is the base for everything about your deployment.
I then proceed by creating separate files for all general information about the deployment (valid for any environment):

### providers.tf

providers.tf contains the entire configurations of all necessary Terraform providers:

```powershell
provider "azurerm" {
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
  features {}
}
```

### versions.tf

versions.tf contains all provider versions:

```powershell
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "2.90.0"
    }
  }

  required_version = ">= 1.1"
}
```

### backends.tf

backends.tf is where all backends are configured:

```powershell
terraform {
  backend "azurerm" {}
}
```

### variables.tf

At this point, you might have guessed it, variables.tf contains all necessary variables of the deployment:

```powershell
variable "tags" {
  type        = map(any)
  description = "Tags for Azure resouces"
}
variable "tenant_id" {
  type        = string
  description = "Azure tenant id"
}
variable "subscription_id" {
  type        = string
  description = "Azure subscription id"
}
...
```

### main.tf

Last but not least, the main.tf is where it all comes together. From here, I call either my resource- or service modules.
One addition, I like to create a local section right in the root of the file to define all resource names. I then add an environment name in the .tfvars-file:

```powershell
locals {
  resource_group_name  = "comp-base-${var.environment}-rg"
  storage_account_name = "compbase${var.environment}st"
  key_vault_name       = "comp-base-${var.environment}-kv"
}
```

## Environment Specific Files

Environment specific files must be created for each environment you want to deploy.

### env_\<env name\>.sec.tfvars

Contains all secrets for interacting with the specified providers.

```powershell
client_id     = ""
client_secret = ""
```

### env_\<env name\>_backend.sec.tfvars

Contains all secrets for interacting with the specified backends.

```powershell
storage_account_name = ""
resource_group_name  = ""
container_name       = ""
key                  = ""
access_key           = ""
```

### env_\<env name\>.tfvars

Contains all variables (except secrets and backend-config)

## Folders

Within the terraform folder, create the following folders:

### modules

Modules in Terraform make it easy to reuse code you wrote before and to share them with your colleagues.

The modules folder contains the following two sub-folders:

#### resource_modules

Resource modules represent one resource and one resource only.
Simplicity is key.
However, there are some exceptions, for example: when you provision a key vault and you want to deploy secrets to this very key vault within the same deployment.
For this, it would be ok to add an access policy for your terraform service principal in the same resource module - at least as far as I am concerned.

#### service_modules

Service modules describe a set of resources to represent a final service.
One example would be a basic virtual machine, because it consists at least of three resources:

- OS Disk
- Network Interface
- Virtual Machine

In this scenario, we would have three resouce modules for the above described resources and the service module calls them.
The service module is being called from the main.tf.

## Overview

To visualize all this better, the following chart shows how it all works

::blogImage{src="posts/terraform-deployments/files_folders.png" alt="Files and Folders Overview"}
::

## Other Files

### .gitignore

GitHub has a default terraform .gitignore-file, that needs to be extended by a few files.

```powershell
# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# .sec.tfvars
*.sec.tfvars

# .tfplan
*.tfplan

# .terraform.lock.hcl file
*.lock.hcl

# Crash log files
crash.log

# Ignore any .tfvars files that are generated automatically for each Terraform run. Most
# .tfvars files are managed as part of configuration and so should be included in
# version control.
#
# example.tfvars

# Ignore override files as they are usually used to override resources locally and so
# are not checked in
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Include override files you do wish to add to version control using negated pattern
#
# !example_override.tf

# Include tfplan files to ignore the plan output of command: terraform plan -out=tfplan
# example: *tfplan*
```

I added exceptions for the following files:

- *.sec.tfvars
- *.tfplan

I like to run terraform with two stages or jobs in a pipeline:

- terraform init / terraform plan
  - creates a **run.tfplan** file that will be consumed in the next stage/job
- terraform init / terraform apply

## Final Thoughts

When you reuse modules, I would recommend to copy them each deployment individually, because you often need to adjust them and when you pull them from a central place, it could break other deployments - not very convenient :wink:

- create a repo with all your resource- and service modules
- update them if you need to for each deployment
- always write descriptions for variables
- don't overdo it with parameters
- not too few parameters either
- crate dependencies implicitly instead of explicitly

I hope you like it and if you have any suggestions or questions, please reach out on twitter [@chrburmeister](https://twitter.com/chrburmeister).
