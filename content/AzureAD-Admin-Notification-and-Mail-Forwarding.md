---
title: Azure AD Admin & PIM Account Email Forwarding
tags:
  - Azure Active Directory
  - Microsoft 365
  - Privileged Identity Management
category:
  - Azure Active Directory
author: Jacob Meissner
comments: false
date: 2022-09-19T18:21:17.000Z
---

Do you have administrative accounts without a mailbox and still want to receive notifications in your primary mailbox? - Here is how it works!

<!-- more -->

Best practice is to create and use dedicated administrative accounts to manage Azure and Microsoft 365. These accounts should be authorized by an RBAC concept and PIM (Privileged Identity Management) and should not have a mailbox (Exchange Online) license to minimize the attack surface.

However, there is a requirement that the notification e.g. PIM or other alerts must be sent to the user.

To implement this, you can use the Exchange format "+" (plus addresses) to implement this requirement.

The following example shows the functionality and configuration of the feature.

### Start situation / Example scenario

Our IT employee Alex Wilber "<AlexW@M365x57.OnMicrosoft.com>" has a user account in the company with a corresponding Microsoft 365 license and a mailbox.

::blog-image{alt="Azure AD User Settings" src="posts/azuread-admin-notification-and-mail-forwarding/20220919195600.png"}
::

Furthermore our IT employee Alex Wilber has another Azure AD Admin Account "<adm.AlexW@m365x57487439.onmicrosoft.com>".

::blog-image{alt="Azure AD User Settings" src="posts/azuread-admin-notification-and-mail-forwarding/20220919195903.png"}
::

This admin user "adm.AlexW\@m365x57487439" has no licenses assigned as described, so no mailbox is provided. Also, in this example, the "Global Administrator" role was assigned to the user via PIM.

::blog-image{alt="PIM Configuration" src="posts/azuread-admin-notification-and-mail-forwarding/20220919200143.png"}
::

### Configuration Notification forwarding - Plus addresses

To forward the notification from our admin account "<adm.AlexW@m365x57487439.onmicrosoft.com>" to our user primary mailbox "<AlexW@M365x57487439.OnMicrosoft.com>", we configure the admin account in Azure AD as below.

Open the user administration in Azure AD and edit the corresponding admin user. If you try to add the email address of your default user ("<AlexW@M365x57.OnMicrosoft.com>"), you will get an error message ("Update would cause the user to have a proxy address already present on another directory object.").

At this point the email format plus addresses is used. Extend your email address to which the mails will be forwarded with for example "+ADM".

Email Admin Account: "<AlexW+ADM@M365x57487439.OnMicrosoft.com>"

::blog-image{alt"Azure AD User Settings" src"posts/azuread-admin-notification-and-mail-forwarding/20220919200941.png"}
::

Exchange Online resolves the email address "<AlexW+ADM@M365x57487439.OnMicrosoft.com>" without the "+" and associated tag ("+ADM") so that the notification is sent to <AlexW@M365x57487439.OnMicrosoft.com>.
If we then enable the PIM role Global Administrator of the admin account "<adm.AlexW@m365x57487439.onmicrosoft.com>", we will receive the notification in our user mailbox.

::blog-image{alt="PIM Notification" src="posts/azuread-admin-notification-and-mail-forwarding/20220919203118.png"}
::

In the past, it was possible for email addresses to contain "+" characters. But Microsoft has enabled plus addressing by default in all Exchange Online organization at the beginning of 2022.

This configuration can be checked using PowerShell and customized as described below.

```powershell
Set-OrganizationConfig -AllowPlusAddressInRecipients <$true | $false>
```
