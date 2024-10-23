---
title: Default Language Office 365 Tenant
tags:
  - Office 365
  - SharePoint
  - Microsoft Teams
category: Office 365
author: Jacob Meissner
date: 2019-07-01 07:15:00
---

A frequent question regarding Office 365/Azure tenants is, which default language is used for the individual services and where it can be changed. In general, every user can set his own language in the user settings (MyAccount - Settings - Language and Time zone), but there are also services where the default language cannot be changed afterwards.
<!-- more -->

For example SharePoint is one of these services, where the default language cannot be changed afterwards. Only in a Site Collection, additional languages can be added to subsites. The problem is that e.g. newly created Teams will have the default language settings of the tenant applied again. New languages can be added afterwards, but existing resources like created OneNote notebooks will stay on the default language.
This often unpractical in an international context, where the tenant could have been created e.g. with German as default language.

Therefore we will take a look at how to set the default language to English. The first step is to create a tenant for the Microsoft [Portal.office.com](https://products.office.com/en-us/business/compare-more-office-365-for-business-plans) site.

The URL plays a decisive role in this process. So if you have chosen the plan, check the URL in your browser for the correct language (see below , en-us).

::blogImage{src="posts/default-language-office-365-tenant/tenantlanguage1.png" alt="Create dummy table "}
::
The next step is to select the region / country in which the tenant is to be created. The Microsoft site [Where is your data located?](https://products.office.com/en-us/where-is-your-data-located?geo=All) provides a good overview.

::blogImage{src="posts/default-language-office-365-tenant/tenantlanguage2.png" alt="Create dummy table "}
::
After creating the tenant you can see in the Office 365 Admin Center under your organization profile that the tenant is located in Europe. Now, when creating new teams every resource like the SharePoint notebooks are automatically created with english as default language.
