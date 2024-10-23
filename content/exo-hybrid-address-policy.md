---
title: Exchange hybrid user migration
tags:
  - Office 365
  - Exchange Online
category: Office 365
author: Jacob Meissner
date: 2019-02-18 00:05:00
---

During an Exchange online migration, some preparations must take plce in advance so users can be migrated easily to the cloud.
A typical error in the mailbox migration process occurs because of the mail domain (property: smtp/proxyaddresses) with the message "Target mailbox doesn't have an smtp proxy".
<!-- more -->

First thing in the troubleshooting process is to check whether the mail domains for the users are also configured properly in the Office 365 tenant settings and whether the respective DNS entries and verification checks have been performed.

A local user mailbox usually has a number of mail addresses. When migrating to Office 365 or Exchange Online, only mailboxes with valid e-mail addresses can be migrated. This means, local addresses like domain.local or ad.lan as well as all other domains that are not available in Office 365 must be removed prior to the migration.

To avoid this, a simple address policy can be applied to the users that are about to be migrated - using PowerShell of course:

```powershell
Get-EmailAddressPolicy “Policy” | Set-EmailAddressPolicy -EnabledEmailAddressTemplates @(‘smtp:%m@domain.de’, ‘ smtp:%m@domain2.de’, ‘ SMTP:%m@primarydomain.de’, ‘ smtp:%m@tenant0365.mail.onmicrosoft.com’)

<#
%g -> First name
%s -> Last name
%d -> Display name
%m -> Exchange alias
%xg -> first x letters first name
%xs -> first x letters Last name
#>
```

::callout{icon="i-heroicons-information-circle" color="blue"}
Notice:
After modifying the address policy, don't forget to sync the object changes from your local AD to the Azure AD.
The default value is 30min or start it manually on the AD Connect server using Powershell and the cmdlet Start-ADSyncSyncCycle to force the sync.
::
