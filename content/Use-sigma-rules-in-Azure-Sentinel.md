---
title: Use sigma rules in Azure Sentinel
author: itinsights
draft: true
tags:
  - Security
  - Azure Sentinel
  - Azure
  - Log Analytics
  - Jupyter
  - CloudShell
category:
  - Azure
  - Azure Sentinel
date: 2020-03-03 05:00:00
---

If you have worked with the sigma specification or tool that implement it in the past, you probably want to continue use your sigma rules. For anyone who is new to Azure Sentinel, sigma rules are a great way to learn about signature rules and specifications that practically all modern SIEM systems support. We will convert existing sigma rules to Log Analytics queries (KQL) that are usable in Azure Sentinel (KQL) and apply them to our Azure Sentinel Workspace.

<!-- more -->

This post is a part of our Azure Sentinel series. The following posts are also part of this series:

* [Azure Sentinel Introduction](/Azure-Sentinel-Introduction)
* [Azure Sentinel Basic Configuration](/Azure-Sentinel-Basic-Configuration)
* [Azure Sentinel How to use sigma rules](use-sigma-rules-in-azure-sentinel)
* [Azure Sentinel Threat Hunting (Coming soon)](/Azure-Sentinel-Threat-Hunting)

<!-- toc -->