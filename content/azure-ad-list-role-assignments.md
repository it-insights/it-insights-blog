---
title: Azure AD - List Role Assignments
tags:
  - Microsoft Azure
  - Azure Active Directory
  - Microsoft Graph
  - PowerShell
category:
  - PowerShell
  - Azure
  - Automation
  - Microsoft Graph
author: Christoph Burmeister
date: 2022-11-15 05:45:00
---

Retrieving a list of all Azure AD role assignments sounds easy enough, right? Well, there are some things to consider, here is waht.

<!-- more -->
<!-- toc -->

# Introduction
Unfortunately, its not straight forward, to get list of all Azure AD role assignments, unless you are not using Privileged Identity Management (PIM).
First, we need the Microsoft Graph PowerShell SDK. Follow these [steps](https://learn.microsoft.com/en-us/powershell/microsoftgraph/installation?view=graph-powershell-1.0).
Currently, to retrieve eligible, its required to set the Microsoft Graph profile to **beta**. Also, those information can only be queried using the Windpws PowerShell.

# Script
The gist can either be found [here](https://gist.github.com/chrburmeister/3376c8fc4afd24c01129d7dfbb42dad0) or explained in detail below.

```powershell
Connect-MgGraph -Scopes RoleEligibilitySchedule.Read.Directory, RoleAssignmentSchedule.Read.Directory, CrossTenantInformation.ReadBasic.All, AuditLog.Read.All, User.Read.All
Select-MgProfile -Name Beta

# get all user to resolve IDs
$users = Get-MgUser -All
# get all groups to resolve IDs
$groups = Get-MgGroup -All

# get all Azure AD role definitions to resolve IDs
$roles = Get-MgRoleManagementDirectoryRoleDefinition

# get all role assignments
$eligible_role_assignments = Get-MgRoleManagementDirectoryRoleEligibilitySchedule -ExpandProperty "*" -All:$true
$assigned_role_assignments = Get-MgRoleManagementDirectoryRoleAssignmentScheduleInstance -ExpandProperty "*" -All:$true

[System.Collections.ArrayList]$resolved_assignments = @()

foreach ($assignment in $eligible_role_assignments) {
    $user = $users | Where-Object { $_.id -eq $assignment.PrincipalId }
    $group = $groups | Where-Object { $_.id -eq $assignment.PrincipalId }

    $obj = [pscustomobject]@{
        'role'         = $roles | Where-Object { $_.id -eq $assignment.RoleDefinitionId } | Select-Object -ExpandProperty DisplayName
        'user'         = $user  | Select-Object -ExpandProperty UserPrincipalName
        'group'        = $group | Select-Object -ExpandProperty DisplayName
        'user_enabled' = $user  | Select-Object -ExpandProperty AccountEnabled
    }

    $resolved_assignments.Add($obj) | Out-Null
}

foreach ($assignment in $assigned_role_assignments) {
    $user = $users | Where-Object { $_.id -eq $assignment.PrincipalId }
    $group = $groups | Where-Object { $_.id -eq $assignment.PrincipalId }

    $obj = [pscustomobject]@{
        'role'         = $roles | Where-Object { $_.id -eq $assignment.RoleDefinitionId } | Select-Object -ExpandProperty DisplayName
        'user'         = $user  | Select-Object -ExpandProperty UserPrincipalName
        'group'        = $group | Select-Object -ExpandProperty DisplayName
        'user_enabled' = $user  | Select-Object -ExpandProperty AccountEnabled
    }

    $resolved_assignments.Add($obj) | Out-Null
}

Write-Output $resolved_assignments
```

I hope this makes your life a little simpler :wink:
