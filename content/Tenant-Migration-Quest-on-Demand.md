---
title: Tenant Migration - Quest on Demand
tags:
  - Office 365
  - Migration
  - AzureAD
  - Exchange Online
  - OneDrive
  - AzureAD
category: Office 365
author: Jacob Meissner

keywords:
  - Office 365
  - Migration
  - Quest
  - Exchange Online
  - OneDrive
  - OneDrive for Business
  - AzureAD
  - Azure Active Directory
  - Data Migration
  - O365 Migration
  - Tenant Migration
  - Office 365 Tenant to Tenant Migration
  - Office 365 Migration
  - Domain Migration
  - SharePoint
  - Mail
  - Tenant
  - Office 365 Tenant Migration
  - tenant to tenant migration
  - Office365 consolidation
date: 2019-09-23 05:00:00
---

In situations like mergers, Office 365 tenants often have to be consolidated or migrated. Du to different companies having different requirements to compliance or governance standards. I would like to share my personal experiences in with the Quest's on Demand Migration utilities.
<!-- more -->

First of all, why Quest on Demand? There are many capable Office 365 migration tools available on the market. Quest on Demand Migration is a rather new product on the market that focuses on identity, mail and OneDrive migration and is an SaaS (Software as a Service) product that also uses Microsoft Azure AD as identity provider for registration.

Anyone can create a demo account at Quest and configure the tool without having to deposit credit cards or other payment methods. The Quest on Demand trial version is limited  on the objects to be migrated (OneDrive 5 Files or 100MB, Exchange 10 Objects). This allows you to configure the tool in the trial version and already test the migration / synchronization. The other advantage is that one can continue to use his Quest On Demand Tenant after purchasing licenses without loosing settings or customizations. There is still some room for improvement here, as licenses can only be booked in via Quest and other distributors (offers, orders). In a modern SaaS application this should be directly automated within the order process and installed in real time using shopping carts or similar. However, the way via Quest and the other distributors worked without any problems.

## Quest on Demand migration

Let's take a look at the functionality and deployment of Quest on Demand Migration. You can find the alphabetically sorted [Quest on Demand Migration](https://www.quest.com/products/on-demand-migration) via the tab "Trials" on the [Quest homepage](https://Quest.com/) and you can create a free tenant for Quest on Demand with dedicated or Office 365 credentials via the item Start Free Trial.
During the registration, further information is requested and it can be directly defined in which location Quest on Demand should be rolled out and provided. This can only be configured during creation and cannot be adjusted later. That's because this value determines, which Azure Datacenter Quest on Demand uses to provide it's service.

After completing the logon process, you have direct access to the Quest on Demand service and can start configuration and migration steps. First you will be forwarded to the dashboard of your Quest on Demand Tenant and you will see the status of the users and migrations/synchronizations later on. Because there is no connection to Source or target Tenant after the creation of the Quest on Demand, the first step would be to create a connection to the tenants.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand1_1.jpg" alt="Quest on Demand Dashboard"}
::

Adding the Tenant is also kept very simple by Quest, as this can be done directly in the Quest on Demand Tenant settings. Simply click and confirm the requested AzureAD permissions. All you have to do is log in to the respective login screens with an Office 365 Global Administrator. In the background, Quest on Demand registers an enterprise application in the Azure Active Directory with the required permissions for each component.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand2.jpg" alt="Quest on Demand AzureAD Enterprise Applications"}
::

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand3.jpg" alt="Quest on Demand Enterprise Application permission"}
::

A new project is created for the migration itself under the menu option "Migration". Because you can connect several tenants, you have the possibility to separate the different migration within projects, which makes the overview and assignment much easier. Source and target tenants must be defined for each project and a detailed description can be defined.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand5.jpg" alt="Quest on Demand Migration Project"}
::

::callout{icon="i-heroicons-information-circle" color="blue"}
Don't forget to open a ticket at Microsoft Office 365 Support for the respective tenant so that the throttling limit is increased. This is a standard ticket at Microsoft and is usually processed within a very short time. The maximum period for increasing the limit at Microsoft is 90 days.
::

In my opinion, the migration process is well structured and the single steps are clearly organized within a project. The different migration steps (Accounts, Mailbox, OneDrive) are divided into the different tabs. There is also a dedicated dashboard for each project, which represents the required prerequisites for a migration and the status of the users, data and migration.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand6.jpg" alt="Quest on Demand Migration Project"}
::

If you take a closer look at the "Accounts" tab, it is of course primarily a case of migrating the identities into the new tenant. This can be done by manual selection or by collections up to the option Map from File and provides a wide range for the migration of identities from a few users up to a large number.
Like in many other migration tools, they can not only be executed directly but also scheduled as a task, so that you can schedule all these tasks based on your migration timetable.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand7.jpg" alt="Quest on Demand Migration Task"}
::

In the Mailboxes section the Mailbox Migration settings can be configured and in my estimation there is also a relatively good set of functions on this part. Although the primary mailbox or the archive and only the tasks or mails are to be migrated, all this is possible and in the configuration also very simply realizable.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand8.jpg" alt="Quest on Demand Mailbox Migration Task"}
::

Quest also includes some other features like the Mailbox Switch. This enables mail forwarding and information to be scheduled and automated. Furthermore there is the Coexistence extension which provides more functions for coexistence of domain, SharePoint, calendar etc..

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand9.jpg" alt="Quest on Demand Mailbox Switch"}
::

Migration options such as versions and permissions within the task can also be adapted when migrating OneDrive. It is also possible to exclude certain items or paths based on date, size, file types etc..
However, even within the migration tasks, the status and any errors or warnings can be traced in detail and exported during and after execution. For this you can either look at the information, warnings and errors via the tasks or directly via Event and then filter them. These are good after my tests and describe mostly very exactly the problem. Whether for example the throttling starts and the service has to wait, file paths of OneDrive folders are too long or possibly folders could not be created is all well described within the logs.

::blogImage{src="posts/tenant-migration-quest-on-demand/QuestonDemand10.jpg" alt="Quest on Demand Events"}
::

As a result regarding the migration tool this can be a really good alternative to other providers. Of course, it always depends on the exact requirements that a migration requires, but due to the large functional range, good user interface and the use as SaaS application, Quest on Demand is a good solution for a Microsoft Tenant migration.

::callout
Disclaimer: We have not been paid or received sponsoring for writing this article. This article only reflects the opinions and experiences of the author.
::
