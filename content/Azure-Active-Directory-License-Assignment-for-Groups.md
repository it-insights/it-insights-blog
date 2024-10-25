---
title: Azure Active Directory License Assignment for Groups
tags:
  - AzureAD
  - Active Directory
  - License
  - Office 365
category: Azure
author: Jacob Meissner
date: 2019-01-06 14:00:00
---

The Azure Active Directory has for some time been offering the ability to assign licenses to users such as EMS, Office 365 (Exchange, SharePoint, etc.), but can also provide groups with licenses. As soon as a user is added to a group, if there are still enough licenses available, the user will receive the corresponding license assigned to the group. This works with synchronized groups from the local Active Directory as well as with Azure AD Security and dynamic groups.

<!-- more -->

::blogImage{src="posts/azure-active-directory-license-assignment-for-groups/AAD-portal-group.png" alt="Azure AD portal groups"}
::

If a user belongs to more than one group and has activated the same license features (e.g. SharePoint (OneDrive)) or belongs to a group that has licenses for Office 365 with the Exchange and another one that has Office 365 Power BI assigned, these license assignments are automatically merged and an Office 365 license with the functions of both groups is activated for the user.

Here's is an example:

::blogImage{src="posts/azure-active-directory-license-assignment-for-groups/AAD-group-example.png" alt="AD group licensing example"}
::

::callout{icon="i-heroicons-information-circle" color="blue"}
Notice:
The license assignment to groups in the Azure AD is currently still a preview feature. Also Azure AD P1 licenses are required to use dynamic groups.
::
