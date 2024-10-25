---
title: PowerShell in Azure Functions v2 is generally available
tags:
  - PowerShell
  - Azure
  - Automation
  - Azure Functions
  - Serverless
category:
  - PowerShell
  - Azure Functions
  - Serverless
author: Christoph Burmeister
date: 2019-12-01 23:56:43
---

I've been waiting a long time for this and its finally here - PowerShell Support for Azure Functions v2 is generally available and ready for production! On the 4th of November at Ignite 2019, the general availability has been announced. This alone is a big step for automating tasks in Azure, but there is more, the Product Group also announced the general availability of the Premium Plan for Azure Functions! With this, Azure Function Apps can seamlessly be integrated within your VNet.

<!-- more -->
<!-- toc -->

## Introduction

PowerShell Support for Azure Function v2 has been around since April 2019 - now is has become GA! With the additional integration into VNets, this is no longer just a Solution for automating things in Azure, this also opens up the possibility to use Azure Functions within operating systems. In this Post, I will go over the Setup of an Function App and everything you need to know to get started with PowerShell in Function Apps.
For the VNet Integration part, I will make a separate Post.

## Setup

### Resouce Group / VNet

If you haven't already created a Resource Group and a VNet, use the code down below to create them:

```powershell
$location = 'westeurope'
$rgName = 'functionAppTest'
New-AzResourceGroup -Name $rgName -Location $location
```

### Function

Go to the Resource Group you want to deploy the Function App in and click the Add-button in the top left hand corner and type Function App.

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup1.png" alt="Azure Function Setup #1"}
::

Under publish, select code and under Runtime Stack, select PowerShell Core.

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup2.png" alt="Azure Function Setup #2"}
::
The PowerShel Runtime Stack is hosted on Windows, Linux can not be selected.
The important part is to select the Premium as Plan Type - under SKU and Size you can select the plan you select the appropriate SKU:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup3.png" alt="Azure Function Setup #3"}
::

In the next window, you can choose to setup Application Insights for the Function App - I would recommend doing it.

### VNet Integration

Navigate to your newly created Function App and go the Platform Features tab and select Networking:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup4.png" alt="VNet Integration Setup #1"}
::

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup5.png" alt="VNet Integration Setup #2"}
::

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/setup6.png" alt="VNet Integration Setup #3"}
::
Even though it says that this is still in preview, its not :wink:
Select the VNet you want to access from and select the desired subnet.

### Managed Identity

To be able to use the Azure Function within Azure, we need to enable the Managed Identity:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/manaedIdentity.png" alt="enable Managed Identity #1"}
::

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/manaedIdentity2.png" alt="enable Managed Identity #2"}
::

Afterwards, you can set use the Managed Identity to add it to the Subscription/s or Resource Group/s with the appropriate permission in order to use it for managing Azure resources.

## PowerShell in Azure Functions

In Functions v1, the PowerShell was included in the C# Runtime, in v2, it a separate Runtime for itself, those Function Apps can only run PowerShell. V2 runs PowerShell Core on Windows - currently in Version 6.2.3 - this is always the latest stable version of PowerShell.
From v1 to v2, a lot of things have changed and I will go over the most important parts you need to know to get started.

### Triggers and Bindungs

Azure Functions are Event driven - this means, they will run when a specific event occurs. This can an HTTP-Trigger, a timer based trigger (cron), the appearance of a message in a Queue, and many more. Bindings are the information/data that get passed to the Function or the data that the function returns - this can be the body of an http request, the data in the message of a queue and many more - you can find the an overview of all Triggers and Bindings [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings#supported-bindings) - this list also shows if the Binding is for input, output or both.

After you created a Function the Trigger can not be changed, however, you can change the Bindings.
The Bindings can be changed under the Integrate menu for each function:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/functionIntegrate.png" alt="Function Integrate"}
::

The fields that are shown in the Integrate menu depend on the chosen trigger.

### Create and Edit Functions

#### In Portal

PowerShell Functions can be created and edited directly in the Azure Portal - I have to admit, its not the best experience since it is very slow but it enables us to create and edit functions very quickly.

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/createFunction1.png" alt="Function Setup #1"}
::

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/createFunction2.png" alt="Function Setup #2"}
::

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/createFunction3.png" alt="Function Setup #3"}
::

#### Visual Studio Code

The local runtime Environment for Azure Functions enables you to develop locally on your own box instead of running the code directly in the Cloud. You can learn more about this in the following [Docs Article](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-powershell).

### Functions

Lets create a function with an http Trigger - the code, that is in the function by default is the following:

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Interact with query parameters or the body of the request.
$name = $Request.Query.Name
if (-not $name) {
    $name = $Request.Body.Name
}

if ($name) {
    $status = [HttpStatusCode]::OK
    $body = "Hello $name"
} else {
    $status = [HttpStatusCode]::BadRequest
    $body = "Please pass a name on the query string or in the request body."
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
    Body = $body
})
```

This is really good place to start if you are new to PowerShell in Azure Functions - the most important parts are the parameters and the Push-OutputBinding cmdlet.

#### Passing Parameters - $Repuest

In the variable $Requests contains all information that are passed to the function. You can read more about this in the [MS Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-powershell#request-object) documentation.

If you output the variable $Requests you get the information of the function run - the passed Body, Headers, the Query, which http method was used and more.

According to the REST-API standard, parameters can be passed to an REST based API in two different ways, either by putting them into a Body or adding them to the URI as Query-Parameters. Depending on the purpose of the function, a GET Method can not have a body, but you might want to pass some parameters to the function in order to minimize the output - this is where Query-Parameters come into play.

```bash
'https://<functionName>.azurewebsites.net/api/<functionName>?<parameterName>=[<parameterValue>]&code=[token]'
```

The first passed parameter is separated by the ?, all other parameters are separated by the &.

If you pass parameters like this, you can access them inside the function with:

```powershell
$Requests.Query.<parameterName>
```

If you pass the parameters using a Body, just access the .body property:

```powershell
$Requests.Body.<parameterName>
```

::callout{icon="i-heroicons-information-circle" color="blue"}
You can change the name of the $Requests variable to anything you want within the Integrate menu of each function.
::

#### $TriggerMetadata

The variable $TriggerMetadata can be used to supply more information about the Trigger. Often it's not necessary and it could be removed from the function - read this [MS Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-powershell#triggermetadata-parameter) article to learn more about this Parameter and when to use it.

#### Output - Push-OutputBinding

The Push-OutputBinding cmdlet is used to send the data you want to the configured Output-Binding - this can be a http response, add a Message to a Queue, add a row a Cosmos DB and many more.
This cmdlet checks in the background which Binding/s is/are in place and acts accordingly.
Below you'll find some examples for different outputs:

Cosmos DB:

```powershell
Push-OutputBinding -Name outputDocument -Value (ConvertTo-Json -InputObject @{'Key' = 'Value'})
```

http:

```powershell
Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = (ConvertTo-Json -InputObject @{'Key' = 'Value'})
})
```

Depending on the -Name parameter, the cmdlet behaves differently:

- When the specified name cannot be resolved to a valid output binding, an error is thrown
- When the output binding accepts a collection of values, you can call Push-OutputBinding repeatedly to push multiple values
- When the output binding only accepts a singleton value, calling Push-OutputBinding a second time raises an error

You can read more about the Push-OutputBinding cmdlet in this [MS Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-powershell#writing-output-data) article.

#### Output - Logs

There are several ways to produce Log Output - each has its own use and that what we're used to in PowerShell
Write-Output and Write-Host can be used to print information, Write-Warning prints a warning and - you guessed it - Write-Error prints an error:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/output.png" alt="Console Output"}
::

Write-Debug and Write Verbose can also be used, but you need enable verbose logging for the entire Function App first - this is done by editing the host.json file.

These logs can be also be accessed in the storage account as well as Application Insights - assuming you enabled it.

### Profile

Like any other local PowerShell, each PowerShell-Runtime based Function App has a PowerShell Profile which is loaded on a cold start.
To understand this, you need some information for the folder structure of a Function App. During the creation, a Storage Account gets created as well, this is where all the Data is stored.
During the setup, a file share is created that holds all files:

::blogImage{src="posts/powershell-in-azure-functions-v2-is-generally-available/storageAccountFileShare.png" alt="Function App Storage Account - Data Share"}
::

Use the [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) to access the share.
The profile can be found under '\<share\>/site/wwwroot/profile.ps1'

```powershell
# Azure Functions profile.ps1
#
# This profile.ps1 will get executed every "cold start" of your Function App.
# "cold start" occurs when:
#
# * A Function App starts up for the very first time
# * A Function App starts up after being de-allocated due to inactivity
#
# You can define helper functions, run commands, or specify environment variables
# NOTE: any variables defined that are not environment variables will get reset after the first execution
# Authenticate with Azure PowerShell using MSI.
# Remove this if you are not planning on using MSI or Azure PowerShell.

if ($env:MSI_SECRET -and (Get-Module -ListAvailable Az.Accounts)) {
  Connect-AzAccount -Identity
}

# Uncomment the next line to enable legacy AzureRm alias in Azure PowerShell.
# Enable-AzureRmAlias
# You can also define functions or aliases that can be referenced in any of your PowerShell functions.
```

This is the default profile but you can customize it to your needs - this is also the place, where the authorization for the Managed Identity happens.

### Modules

A very important part are modules in PowerShell - this is not different in Function Apps. Normally, you would use the Install-Module cmdlet to load them, but this takes long and is not recommended, its faster and better to install modules up front.

Like the Profile, the modules are stored within the share '\<share\>/site/wwwroot/Modules'. After the Function App is created, this folder doesn't exist, you can just go ahead and create it manually. After this, you can just copy the module you want to use into the folder and use it within the functions.
Be aware, you need to follow the standard PowerShell Module folder structure:

'<share>/site/wwwroot/Modules/\<module Name\>/\<Version\>/\<Module Data\>'

## Conclusion

Now you have everything you need to know to get started with PowerShell in Azure Functions!

You can checkout my previous posts: Azure Maintenance Functions [Part 1](https://itinsights.org/azure-maintenance-functions-part-1/) and [Part 2](https://itinsights.org/azure-maintenance-functions-part-1/).
