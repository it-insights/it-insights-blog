---
title: Office 365 Tenant to Tenant Migration Identity Planning Part 2
tags:
  - Azure Active Directory
  - Azure AD
  - Office 365
  - Microsoft 365
  - Identity Management
category:
  - Office 365
author: Jacob Meissner
comments: false
keyword:
  - Microsoft 365
  - Tenant Migration
  - Office 365
  - Tenant to Tenant
  - Data Migration
  - Identity Management
date: 2022-05-20 19:52:17
---

In the first part of the blog series, we took a look at the topic of planning and selecting the migration scenario and developed a long-term strategy based on the business and technical requirements and defined how the tenant migration should be implemented schematically.

<!-- more -->

This is a multi part article with the following parts:

- [Office 365 Tenant to Tenant Migration Fundamentals Part 1](https://itinsights.org/Office-365-Tenant-to-Tenant-Migration-Part1/)
- [Office 365 Tenant to Tenant Migration Identity Planning Part 2](https://itinsights.org/tenant-to-tenant-migration-identity-planning-part-2/)

This section is about the advanced view of migration scenarios, as there are many more indicators that have an impact on tenant migration. If we take a look at the topic of Office 365 tenant migration, in most cases there is an entire hybrid infrastructure. In this context of hybrid infrastructure there are key components like identity management, device management, exchange hybrid, data management & application management.

These topics are individual sub-projects and should be analyzed, reviewed, and considered based on the strategy established in [Office 365 Tenant to Tenant Migration Fundamentals Part 1](https://itinsights.org/Office-365-Tenant-to-Tenant-Migration-Part1/).

## Identity Management

Let's go to the first point and one of the most important in my mind "Identity Management".

> If identity management is not planned and implemented correctly, it is not possible to ensure efficient operations.

### Analysis of existing identity management

The first question that arises is how do the existing Active Directory & Azure Active Directory structures look like.

#### Azure AD Tenant Scenarios

1. ##### Azure AD Identity Management

Does the source & target tenant only use Azure Active Directory? (Exclusive user management via the cloud, i.e. Azure AD or Office 365 Portal / PowerShell)

::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220528174720.png" alt="Azure AD Identity Management"}
::

2. ##### Hybrid Identity Management (AD Connect)

Is synchronization from the local Active Directory used for user provisioning? (AD Connect User, Groups and Device Sync )

::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220529000038.png" alt="Hybrid Identity Management (AD Connect)"}
::

3. ##### Hybrid and Third-Party Identity Management

Are there third-party tools that map existing identity management processes and integrate as a central identity management?

::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220529001152.png" alt="Hybrid and Third-Party Identity Management"}
::

#### Azure AD Migration Requirements

1. ##### Azure AD Identity Management

If, as described in the first scenario, only Azure AD users, groups and devices are used, the migration in the identity part is relative simple, because only users have to be created in the target tenant and there are no significant links / synchronizations from on-premises systems.

2. ##### Hybrid Identity Management (AD Connect)

In the Hybrid Identity scenario, migration can become much more complex as there are a number of dependencies that need to be considered.
First of all, as described in Part 1 of the blog series, the target planning and the future strategic IT infrastructure should be completed.
The following options can be considered and are eligible for Identity / Tenant Migration.

    1. ###### New user creation in Azure Active Directory
    One option is to transfer users to the target Azure Active Directory and create them as Cloud Only accounts in the Azure Active Directory of the target tenant. Furthermore, to include / reset the devices in Intune / Auto-Pilot and therefore create a Cloud Only infrastructure.

    ::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220703203904.png" alt="New user creation in Azure Active Directory"}

::

| Advantages                                                | Disadvantages                                   |
| --------------------------------------------------------- | ----------------------------------------------- |
| Cloud Only Management                                     | Separate double / management of identities      |
| Azure AD Integration & Intune Management                  | No centralized mangaement                       |
| Minimization of complexity                                | Access restrictions to legacy systems           |
| Legacy systems replacement                                | LDAP / Kerberos no longer usable                |
| Cost savings due to elimination of local identity systems | Application access and identity synchronization |
|                                                           | Active Directory integration not available      |
|                                                           | Software Deployment                             |

2. ###### New creation of users in the Active Directory of the target environment and synchronization via AD Connect

Another option is to create the users & groups in the target environment in the local Active Directory and then provision them in the Azure Active Directory using AD Connect. This does not allow a complete but mostly a clean integration / transfer of a tenant into an existing hybrid infrastructure.

    ::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220703204218.png" alt="New user creation in Azure Active Directory"}

::

| Advantages                                                      | Disadvantages                                            |
| --------------------------------------------------------------- | -------------------------------------------------------- |
| Central management in Active Directory                          | Lokales Active Directory Management                      |
| Active Directory Integration                                    | Infrastructure complexity                                |
| Use of LDAP / Kerberos                                          | Infrastructure costs (Active Directory, AD Connect etc.) |
| Device Management through Intune or OnPremise systems like SCCM | Azure Active Directory Features (Dynamic Assignment...)  |
| Legacy application integration                                  |                                                          |

3. ###### Connection of the source local Active Directory to the Azure AD Connect infrastructure of the target environment

An additional way of considering a hybrid / synchronized identity would be to connect the local Active Directory (source) to the AD Connect of the target environment to minimize the impact on the existing source structure (OnPremise Active Directory).

    ::blogImage{src="posts/tenant-to-tenant-migration-identity-planning-part-2/20220703205056.png" alt="New user creation in Azure Active Directory"}

::

    In this scenario, synchronization requirements based on supported Azure AD Connect Sync topologies may need to be checked in advance. More information about this at: https://docs.microsoft.com/de-de/azure/active-directory/hybrid/plan-connect-topologies

| Advantages                                                   | Disadvantages                              |
| ------------------------------------------------------------ | ------------------------------------------ |
| Minimal impact on local infrastructures (Active Directories) | Authentication                             |
| Active Directory Integration                                 | Increased management effort                |
| Use of LDAP / Kerberos                                       | If necessary complex sync rules            |
| Existing permissions can still be used                       | Network connection of the Active Directory |
| User / group objects can still be used                       | Infrastructure costs & operation           |
| On- & offboarding processes can still be used                | Sync Dupliakte & Sync Errors               |

4. ##### Hybrid and Third-Party Identity Management

Another variant, which is in most cases the most complex, is the migration / consolidation taking into account other third-party identity tools such as SAP or other HR applications. An important role plays the processes in the source & target environment and whether an integration with all requirements of internal employees, external, long-term, short-term etc. can be implemented and whether this fits into the long-term strategy to merge the companies / tenants.

Other options and transitions can also be that a new tenant / Azure Active Directory is set up and that both tenants are transferred to a new infrastructure. This can be the case, for example, with name changes, since the previous names may no longer be used and is usually used as the tenant name (SharePoint) and can not be changed

> There is no universal blueprint for migration and merging. It always depends on the requirements and the future strategy. The listed options are only a few excerpts from the possibilities that exist. Depending on the requirements or new features etc. these can be edited and adapted. This list and the blog entry should serve as a basis and impulse to think about the best possible approach to ensure an efficient migration in the long term.
