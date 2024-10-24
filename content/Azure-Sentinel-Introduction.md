---
title: Azure Sentinel Introduction
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
author: Jan-Henrik Damaschke
date: 2019-09-24T16:00:33.000Z
---

Azure Sentinel is Microsoft's security information and event management (SIEM) and security orchestration, automation and response (SOAR) offering for modern SecOps. Now with the announced General Availability of Azure Sentinel, we will take a look and the current features, what changed from the preview and where there is still room for improvement.

::callout{color="blue" icon="i-heroicons-check-circle"}
This Post is Azure CloudShell compatible
::

<!-- more -->

This is a multi part article with the following parts:

- [Part 1 - Azure Sentinel Introduction](/azure-sentinel-introduction)

<!-- toc -->

## What and why?

Let's start with the basics. In the current threat landscape, it's easy to loose sight for what's really important and in times of DevOps, this can rapidly go out of hands. That's why DevSecOps exists, but that is another story. So what is a SIEM/SOAR and why do we need it.

### SIEM

A SIEM is often the heart of a companies security team, respectively the security operations center (SOC). It collects, aggregates, identifies and classifies logs and events from all over the IT landscape. A SIEM also creates incidents from specific data patterns (more modern ones also based on machine learning algorithms), which a security operator can then categorize and analyze.
But like a heart doesn't make a working body, a SIEM alone is just one part of the security tools landscape. A SIEM, like a monitoring tool, needs a lot of adjustment over time. Additionally, we still need analysts that can understand and investigate the incidents, tools for analysis and of course people, strategies and tools to respond to malicious or abnormal activities.

Examples for common SIEM systems are:

- Splunk Enterprise Security
- IBM QRadar
- ArcSight
- McAfee Enterprise Security Manager
- ...

### SOAR

At least for the response part, we can use a SOAR. In addition to a SIEM, a SOAR provides response and orchestration capabilities often in the form of multiple playbooks and integrations into other security tools. As the amount of data collected is continuously increasing, a SOAR enables the security analysts to focus on their core skills and let the orchestration do the initial analysis, handle audit trail, etc..
You might remember Microsoft's 2017 acquisition of Hexadite, a company specialized in automated incident response. The results of the integration of Hexadite into the Microsoft product portfolio can be seen in Microsoft Defender ATP automated investigations available for Windows 10 from 1709 on.

::blog-image{alt="Microsoft Defender ATP automated investigation (Source: Microsoft)" src="https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/images/atp-analyze-auto-ir.png"}
::

But Microsoft hasn't stop there and they have added some of the capabilities to the Azure Security Center (ASC) and with the addition of Machine Learning also to Azure Sentinel. We will cover the details in Part 2 of this series.

Examples for common SOAR systems are:

- ServiceNow Security Operations
- Exabeam
- Demisto Enterprise
- ...

In summary, SIEM and SOAR (which can be provided by the same product) are 2 essential parts of a modern security landscape and although they could be used independently from each other, it makes sense to combine powers.

## Azure Sentinel Features

The Azure Sentinel Preview was initially launched in February 2019 and introduced us to Microsoft's take on the SIEM market. Lets take a look at the current features and what has changed with **GA**:

- Data collection through an increasing number of connectors with the most important being **(GA: New connectors and many out of preview)*** CEF (Common event format)
  - Popular third party network solutions like Palo Alto, F5, Fortinet, Check Point, etc.
  - Cloud Services (AWS, Azure, etc.)
  - Eventlogs
  - Syslog
  - [Microsoft Threat intelligence](https://docs.microsoft.com/en-us/graph/api/resources/security-api-overview?view=graph-rest-beta#threat-indicators-preview) connector **(GA: Now utilized by workbooks and hunting queries)**
- Dashboarding with Azure Workbooks **(GA: Azure Dashboards replaced by Workbooks)**
- Analytics based on Kusto queries **(GA: Separated into "Scheduled query rule" and "Microsoft incident creation rule" + rule templates built-in)**
- Incident management **(GA: support for tagging, comments, and assignments automation)**
- Incident investigation with investigation graph and automated entity mapping **(GA: Investigation graph out of preview)**
- Automated incident response based on Log Analytics Playbooks
- Threat Hunting capabilities **(GA: More out of the box queries)*** with custom Kusto queries classified by [MITRE ATT\&CK framework](https://attack.mitre.org/)
  - with Azure Notebooks based hunting notebooks **(GA: More notebooks)**
  - Hunting Bookmarks **(GA)**
- Machine learning based SecOps with [Fusion](https://azure.microsoft.com/en-us/blog/reducing-security-alert-fatigue-using-machine-learning-in-azure-sentinel/) **(GA: Now enabled by default and configurable in the UI)**
- Azure RBAC Support **(GA)**
- Management API **(GA)**

## Azure Sentinel Basics

Before we can start with Azure Sentinel, we need to take a look at the underlying Azure services first.

### Log Analytics

Log Analytics is the central service for log data in Azure. It is the core of sentinel, powers the query engine and the Azure Workbooks based dashboards. An instance of Log Analytics is called workspace and it uses agents to ingest data, as well as a provided REST API that enabled you to send custom data. The data itself is organized in tables.
For additional features, Log Analytics uses so called solutions. Solutions are a combination of additional visuals and optional configuration for the Log Analytics Agents (OMSAgent).
An example with highly customized visuals and additional agent parameters would be the ["Network performance monitor"](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/network-performance-monitor) solution. It provides completely new UI elements for configuration and consumption of data in addition to custom agent configuration that has much more granular network link and health monitoring.
Azure Sentinel is also a Log Analytics solution and will appear as one in the Log Analytics solutions pane as well as in the portal as separate resource.

### Kusto

Kusto is the query language and engine that is used for everything (big) data and analytics related in Azure. The following services use Kusto right now (and probably some more I forgot):

- Azure Log Analytics
- Azure Monitor (as it is based on Log Analytics)
- Azure Monitor Workbooks
- Azure Data Explorer
- Azure Resource Graph Query

The official reference can be found at <http://aka.ms/kdocs>.

### Azure Workbooks

Azure Workbooks is the new way of dashboarding in Azure. First introduced in Azure Monitor, Azure Workbooks will replace the classic Azure Dashboards throughout the Azure platform. Azure Workbooks are much more flexible due to it's Kusto base queries combined with Markdown/HTML based theming. This provides interactivity like drilldown and selection and filtering for specific objects directly in the dashboard view.
Here is an example of the basic performance workbook and it's edit view with Markdown and the underlying Kusto queries:

::blog-image{alt="Performance workbook dashboard view" src="posts/azure-sentinel-introduction/Workbooks01.JPG"}
::

::blog-image{alt="Performance workbook edit view" src="posts/azure-sentinel-introduction/Workbooks02.JPG"}
::

### Azure Notebooks

[Azure Notebooks](https://notebooks.azure.com/) is Microsofts take on hosted [Jupyter notebooks](https://jupyter.org/). Jupyter notebooks are mostly use by Data Scientists to create and run code (often Python or R, but other languages aka. kernels are available) in the browser. There are many scenarios where you can use Jupyter Notebooks like

- Classroom sessions (create and share Notebooks for certain learning topics to all students)
- Sharing notebooks for specific scenarios with the community
- Use it for internal analytics tasks like threat hunting
- Learning new languages like F# or get started with ML in a predefined reproducible environment

To get started with Azure Notebooks, just create a new project from the Jupyter github repo and try around with some basic examples.

::blog-video{alt="Azure Notebooks import Jupyter examples" src="posts/azure-sentinel-introduction/Azure_Notebooks.gif"}
::

## Azure Sentinel quickstart

Now we have all the knowledge to get started with Azure Sentinel. Let's start by creating our own workspace.

### Create Azure Sentinel workspace

As there are currently no management tools besides the Azure portal available to interact with Azure Sentinel, we use Azure PowerShell to create a Log Analytics workspace and add the required solution afterwards.

::callout{color="blue" icon="i-heroicons-information-circle"}
Currently there are no azure cli commands available to directly create a Log Analytics workspace or manage solutions.
::

```text
Name              : itinsightssentinel
ResourceGroupName : sentineltest
ResourceId        : /subscriptions/{subscriptionId}/resourcegroups/sentineltest/providers/microsoft.operationalinsights/workspaces/itinsightssentinel
Location          : West Europe
Tags              : {}
Sku               : pergb2018
CustomerId        : f5abc23f-1e95-4cdb-aad9-1e02ec036a46
PortalUrl         :
ProvisioningState : Succeeded
```

Next we need to deploy the solution using the following PowerShell commands (don't forget to replace `{subscriptionId}` in the body object):

```powershell
$subscriptionId = (Get-AzContext).Subscription.Id

$accessToken = (az account get-access-token | convertfrom-json).accessToken

$header = @{
  'Content-Type'='application/json'
  'Authorization'= "Bearer $accessToken"
}

$body = @'
{
  "location": "westeurope",
  "properties": {
    "workspaceResourceId": "/subscriptions/{subscriptionId}/resourceGroups/sentineltest/providers/Microsoft.OperationalInsights/workspaces/itinsightssentinel"
  },
  "plan": {
    "name": "SecurityInsights(itinsightssentinel)",
    "publisher": "Microsoft",
    "promotionCode": "",
    "product": "OMSGallery/SecurityInsights"
  }
}
'@

Invoke-RestMethod -Method Put -Body $body -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/sentineltest/providers/Microsoft.OperationsManagement/solutions/SecurityInsights(itinsightssentinel)?api-version=2015-11-01-preview" -Headers $header
```

```text
{
plan       : @{name=SecurityInsights(itinsightssentinel); publisher=Microsoft; promotionCode=; product=OMSGallery/SecurityInsights}
properties : @{workspaceResourceId=/subscriptions/{subscriptionId}/resourceGroups/sentineltest/providers/Microsoft.OperationalInsights/workspaces/itinsightssentinel;
             provisioningState=Succeeded; creationTime=Mon, 01 Jan 0001 00:00:00 GMT; sku=; lastModifiedTime=Mon, 01 Jan 0001 00:00:00 GMT; containedResources=System.Object[]}
id         : /subscriptions/{subscriptionId}/resourcegroups/sentineltest/providers/Microsoft.OperationsManagement/solutions/SecurityInsights(itinsightssentinel)
name       : SecurityInsights(itinsightssentinel)
type       : Microsoft.OperationsManagement/solutions
location   : West Europe
}
```

::callout{color="amber" icon="i-heroicons-exclamation-triangle"}
The above method is completely undocumented and was just achieved due to some reverse engineering. For some reason, the cmdlet `Set-AzOperationalInsightsIntelligencePack -ResourceGroupName "sentineltest" -WorkspaceName "itinsightssentinel" -IntelligencePackName "SecurityInsights" -Enabled $True` currently doesn't enable Sentinel.
::

### Browse the Azure Sentinel Workspace

You can find it in the Azure portal by searching for Sentinel and clicking on the Azure Sentinel workspace, we just created.

::blog-image{alt="Sentinel workspaces overview" src="posts/azure-sentinel-introduction/SentinelWorkspace01.JPG"}
::

::blog-image{alt="Sentinel workspace" src="posts/azure-sentinel-introduction/SentinelWorkspace02.JPG"}
::

## Summary

Now we have setup a Log Analytics workspace with an Azure Sentinel solution.
In our next part, we will cover every part of Azure Sentinel in depth and do some basic configuration as well as onboarding examples.

## Links

- [Azure Sentinel Documentation](https://docs.microsoft.com/en-us/azure/sentinel/)
- [Azure Sentinel Best practices](https://techcommunity.microsoft.com/t5/Azure-Sentinel/Best-practices-for-designing-an-Azure-Sentinel-or-Azure-Security/ba-p/832574)
- [Azure Sentinel Github repo](https://github.com/Azure/Azure-Sentinel)
- [Kusto Best Practices](https://docs.microsoft.com/en-us/azure/kusto/query/best-practices)
