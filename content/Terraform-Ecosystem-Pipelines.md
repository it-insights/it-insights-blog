---
title: Terraform Ecosystem Pipelines
category:
  - Azure
  - IaC
author: Christoph Burmeister
keywords:
  - PowerShell
  - Azure
  - Terraform
  - IaC
  - Infrastructure
  - Automation
date: 2023-02-05 05:45:00
tags:
---

The Ecosystem surrounding Terraform is growing every day. Some of the tools have become essential and need to be integrated into your CI/CD pipelines. Here are some examples using Azure DevOps.

<!-- more -->

<!-- toc -->

## Introduction

This is an quick overview for some tool you should check out, when you want to work properly with Terraform.
Terraform has sparked an entire ecosystem of other tools to make your life better. Terraform itself has some testing integrated, even if its not the greatest, better than nothing, right? _terraform fmt_ formats your code, _terraform validate_ checks for invalid configurations. If you want to do more, you have come to the right place.

## TL;DR

You can find the pipeline code in the Repo [terraform-pipelines](https://github.com/chrburmeister/terraform-pipelines) on my GitHub account. All pipelines are written for Azure Pipelines and with a heavy use of templating.

## Prerequisites

The pipelines are written for Azure Pipelines, and they have some prerequisites.

- secure files
  - authentication for terraform is done using secure files - two files
    - env_\<env name\>_backend.sec.tfvars
      - credentials for azurerm backend
    - env_\<env name\>.sec.tfvars
      - credentials for azurerm provider to access resources

## Pipelines

All files related to pipelines are stored in the repo root in the folder **.azuredevops**. In there are two folders:

- pipelines
  - contains all pipelines definitions - these files are added in Azure Pipelines
- templates
  - three subfolders - one for each kind of template
    - steps
    - jobs (empty in this example)
    - stages

### [Infrastructure Deployment](https://github.com/chrburmeister/terraform-pipelines/blob/main/.azuredevops/pipelines/infrastructure_deployment.yml)

The bread and butter - a pipeline to deploy your terraform cofiiguration.
It consists of two stages - the first creates a terraform plan and checks, if changes were made. If changes were made, the second stage - terraform apply - will run, otherwise, it will be skipped and the run is complete

### [Terraform Docs](https://github.com/chrburmeister/terraform-pipelines/blob/main/.azuredevops/pipelines/create_terraform_docs.yml)

To automatically create a docs.md for the root module as well as any other module, this pipeline uses [terraform-docs](https://terraform-docs.io) to commit the documentation directly during the pipeline run. This pipeline is meant to be used as a build-validation pipeline for pull requests.

### [terraform fmt](https://github.com/chrburmeister/terraform-pipelines/blob/main/.azuredevops/pipelines/post_commit_terraform_fmt.yml)

Formats the terraform code according to best practices. Commits changes directly to the current branch. Meant to be used as a build validation pipeline in your pull requests. Official Docs [here](https://developer.hashicorp.com/terraform/cli/commands/fmt).

### [Infrastructure Validation](https://github.com/chrburmeister/terraform-pipelines/blob/main/.azuredevops/pipelines/post_commit_infrastructure_validation.yml)

This is where the magic happens, this pipeline runs several tests against your terraform code and publishes the results in junit format to the pipeline. If there are any errors, the run fails.

- [terraform validate](https://developer.hashicorp.com/terraform/cli/commands/validate)
- [tflint](https://github.com/terraform-linters/tflint)
- [tfsec](https://github.com/aquasecurity/tfsec)
- [terrascan](https://github.com/tenable/terrascan)

## Conclusion

This is not all, there are many tools for Terraform, but some of my favorites, nevertheless. Its a great way to perform some level of automated testing as well as creation of documentation.
