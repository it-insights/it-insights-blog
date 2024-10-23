---
title: Office 365 Tenant to Tenant Migration Fundamentals
tags:
  - Office 365
  - Azure Active Directory
  - Microsoft 365
category:
  - Office 365
author: Jacob Meissner
comments: false
date: 2022-03-05 15:21:17
---

Business changes, acquisitions, divestments, and corporate reorganizations often result in the need to merge companies or divisions. Today, a large number of companies already use Office 365 services, so an important step for IT is to ensure seamless collaboration and provide centralized management for the various divisions / companies.
<!-- more -->

This is a multi part article with the following parts:

* [Office 365 Tenant to Tenant Migration Fundamentals](https://itinsights.org/Office-365-Tenant-to-Tenant-Migration-Part1/)

Based on these requirements, an Office 365 Single Tenant is usually preferred and necessary. This article looks at merging the existing Office 365 tenants and data migration.

## Planing Migration

The first step, as with every project, is planning. I would like to give some hints and impulses on a technical basis from some experiences. Please understand this points for planning not as a complete project plan, just as a part to assist the technical migration planning.

### Migration scenario

First of all, after the business requirements for merging the business units/companies, there is the scenario. In the first step, this includes determining which companies (Office 365 tenants) should be transferred. For example, should Company-B (Tenant-B) be integrated into Company-A (Tenant-A) or should a new tenant be created for both companies or should only some business units potentially be transferred.

::blogImage{src="posts/office-365-tenant-to-tenant-migration-part1/20220526182137.png" alt="Migration scenario"}
::

All these are basic considerations that should be discussed, analyzed and described in advance. The following factors should always be considered:

* What is the long-term strategic alignment for the company?
* Are further mergers planned in the future?
* Will further mergers result in a change of name or the founding of a new company in the future?
* Can the name continue to be used during a migration to an existing tenant? (In Office 365, the display name, as well as other domains can be migrated, but the name that was chosen during tenant creation company-A.onmicrosoft.com / company-A.sharepoint.com can not be changed).

> A tenant migration is usually an **complex, cost-intensive** project. The user impact and the possible **service restrictions** should be planned into the project. As more services are used in the source environments (Azure / Office 365), migration scenarios become more complex, so this fundamental decision should be made for the long term.
