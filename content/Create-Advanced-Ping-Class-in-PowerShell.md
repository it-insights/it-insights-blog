---
title: Create Advanced Ping Class in PowerShell
tags:
  - PowerShell
  - Ping
  - PowerShell Classes
  - Advanced PowerShell
author: Jan-Henrik Damaschke
date: 2019-07-04 07:30:00
category:
  - PowerShell
---

Recently, I had the problem of monitoring the latency of my internet connection to provide these information to my ISP for troubleshooting. As the standard ping class in .net and Test-NetConnection was too inflexible and had no timestamps, I wanted to create a PowerShell Script to provide these functionality. Classes were something I haven't used in a while so I chose to create a PowerShell class called `AdvancedPing`.
<!-- more -->
<!-- toc -->

## Introduction

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
For this post I assume that the basics of PowerShell Classes are known.
Some good resources to get familiar with PowerShell Classes are

- [about_classes from Microsoft Docs](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes?view=powershell-6)
- [PowerShell User Group Video about PowerShell Classes](https://www.youtube.com/watch?v=gkwyhUc-xRQ)
- [Github repository for the above video](https://github.com/SAPIENTechnologies/ClassOfWine)
::

Lets start with what we want to achieve. We want to create a ping class that is capable of adjusting the following settings for ICMP packets:

- packets to be send
- duration of ping
- giving hostname or ip address
- size of ICMP packets in bytes
- ttl
- timeout for packets
- interval of packets (every x ms)
- dontFragment option
- show timestamp

The logic should be that a user provides a packet and a duration variable which are then used to determine the end of the ping process. If max packets is reached before the time specified in duration is over, the ping process will end as well as when the duration is over, but the max packets value has not been reached.

## Class variables

So we start with the class body and define the class variables we will need:

https://gist.github.com/itpropro/28be683c04e3246e80b01259e72aead7 powershell [AdvancedPing.ps1]

Unfortunately, it's not possible to use Access Modifiers like `private`, `protected` or `internal` in PowerShell Classes. The nearest we can get is with the `hidden` modifier. This will hide the class property from syntax completion and the `Get-Member` cmdlet, but with `Get-Member -force` or a direct access via .\_property, it can still be accessed.
For the naming of class variables, we use the an underscore (\_) like used in multiple programming languages including C# as coding style.
The following variables are initialized with default values:

- $_bytes = 64 (bytes to send via ICMP)
- $_ttl = 57 (Time to live/Maximum hops)
- $_timeout = 120 (in ms)
- $_interval = 1000 (in ms)
- $_counter = 0 (packet counter)
- $_dontFragment = $false (dontFragment option of Ping .NET class)

## Constructor

Next we create the constructor. The constructor always has the same name as the class, so in our case it's `AdvancedPing`.

{% ghcode <https://gist.github.com/itpropro/28be683c04e3246e80b01259e72aead7> 16 32 {lang:C#} %}

First, we assign the values from the parameters to `$this._packets` and `$this._duration = $duration`.

::callout{icon="i-heroicons-information-circle" color="blue"}
Class methods and variables have to references by the `$this.` prefix, as long as they are not from within the same method scope.
::

Next, we setting getters and setters on the defined class variables in C# style. To understand what this does, we have to take a look at the `_AddProperty` method.

### _AddProperty method

In PowerShell, the getters and setters are automatically generated for class variables. But as we don't want the users to directly interact with the internal class variables, we made them hidden. Now to provide an intuitive way of getting and setting these variables, we create new properties on the class instance.

{% ghcode <https://gist.github.com/itpropro/28be683c04e3246e80b01259e72aead7> 119 123 {lang:C#} %}

What this basically does, is creating a new script property for the given parameter `$propName`. Then specifying `$this._$propname` as getter and `$this."_$propName" = $value` as a setter by using the variable `$value`, which will be provided by the user by writing e.g. `$classInstance.property = 'test'` where `'test'` will be used as `$value`.
Also very important is to call the `GetNewClosure()` function on the scriptblocks. According to the [Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.scriptblock.getnewclosure?view=pscore-6.2.0), it _"Returns a new scriptblock bound to a module. Any local variables in the callers context will be copied into the module."_.
Without `GetNewClosure()`, the variable `$propName` will just be inserted as a variable and not with the actual content that it contains.

### _SetTarget method

After setting the script property for every class property that we want to expose, we also have to validation on the parameter `$target`.
`$target` could be an IP address or a DNS name. To check this, we first try to parse the content of `$target` and save the output in the `$out` variable of type `System.Net.ipaddress`.
If the parsing fails, we try to resolve the name by using the `GetHostEntry` method from the `System.Net.Dns` namespace.
If that fails as well, we throw an error and exit.

{% ghcode <https://gist.github.com/itpropro/28be683c04e3246e80b01259e72aead7> 89 117 {lang:C#} %}

::callout{icon="i-heroicons-information-circle" color="blue"}
If you want to provide multiple ways of instantiating your class, PowerShell classes support overloads. Just add another method also called `AdvancedPing` with different parameters to your class.
::

## Ping method

The only method that should be used from a user is the ping method. This method is called without any additional parameters, as everything should be set and saved in class variables.
As I like the linux style syntax ping, we will create a `$startMessage` as it would appear at every start of a ping in Ubuntu for example.
After writing out that message, we have to create an instance of `System.Net.NetworkInformation.Ping` and `System.Net.NetworkInformation.PingOptions`. We need the PingOptions instance to be able to define ttl and dontFragment options.
In line 47 the `$buffer` variable of type byte array will be initialized with the length of `$this._bytes`.

To incorporate the duration variable, we create a new stopwatch instance and create a while loop to call the `_SendPing` method. To do this every x milliseconds as specified in the interval variable, we add a `Start-Sleep -Milliseconds $this._interval` at the end of the loop.

To also have linux style statistics, we just do some quick math in the formatting section and write the `$statistics` string to the console.

The ping process itself happens in the internal `_SendPing` method so let's take a look at that one.

### _SendPing method

The `_SendPing` method takes the already created instances in `$pinger`, `$pingOptions` and the initiated `$buffer` variable and uses them so send out ICMP packages.

{% ghcode <https://gist.github.com/itpropro/28be683c04e3246e80b01259e72aead7> 66 87 {lang:PowerShell} %}

All that already happens in line 68..
The following conditional statements evaluates how the "$_timestamp" switch is configured and adjusts the `$message` variable accordingly.
If the ICMP message times out, a simple `"Request timed out"` will be written to console.

## Examples

See below for some example usage of the AdvancedPing class.

### Example 1

In the following example, we create an instance of the AdvancedPing class and call the `ping()` method.

```
PING google.de (216.58.213.195) 64 bytes of data.
64 bytes from 216.58.213.195: icmp_seq=1 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=2 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=3 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=4 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=5 ttl=57 time=3 ms
--- 216.58.213.195 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 5024ms
```

### Example 2

In this example, we create an instance of the AdvancedPing class, adjusting some of the class variables and call the `ping()` method.

```bash
PING 8.8.8.8 (8.8.8.8) 32 bytes of data.
[04.07.2019 00:22:27] 32 bytes from 8.8.8.8: icmp_seq=1 ttl=57 time=3 ms
[04.07.2019 00:22:28] 32 bytes from 8.8.8.8: icmp_seq=2 ttl=57 time=3 ms
[04.07.2019 00:22:28] 32 bytes from 8.8.8.8: icmp_seq=3 ttl=57 time=3 ms
[04.07.2019 00:22:29] 32 bytes from 8.8.8.8: icmp_seq=4 ttl=57 time=4 ms
[04.07.2019 00:22:29] 32 bytes from 8.8.8.8: icmp_seq=5 ttl=57 time=3 ms
[04.07.2019 00:22:30] 32 bytes from 8.8.8.8: icmp_seq=6 ttl=57 time=3 ms
[04.07.2019 00:22:30] 32 bytes from 8.8.8.8: icmp_seq=7 ttl=57 time=3 ms
[04.07.2019 00:22:31] 32 bytes from 8.8.8.8: icmp_seq=8 ttl=57 time=3 ms
[04.07.2019 00:22:31] 32 bytes from 8.8.8.8: icmp_seq=9 ttl=57 time=3 ms
[04.07.2019 00:22:32] 32 bytes from 8.8.8.8: icmp_seq=10 ttl=57 time=3 ms
--- 8.8.8.8 ping statistics ---
10 packets transmitted, 10 received, 0% packet loss, time 5065ms
```

And thats everything! We have created a relatively simple class to provide some linux style ping functionality. You can extend and rewrite the class for your needs and don't forget to check in frequently for my next post about an async PowerShell logging implementation :wink:
