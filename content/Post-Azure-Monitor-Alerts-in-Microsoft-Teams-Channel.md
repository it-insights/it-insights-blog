---
title: Post Azure Monitor Alerts in Microsoft Teams Channel
tags:
  - Azure
  - Functions
  - Azure Function Apps
  - Microsoft Teams
  - Teams
  - Azure Monitor
  - Action Group
  - PowerShell
  - Serverless
  - Azure DevOps
  - Azure Pipelines
  - GitHub
category:
  - Monitoring
  - PowerShell
  - Teams
author: Christoph Burmeister

date: 2021-01-05 05:30:00
---

This topic is not new and quite frankly, it is hard to believe this is still not integrated yet, but at some point, during your cloud journey, you probably want to send monitoring alerts to a certain Teams channel. Even though this is functionality is available for plenty of other services, Azure Monitor still lacks this.

<!-- more -->
<!-- toc -->

## Introduction

In this post, I will showcase how you can create notifications in a Microsoft Teams channel leveraging Azure Functions with PowerShell.
Let's do this!

## Szenario

To post a notification of a triggered Azure Alert, we need an intermediate layer between the Azure Monitor and Microsoft Teams. Azure Monitor alerts trigger assigned Action Groups which perform one or more actions, for instance sending an E-Mail, calling a webhook and several more. One Alert can have several Actions Groups. With this, we you can keep all your Action Groups as they are and add another one which will create a notification in a Microsoft Teams channel.

We will create one global Action Group that can be used to post notifications to a certain Teams Channel from all Azure Alerts. The Action Group has one action configured - calling an Azure Function - which will call the webhook of the Teams channel. The function will process the payload that is send from the alert and put it in a format that can be handled by the Teams channel webhook.

## Setup

### Teams Channel

If you haven’t already, create a team and one dedicated channel for your notifications. Afterwards we need to create a webhook for this channel. Save the webhook for now.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/1.png" alt="Create team and channel for notifications"}
::

Search for webhook and select "Incoming Webhook"

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/2.png" alt="Search for webhook"}
::

Provide Parameters for the webhook:

- Name - for instance something like "Azure Monitor Alerts"
- Customize Image - you can use your trusted internet search engine for the icon of the Azure Monitor

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/3.png" alt="Provide Attributes"}
::

::callout{icon="i-heroicons-information-circle" color="blue"}
Copy the webhook URL and save it to a secure place! We need it later on.
Treat it like a password and do not share or use it in an unsecure manner. Anyone who has this link, can create posts in this particular channel.
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/4.png" alt="Save Webhook URL"}
::

### Function App

To deploy the Function App, I created an Azure DevOps Pipeline.
You can find the pipeline and the entire code in the GitHub Repo [AzureMonitorTeamsNotification](https://github.com/chrburmeister/AzureMonitorTeamsNotification).

#### Setup

##### Azure DevOps Project

You can either create new Azure DevOps project for this, or just use an existing one.

##### Repository

It doesn't matter if you want to use a GitHub repository or an Azure Repository, just copy the code and you can then modify it to your needs. I choose GitHub for obvious reasons :wink:
In case you are using an existing Azure DevOps Project, I suggest creating at least a new repository for the code.

##### Service Connections

You need to create a service connection to your Azure tenant for the subscription you want to use. You can set it up as described in this [MS docs article](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure?view=azure-devops). If you want to use a GitHub repository, create a connection for this as well: [Create GitHub Service Connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#sep-github).

##### Pipeline

With the code in place and the repository connected, we can create the pipeline.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/5.png" alt="Create New Pipeline"}
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/6.png" alt="Select Source"}
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/7.png" alt="Select Repository"}
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/8.png" alt="Select Existing Azure Pipelines YAML file"}
::

Under Path, choose the one existing pipeline file /.azurepipelines/deploy.yml

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/9.png" alt="Choose YAML File"}
::

At first, edit the trigger to your needs and afterwards, edit line 47 and 81 to your Azure Service Connection name and save the pipeline, do not run it yet, it will fail at this point.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/10.png" alt="Save Pipeline"}
::

##### Variable Group

Now we need a new variable group to store the values for the pipeline in.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/11.png" alt="Create Variable Group"}
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/12.png" alt="Save Variable Group"}
::

- create a group called function (this name is currently set in the pipeline, if you want to use another name, you need to change the pipeline value as well)
- add description and add the following values:

| Name                 | Value                                | Secret | Description                                |
| -------------------- | ------------------------------------ | ------ | ------------------------------------------ |
| app_insights_name    | azalerts-appins                      | False  | Name of Application Insights Workspace     |
| function_app_name    | azalerts                             | False  | name of Function App                       |
| function_runtime     | powershell                           | False  | Runtime of Function App                    |
| hosting_plan_name    | azalerts-cons-plan                   | False  | Name of Consumption Hosting Plan           |
| location             | westeurope                           | False  | Name of Azure Region                       |
| resouce_group        | az-teams-alerts                      | False  | Name of the resouce group for the resouces |
| storage_account_name | azalersts3565453stor                 | False  | Name of storage account                    |
| storage_account_type | Standard_LRS                         | False  | SKU of storage account                     |
| subscription_id      | d97f3632-50f0-4d1d-981e-1d92b12528a2 | True   | Azure Subscription ID                      |
| subscription_name    | Prod Sub                             | False  | Name of the Azure Subscription             |
| teams_webhook_url    | <https://outlook.office.com>..       | True   | Webhook URL                                |

::callout{icon="i-heroicons-information-circle" color="blue"}
Change the values to the ones that fit your environment.
::

##### Deployment

With all this in place, the Function App can be deployed, just click the run button within the pipeline and your job should finish like this:

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/13.png" alt="Azure Pipeline Result"}
::

##### Function URl

Go to the Azure Portal and navigate to the created Function App and search for the deployed function **createTeamsChannelNotification**.
::callout{icon="i-heroicons-information-circle" color="blue"}
It can take a few moments right after the deployment for the function to show up.
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/14.png" alt="Get Function URL with Authentication Token"}
::

Save the function url with the authentication token to a secure location, treat this like Teams channel webhook (described above).

### Action Group

Lastly, we need to create the Action Group. Open the Azure Monitor in the Azure Portal and go the Alert section.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/15.png" alt="Manage Action Groups"}
::

Click Manage Actions and create a **Add action group**.

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/16.png" alt="Add Action Group Basic Information"}
::

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/17.png" alt="Add Action Group Basic Information"}
::

Click **Next: Notifications** and leave the section empty, for this, we don't need it.
Click **Next: Actions** and add one action of type **Webhook** and name the action. On the right side, a window pops up, enter the URL of the function from earlier.
Select **Enable the common alert schema**.
The [Common Alert Schema](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alerts-common-schema-definitions) describes the payload that will be sent from the Azure Monitor to the Function App, it contains all the data of the alert.

## Conclusion

Now you can add the action group to your alerts and they will also sent notifications to the Teams channel :wink:
They will look something like this:

::blogImage{src="posts/post-azure-monitor-alerts-in-microsoft-teams-channel/18.png" alt="Azure Alert Teams Notification"}
::

According to the [Common Alert Schema](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alerts-common-schema-definitions), you can change the shown values, just alter the code of the [createTeamsChannelNotification function](https://github.com/chrburmeister/AzureMonitorTeamsNotification/blob/main/function_app/createTeamsChannelNotification/run.ps1) in the facts section.
