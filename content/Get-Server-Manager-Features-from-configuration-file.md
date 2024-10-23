---
title: Get Server Manager Features from configuration file
category:
- Windows Server
tags:
  - Windows Server
  - Test
date: 2018-03-06 19:58:59
author: Jan-Henrik Damaschke
---

Windows Server Manager lets you export the configured roles and features from the UI dialogue as an xml file. Unfortunately there is no possibility to directly work with this xml file. The following script shows a simple way to parse the xml file. You can then pipe the output to for example to the `Install-WindowsFeature` cmdlet.
{% gist 69f8a0ef50d2ec11e3dbd0931daebae2 %}
