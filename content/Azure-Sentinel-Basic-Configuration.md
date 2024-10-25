---
title: Azure Sentinel Basic Configuration
author: Jan-Henrik Damaschke
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
date: 2020-01-30 05:00:00
---

This article will provide an introduction into the basics of Azure Sentinel. As we already covered the basics in our last post, we will now do some basic configuration tasks to get familiar with the Azure Sentinel interface.

<!-- more -->

This post is a part of our Azure Sentinel series. The following posts are also part of this series:

- [Azure Sentinel Introduction](/Azure-Sentinel-Introduction)
- [Azure Sentinel Basic Configuration](/Azure-Sentinel-Basic-Configuration)
- [Azure Sentinel How to use sigma rules](/Use-sigma-rules-in-Azure-Sentinel)
- [Azure Sentinel Threat Hunting (Coming soon)](/Azure-Sentinel-Threat-Hunting)

<!-- toc -->

## Connectors

The first thing we will do is onboard a Azure Virtual Machine (VM), make some event adjustments and connect some basic Azure services to Azure Sentinel.
As Azure Sentinel is basically a Log Analytics solution, we need to add a virtual machine in the Log Analytics panel. The following gif shows the VM onboarding process:

::blog-image{alt="VM Onboarding" src="posts/azure-sentinel-basic-configuration/OnBoardVm.gif"}
::

Now we should already see a few Heartbeat events in our Azure Sentinel dashboard:

::blog-image{alt="Heartbeat events in Azure Sentinel" src="posts/azure-sentinel-basic-configuration/OnboardingEvents.png"}
::

### EventLog vs. Security Events

The next thing we do is configuring the eventlog forwarding. This is a litle bit more complicated as the settings for eventlog forwarding are split into two places.

- Security Events: ASC/Azure Sentinel Connector
- Other Windows Events: Log Analytics Workspace settings

To configure Security Events directly from Azure Sentinel, click on the
Sysmon

### Azure Services

Finally we will connect some Azure services:

- Azure Activity
- Azure Security Center (ASC)
- Threat Intelligence Platforms
- CEF

## Incidents

The incidents pane is the one you will probably use the most besides the hunting pane. The following picture shows an overview of the
Incident 513 from cim2019 workspace
tagging, comments, assignments
manual
automatic (Playbook)

## Workbooks

Basics
Templates

## Notebooks

Basics
Example Azure Sentinel Github

## Hunting

The "Hunting" pane in Azure Sentinel provides the ability to execute Queries, as well as custom Bookmarks. There are already a lot of hunting queries built-in that are constantly updated from the [Azure Sentinel Github repository](https://github.com/Azure/Azure-Sentinel).
All hunting queries can be classified by one or more tactics based on the MITRE ATT&CK framework. They can also be filtered by data source and the provider, who has created the query (currently custom or Microsoft).
To save results from a threat hunting session there is now the possibility to save a query including the results and optional annotations as a "Hunting Bookmark".
{% alert info %}
To find out which features changed and were added from Preview to General Availability, read our [Azure Sentinel Introduction post](/Azure-Sentinel-Introduction).
{% endalert %}
As this is one of the most important parts of Azure Sentinel, we will cover Threat Hunting and how it is done in the next part.

## Analytics

MITRE ATT&CK
Rules
Scheduled query rule
Severity
Entity mapping
Query scheduling
Alert threshold
Automated response
Example
Microsoft incident creation rule
MS Security service
Severity filter
Name filter
Rule templates

## Playbooks

Basics
Trigger types
Example atp isolation
pricing

## Workspace settings

## Links

[Collecting telemetry from on-prem and IaaS server](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Azure-Sentinel-Agent-Collecting-telemetry-from-on-prem-and-IaaS/ba-p/811760)
[Collecting Azure PaaS services logs in Azure Sentinel](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Collecting-Azure-PaaS-services-logs-in-Azure-Sentinel/ba-p/792669)
[The Syslog and CEF source configuration grand list](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Azure-Sentinel-The-Syslog-and-CEF-source-configuration-grand/ba-p/803891)
[Creating Custom Connectors](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Azure-Sentinel-Creating-Custom-Connectors/ba-p/864060)
