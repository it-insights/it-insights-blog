---
title: Azure Arc and Defender for Endpoint Ports & URLs
tags:
  - Azure
  - Azure Arc
  - Defender for Endpoint
  - Microsoft Security
category:
  - Security
  - Microsoft 365
author: Jacob Meissner
date: 2022-08-02 14:41:00
---


During the onboarding / rollout of Defender for Endpoint and Azure Arc Agent, the network plays a significant role. Communication via the Internet is usually restricted by segmented networks and secured by firewalls and proxies. To prevent errors or communication problems, the required ports & URLs should be opened to ensure seamless onboarding and operational processes.

<!-- more -->

For this purpose, I have collected the relevant ports and URLs for Defender for Endpoint, Microsoft Defender Antivirus, Azure Arc Agent, Microsoft Defender SmartScreen, Azure Monitor Agent in the table below.



| Usage                                          | Region | Subcategory                                                          | Port | Url                                                                      |
|------------------------------------------------|--------|----------------------------------------------------------------------|------|--------------------------------------------------------------------------|
| Microsoft Defender for Endpoint                | WW     | CRL                                                                  | 80   | crl.microsoft.com                                                        |
| Microsoft Defender for Endpoint                | WW     | CRL                                                                  | 80   | ctldl.windowsupdate.com                                                  |
| Microsoft Defender for Endpoint                | WW     | CRL                                                                  | 80   | www.microsoft.com/pkiops/*                                               |
| Microsoft Defender for Endpoint                | WW     | CRL                                                                  | 80   | www.microsoft.com/pki/*                                                  |
| Microsoft Defender for Endpoint                | WW     | Common                                                               | 443  | events.data.microsoft.com                                                |
| Microsoft Defender for Endpoint                | WW     | Common                                                               | 443  | *.wns.windows.com                                                        |
| Microsoft Defender for Endpoint                | WW     | Common                                                               | 443  | login.microsoftonline.com                                                |
| Microsoft Defender for Endpoint                | WW     | Common                                                               | 443  | login.live.com                                                           |
| Microsoft Defender for Endpoint                | WW     | Common                                                               | 443  | settings-win.data.microsoft.com                                          |
| Microsoft Defender for Endpoint                | WW     | Common (Mac/Linux)                                                   | 443  | x.cp.wd.microsoft.com                                                    |
| Microsoft Defender for Endpoint                | WW     | Common (Mac/Linux)                                                   | 443  | cdn.x.cp.wd.microsoft.com                                                |
| Microsoft Defender for Endpoint                | WW     | Common (Mac/Linux)                                                   | 443  | officecdn-microsoft-com.akamaized.net                                    |
| Microsoft Defender for Endpoint                | WW     | Common (Linux)                                                       | 443  | packages.microsoft.com                                                   |
| Microsoft Defender for Endpoint                | WW     | Microsoft Defender for Endpoint                                      | 443  | login.windows.net                                                        |
| Microsoft Defender for Endpoint                | WW     | Microsoft Defender for Endpoint                                      | 443  | *.security.microsoft.com                                                 |
| Microsoft Defender for Endpoint                | WW     | Microsoft Defender for Endpoint                                      | 443  | *.blob.core.windows.net/networkscannerstable/*                           |
| Microsoft Defender for Endpoint                | WW     | Security Management                                                  | 443  | enterpriseregistration.windows.net                                       |
| Microsoft Defender for Endpoint                | WW     | Security Management                                                  | 443  | *.dm.microsoft.com                                                       |
| Microsoft Defender for Endpoint                | WW     | Microsoft Monitoring Agent (MMA)                                     | 443  | *.ods.opinsights.azure.com                                               |
| Microsoft Defender for Endpoint                | WW     | Microsoft Monitoring Agent (MMA)                                     | 443  | *.oms.opinsights.azure.com                                               |
| Microsoft Defender for Endpoint                | WW     | Microsoft Monitoring Agent (MMA)                                     | 443  | *.blob.core.windows.net                                                  |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | unitedstates.x.cp.wd.microsoft.com                                       |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | us.vortex-win.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | us-v20.events.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | winatp-gw-cus.microsoft.com                                              |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | winatp-gw-eus.microsoft.com                                              |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | winatp-gw-cus3.microsoft.com                                             |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | winatp-gw-eus3.microsoft.com                                             |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | automatedirstrprdcus.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | automatedirstrprdeus.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | automatedirstrprdcus3.blob.core.windows.net                              |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | automatedirstrprdeus3.blob.core.windows.net                              |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus1eastprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus2eastprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus3eastprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus4eastprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | wsus1eastprod.blob.core.windows.net                                      |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | wsus2eastprod.blob.core.windows.net                                      |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus1westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus2westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus3westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | ussus4westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | wsus1westprod.blob.core.windows.net                                      |
| Microsoft Defender for Endpoint                | US     | Microsoft Defender for Endpoint US                                   | 443  | wsus2westprod.blob.core.windows.net                                      |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | europe.x.cp.wd.microsoft.com                                             |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | eu.vortex-win.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | eu-v20.events.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | winatp-gw-neu.microsoft.com                                              |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | winatp-gw-weu.microsoft.com                                              |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | winatp-gw-neu3.microsoft.com                                             |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | winatp-gw-weu3.microsoft.com                                             |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | automatedirstrprdneu.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | automatedirstrprdweu.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | automatedirstrprdneu3.blob.core.windows.net                              |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | automatedirstrprdweu3.blob.core.windows.net                              |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | usseu1northprod.blob.core.windows.net                                    |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | wseu1northprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | usseu1westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | EU     | Microsoft Defender for Endpoint EU                                   | 443  | wseu1westprod.blob.core.windows.net                                      |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | unitedkingdom.x.cp.wd.microsoft.com                                      |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | uk.vortex-win.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | uk-v20.events.data.microsoft.com                                         |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | winatp-gw-uks.microsoft.com                                              |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | winatp-gw-ukw.microsoft.com                                              |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | automatedirstrprduks.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | automatedirstrprdukw.blob.core.windows.net                               |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | ussuk1southprod.blob.core.windows.net                                    |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | wsuk1southprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | ussuk1westprod.blob.core.windows.net                                     |
| Microsoft Defender for Endpoint                | UK     | Microsoft Defender for Endpoint UK                                   | 443  | wsuk1westprod.blob.core.windows.net                                      |
| Microsoft Defender Antivirus                   | WW     | UTC                                                                  | 443  | vortex-win.data.microsoft.com                                            |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | *.update.microsoft.com                                                   |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | *.delivery.mp.microsoft.com                                              |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | *.windowsupdate.com                                                      |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | go.microsoft.com                                                         |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | definitionupdates.microsoft.com                                          |
| Microsoft Defender Antivirus                   | WW     | MU / WU                                                              | 443  | <https://www.microsoft.com/security/encyclopedia/adlpackages.aspx>         |
| Microsoft Defender Antivirus                   | WW     | MU (ADL)                                                             | 443  | *.download.windowsupdate.com                                             |
| Microsoft Defender Antivirus                   | WW     | MU (ADL)                                                             | 443  | *.download.microsoft.com                                                 |
| Microsoft Defender Antivirus                   | WW     | MU (ADL)                                                             | 443  | fe3cr.delivery.mp.microsoft.com/ClientWebService/client.asmx             |
| Microsoft Defender Antivirus                   | WW     | Symbols                                                              | 443  | <https://msdl.microsoft.com/download/symbols>                              |
| Microsoft Defender Antivirus                   | WW     | MAPS                                                                 | 443  | *.wdcp.microsoft.com                                                     |
| Microsoft Defender Antivirus                   | WW     | MAPS                                                                 | 443  | *.wd.microsoft.com                                                       |
| Microsoft Defender SmartScreen                 | WW     | Reporting and Notifications                                          | 443  | *.smartscreen-prod.microsoft.com                                         |
| Microsoft Defender SmartScreen                 | WW     | Reporting and Notifications                                          | 443  | *.smartscreen.microsoft.com                                              |
| Microsoft Defender SmartScreen                 | WW     | Reporting and Notifications                                          | 443  | *.checkappexec.microsoft.com                                             |
| Microsoft Defender SmartScreen                 | WW     | Reporting and Notifications                                          | 443  | *.urs.microsoft.com                                                      |
| Azure Arc Agent                                | WW     | Used to resolve the download script during installation              |      | aka.ms                                                                   |
| Azure Arc Agent                                | WW     | Used to download the Windows installation package                    |      | download.microsoft.com                                                   |
| Azure Arc Agent                                | WW     | Used to download the Linux installation package                      |      | packages.microsoft.com                                                   |
| Azure Arc Agent                                | WW     | Azure Active Directory                                               |      | login.windows.net                                                        |
| Azure Arc Agent                                | WW     | Azure Active Directory                                               |      | login.microsoftonline.com                                                |
| Azure Arc Agent                                | WW     | Azure Active Directory                                               |      | pas.windows.net                                                          |
| Azure Arc Agent                                | WW     | Azure Resource Manager - to create or delete the Arc server resource |      | management.azure.com                                                     |
| Azure Arc Agent                                | WW     | Metadata and hybrid identity services                                |      | *.his.arc.azure.com                                                      |
| Azure Arc Agent                                | WW     | Extension management and guest configuration services                |      | *.guestconfiguration.azure.com                                           |
| Azure Arc Agent                                | WW     | Notification service for extension and connectivity scenarios        |      | guestnotificationservice.azure.com, *.guestnotificationservice.azure.com |
| Azure Arc Agent                                | WW     | Notification service for extension and connectivity scenarios        |      | azgn*.servicebus.windows.net                                             |
| Azure Arc Agent                                | WW     | For Windows Admin Center and SSH scenarios                           |      | *.servicebus.windows.net                                                 |
| Azure Arc Agent                                | WW     | Download source for Azure Arc-enabled servers extensions             |      | *.blob.core.windows.net                                                  |
| Azure Arc Agent                                | WW     | Agent telemetry                                                      |      | dc.services.visualstudio.com                                             |
| Log Analytics Agent/Microsoft Monitoring Agent | WW     |                                                                      | 443  | *.ods.opinsights.azure.com                                               |
| Log Analytics Agent/Microsoft Monitoring Agent | WW     |                                                                      | 443  | *.oms.opinsights.azure.com                                               |
| Log Analytics Agent/Microsoft Monitoring Agent | WW     |                                                                      | 443  | *.blob.core.windows.net                                                  |
| Log Analytics Agent/Microsoft Monitoring Agent | WW     |                                                                      | 443  | *.azure-automation.net                                                   |
| Azure Monitor Agent                            | WW     | Access control service                                               | 443  | global.handler.control.monitor.azure.com                                 |
| Azure Monitor Agent                            | WW     | Fetch data collection rules for specific machine                     | 443  | *.handler.control.monitor.azure.com                                      |


