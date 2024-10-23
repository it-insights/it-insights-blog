---
title: Start/Stop AKS and ADX Clusters with GitHub Actions and Azure Pipelines
tags:
  - Azure
  - Azure Pipelines
  - GitHub
  - Github Actions
  - CI/CD
  - Automation
  - Continuous integration
  - continuous delivery
  - Azure Kubernetes Services
  - AKS
  - Azure Data Explorer
  - ADX
  - PowerShell
  - MVP
category: Azure
  - DevOps
  - GitHub
  - Continuous Integration
  - Continuous Delivery
  - CI/CD
  - Cloud Infrastrucure
  - PowerShell
  - Automation
author: Christoph Burmeister

date: 2022-03-28 05:45:00
---

Azure Kubernetes Services (AKS) and Azure Data Explorer (ADX) clusters are SaaS offerings based on virtual machines. It is probably the oldest way to safe money in the cloud - just turn them off when you do not need them - here are two ways to do this.
<!-- more -->
<!-- toc -->

## TL;DR

In this GitHub [repository](https://github.com/chrburmeister/start-stop-aks-adx), I habe created some templates for GitHub Actions and Azure Pipelines to start and stop AKS and ADX clusters. You can use these templates in your own pipelines to start and stop your services based on cron triggers/schedules.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
The repo only contains the templates, you need to write the calling pipelines yourself. You can check my blog series on GitHub Actions and Azure Pipelines [here](https://itinsights.org/azure-pipelines-migration-to-github-actions-part1/).
::

## Introduction

The first thing most consultants say during cloud evaluations, onboardings, and shifting workloads is: turn off your VMs, when you don't need them. While this is a valid point, the same thing goes for services based on VMs, like AKS and ADX.
While I like the DevOps approach better: deploy the infrastructure, perform some kind of task, destroy the infrastructure when it is not required anymore. However, this can be a little too much overhead when you have several developers or want to run several tests at once.
Dev/Test/QA environments often run 24/7, and in the cloud, this produces a lot of consumption. I found, AKS and ADX clusters for such environments often don't need to run that much, during business hours is enough.

## Templates

I created pipeline templates for GitHub Actions and Azure Pipelines that you can use to start and stop your AKS/ADX cluster entirely, if you want to.
Both are based on a simple PowerShell script and can be four in this GitHub [repository](https://github.com/chrburmeister/start-stop-aks-adx).
