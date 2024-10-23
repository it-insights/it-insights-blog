---
title: Enable Wake-on-LAN (WOL) with PowerShell
author: Jan-Henrik Damaschke
date: 2018-11-17 18:16:54
tags:
category:
 - PowerShell
---

With every recent Windows 10 update, and they happen a lot, Windows unfortunately also resets the power settings of the network adapters. Since I like to start both my PC and notebook from a remote location or from within the same network, I wrote a little PowerShell function to enable Wake-on-LAN (WoL) again.
<!-- more -->

At first we need the current instances of the `MSPower_DeviceWakeEnable` class and load them into the `$nicsWakeEnabled` variable. Next, we get a list of NIC objects with the `PNPDeviceID` property by getting the instances of `Win32_NetworkAdapter` (Get-Netadapter doesn't list the `PNPDeviceID` field).
Now we just check, if the NIC already has the designated status, given by parameter and if not, setting it by using the Set-CimInstance cmdlet.
::callout{icon="i-heroicons-information-circle" color="blue"}
For the matching, we have to use the `-like` operator, as there is an additional number suffix (normally `_0`) in the `InstanceName` field of the `MSPower_DeviceWakeEnable` instances.
::

{% ghcode <https://gist.github.com/itpropro/2172b6c85399ffdc73ae6caea86048b5> {lang:PowerShell} %}

After performing the above steps we should be able to see the results directly in the CIM class and in the device manager (devmgmt.msc). If there's another update, just run the cmdlet with the desired `WakeEnabled` parameter let your devices wake up via magic packet ;).
