---
title: Intune & Microsoft Store for Business Integration
tags:
  - MDM
  - Intune
  - Store for Business
  - Device Management
  - App Deployment
  - Microsoft Store Apps
  - Company Portal
category:
  - Intune
  - Microsoft365
author: Jacob Meissner
date: 2022-01-30 05:00:00
---

## Introduction

To distribute Microsoft Store Apps in the company, it is recommended to use the Microsoft Store for Business. This allows you to set up your own business store based on Microsoft (and sideload) apps.

<!-- more -->

## Connector Integration

To distribute these apps via Intune, it is possible to activate an Intune Connector so that the apps can be automatically displayed and assigned as "Microsoft Store for Business" apps in Intune.

The following steps have to be performed for an integration. Open the Intune portal and ensure that they have administrative permissions.

In the left context menu, select the "Tenant Administration" option and open the Connectors & Tokens submenu. Select Microsoft Store for Business and click enable & sync.

::blogImage{src="posts/intune-microsoft-store-for-business-integration/20220329143708.png" alt="Intune Connector Settings"}
::

The Last Sync Time then usually stops at the year 1970 and no apps are synchronized.

In the next step it is necessary that in the Store for Business Portal ( <https://businessstore.microsoft.com> ) also the Intune Connector is activated. To do this, navigate to the Store for Business and activate the Microsoft Intune Connector under Settings (Management Tools).

::blogImage{src="posts/intune-microsoft-store-for-business-integration/20220329143947.png" alt="Intune Connector Settings"}
::

When the configuration is complete, return to the Intune portal and click Sync in the Business Store Connector.
You should now see your Store for Business apps in Intune.
