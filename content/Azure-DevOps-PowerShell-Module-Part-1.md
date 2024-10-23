---
title: Azure DevOps PowerShell Module - Part 1
tags:
  - PowerShell
  - Azure
  - DevOps
  - Azure DevOps
  - Automation
author: Christoph Burmeister
date: 2019-01-20T17:17:48.000Z
category:
  - PowerShell
---

If you are like me - at least in terms of lazyness - you automate the stuff that you face more than once. Recently, I came accross the reoccuring task of creating Azure DevOps projects with several teams over and over again.

<!-- more -->

- [Part 1 - Introduction](/azure-devops-powershell-module-part-1)

This is the first post of many other posts to come and I would really appreciate some feedback!

Since I'm a PowerShell guy, I started writing a little Module for this and the first version is now online!

You can get it directly from the PowerShell Gallery:

#### Install

```powershell
Install-Module -Name AzDOps
```

The new Azure PowerShell module uses the prefix 'Az' ([Microsoft Docs link](https://docs.microsoft.com/en-us/powershell/azure/new-azureps-module-az?view=azps-1.1.0)) for the cmdlets - the cmdlets for Azure DevOps use 'AzDo'.

```powershell
Connect-AzDo
Disconnect-AzDo
Get-AzDoGitRepository
Get-AzDoProcesses
Get-AzDoProject
Get-AzDoProjectHistory
Get-AzDoProjectProperties
Get-AzDoSecurityNamespace
Get-AzDoTeam
New-AzDoGitRepository
New-AzDoProject
New-AzDoTeam
Remove-AzDoGitRepository
Remove-AzDoProject
Remove-AzDoTeam
```

::callout{color="amber" icon="i-heroicons-exclamation-triangle"}
Disclaimer:
The module does by far not have the final scope yet. It currently only covers very basic functionality but it will grow over the months to come.
::

#### Connect

To connect to your Azure DevOps organization, you have to create a personal access token first. Open this [link](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=vsts) and follow the instructions. Afterwards, you can save both, the token as well as the name of your Azure DevOps organization as a string to a variable -  then you can connect:

```powershell
$token = "token"
$organizationName = "orgName"

Connect-AzDo -PersonalAccessTokens $token -OrganizationName $organizationName
```

In the future, there will also be an interactive way to connect using Oauth2 - it's planned for the next releases.
Right now, the connection is being established using basic authentication.

When you're connected, you can start using the cmdlets:

```powershell
Get-AzDoProject
Get-AzDoTeam -ProjectId '<projectId>'
New-AzDoProject -Name 'ProjectOne'
```
