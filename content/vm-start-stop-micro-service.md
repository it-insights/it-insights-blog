---
title: Azure VM Start-Stop Micro-Service
tags:
  - Azure
  - Terraform
  - MVP
  - Infrastructure as Code
  - IaC
  - Micro Service
  - PowerShell
  - EventHub
  - Log Analytics
  - Function Apps
  - Serverless
category: Azure
  - Terraform
  - Cloud Infrastrucure
author: Christoph Burmeister

date: 2022-02-01 05:45:00
---

One of the first things IT departments do when they start moving workloads to the cloud, is stopping their VMs on a regular basis to safe money. There are plenty of functions and ways to do this, but I thought, a different approach might be fun too - building this as a micro service with several components on Azure.

<!-- more -->
<!-- toc -->

## TL;DR

Check out my [VM Start Stop Micro Service](https://github.com/chrburmeister/vm-start-stop-micro-service) repository on GitHub.

## Introduction

The idea is pretty much the same as any in this regard - tag the VMs with a **startup-** and **shutdown-time** tag and run some kind of automation to check the tags and the current time.
But in this case, we run several functions with several components.

## Architecture / Implementation

The architecture below shows how the components interact. The main orchestrator is the function app, the **vm_check** function to be exact. This one runs every 5 minutes to check the VMs for the tags **startup-** and **shutdown-time**. If the time for either operation matches, a message is being added to the particular queue of the storage account. When a message is added to either queue, another function gets triggered to perform the action (start/stop).

::blogImage{src="posts/vm-start-stop-micro-service/architecture.png" alt="Architecture"}
::

### Function App

The Function App is where everything starts and comes together. Actually, the function **trigger** has a cron trigger set to run every 5 minutes which then calls the function **check_resources** (using an http request )because for some reason, a function with a cron trigger can not have two queue outputs.

The Function App has a managed service identity configured to access the subscriptions.

Also, I have added three configuration settings:

- QUEUE_CONNECTION_STRING
  Connection to access the queue storage
- CHECKER_URL
  URL for the function **check_resources**
- ACCESS_KEY
  Access key to access the function **check_resources**

The tags in my case are configured to use UTC but you can set it to any time zone you want.

### Azure Queue Storage

Azure offers several queuing services, but most of them are for more advanced scenarios. Azure Queue Storage is the best and cheapest way to fulfill our requirements.
Azure Storage Accounts have several endpoints (depending on the SKU) and one of them is queue storage. You can create several queues and address them using the public endpoint.

### Setup

Go the the GitHub repository [VM Start Stop Micro Service](https://github.com/chrburmeister/vm-start-stop-micro-service), I have added all the steps to the README.md.

## Conclusion

I really like this approach because its a more modern than just a script running on a an automation account and you can learn something along the way :wink:

### Other Use Cases

You could also use this to start and stop other VM-based Azure services like Azure Kubernetes Services cluster or Azure Data Explorer Cluster.
