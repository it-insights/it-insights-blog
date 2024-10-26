---
title: PowerShell Async Logging
tags:
  - PowerShell
  - Async
  - PowerShell Classes
  - Advanced PowerShell
  - Logging
category:
  - PowerShell
author: Jan-Henrik Damaschke
date: 2019-07-08 07:30:00
---

If you are working with PowerShell frequently, you will often run into the question of logging. How do I want to write logs, where to write them and which format should they have. We wont go into these questions here, however, we will take a look at how to implement PowerShell logging in a non-blocking (async) way.

<!-- more -->
<!-- toc -->

## Introduction

PowerShell is generally single threaded. If we want to write some logs into a file, we would probably use something like this:

```powershell
...
Write-Output "$([Datetime]::UtcNow) (Error): This output is blocking my shell" | Out-File C:\temp\test.log -Append
...
```

Maybe we would write a log function like this:

```powershell
function global:WriteLog
{
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet('Information', 'Warning', 'Error')]
        [String[]]
        $type,
        [Parameter(Mandatory=$true)]
        [string]$message
    )

    $logMessage = "$([Datetime]::UtcNow) ($type): $message"
    Write-Output $logMessage
    Add-content -Path "C:\temp\test.log" -Value $logMessage
}
```

And there are a lot of reference implementations and variations of varying complexity out there. The problem is that it is still blocking the main PowerShell thread.
To overcome these limitation, there are a few ways in PowerShell:

- PowerShell Jobs
- Timer objects
- Runspace factory

As PowerShell jobs are much too clunky and don't have a intuitive way of exchanging data between the job scope and the current scope, we will focus on timer objects and runspaces.

There are lots of good articles out there about PowerShell runspaces:

[Beginning use of PowerShell runspaces: Part 1](https://devblogs.microsoft.com/scripting/beginning-use-of-powershell-runspaces-part-1)
[Beginning use of PowerShell runspaces: Part 2](https://devblogs.microsoft.com/scripting/beginning-use-of-powershell-runspaces-part-2)
[Beginning use of PowerShell runspaces: Part 3](https://devblogs.microsoft.com/scripting/beginning-use-of-powershell-runspaces-part-3)
[RunspaceFactory Class](https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.runspaces.runspacefactory?view=pscore-6.2.0)

So we will create a separate runspace - aka. a thread - to handle all the logging logic for us.

## Logging logic

So first we write a scriptblock that will provide the logging functionality we need. As I said before, we will also use timers on this. What the following script does, is checking for a new message in the logging queue and handling it.

```powershell
loggingScript =
{
    function Start-Logging
    {
        $loggingTimer = new-object Timers.Timer
        $action = {logging}
        $loggingTimer.Interval = 1000
        $null = Register-ObjectEvent -InputObject $loggingTimer -EventName elapsed -Sourceidentifier loggingTimer -Action $action
        $loggingTimer.start()
    }

    function logging
    {
        $sw = $logFile.AppendText()
        while (-not $logEntries.IsEmpty)
        {
            $entry = ''
            $null = $logEntries.TryDequeue([ref]$entry)
            $sw.WriteLine($entry)
        }
        $sw.Flush()
        $sw.Close()
    }

    $logFile = New-Item -ItemType File -Name "$($env:COMPUTERNAME)_$([DateTime]::UtcNow.ToString(`"yyyyMMddTHHmmssZ`")).log" -Path $logLocation

    Start-Logging
}
```

First we create a timer object to check the log queue for new log messages frequently. What logging queue you ask? This one:

```powershell
$logEntries = [System.Collections.Concurrent.ConcurrentQueue[string]]::new()
```

We use a concurrent queue, because all objects inside of the `System.Collections.Concurrent` namespace already handles threat locks by themselves. That means that we don't have to care about both threads (main and logging thread) accessing the object at the same time and causing race conditions. Thats also the reason why we don't use Synchronized objects, because they are not completely thread safe and could lead to performance degradation.

::callout{icon="i-heroicons-information-circle" color="blue"}
If you want to learn more about thread safety in .NET, I recommend this article: [Thread-Safe Collections](https://docs.microsoft.com/en-us/dotnet/standard/collections/thread-safe)
::

The time calls the function `logging` every 1 second. By calling `AppendText()` on the earlier created `$logFile` object, we get a Stream Writer back and save it into the `$sw` variable.
Then we try to dequeue all messages from our queue until it's empty, appending every single entry to our log file.

::callout{icon="i-heroicons-information-circle" color="blue"}
This is very basic and should only show the concept, feel free to add all the logic you need.
::

## Logging runspace

To be able to launch the above code in a separate runspace, we first need a runspace. We create it by using the `RunspaceFactory` class.

```powershell
$loggingRunspace = [runspacefactory]::CreateRunspace()
$loggingRunspace.ThreadOptions = "ReuseThread"
$loggingRunspace.Open()
$loggingRunspace.SessionStateProxy.SetVariable("logEntries", $logEntries)
$loggingRunspace.SessionStateProxy.SetVariable("logLocation", $logLocation)
$cmd = [PowerShell]::Create().AddScript($loggingScript)
$cmd.Runspace = $loggingRunspace
$null = $cmd.BeginInvoke()
```

We set the `ThreadOptions` on the runspace object to `ReuseThread`.
According to the [PSThreadOptions Enum](https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.runspaces.psthreadoptions?view=pscore-6.2.0), `ReuseThread` defines that the runspace _"Creates a new thread for the first invocation and then re-uses that thread in subsequent invocations."_.
Then we open the runspace synchronously by calling `Open()` to be able to interact with it.
Now we can use a neat property called `SessionStateProxy` to add objects that we want to use for communication.
It basically declares and initializes variables in the remote runspace, in our case we want the `logEntries` and the `logLocation` variables to be accessible from the runspace scope.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
The `$logLocation` variable is not thread safe. As long as you set it initially and only read it in the logging runspace there should be no problem. If you want to do more with it, considering using a thread safe type or at least implement some locks with e.g. `[System.Threading.Monitor]::Enter/Exit`
::

## Logging class

As I love PowerShell classes for their extensibility and reusability, I obviously also created a class to reuse the logging construct.

{% ghcode <https://gist.github.com/itpropro/dde7b9394ab2c6a448050ffc9e2ffd45> {lang:PowerShell} %}

The only things I added here were the two enums for syslog severity and facilities and a little bit of logic to achieve a syslog like log output. If you would like to combine this method with a full featured syslog implementation, I recommend you take a look at the [Posh-SYSLOG module](https://www.powershellgallery.com/packages/Posh-SYSLOG/4.0) by Kieran Jacobsen.

For better accessability and a log framework like usability, I also added a method called `_AddSeverities`. It is called with every enum name returned by the `GetEnumNames()` method to add as PSScriptMethod for each.
That enables us to use syntax like this to log something:

```powershell
$psLogger.Alert("Test Alert")
```

### Example

Here, we create an instance of the PsLogger class and write some logs to the "C:\temp" folder.

````powershell
. 'c:\temp\PSLogger.ps1'
$logger = [PSLogger]::new("C:\temp")
$logger.Alert("Async logging is awesome")
$logger.Informational("It really is")
$logger.Error("Critical error")
```

Now lets take a look at the output file.

```bash
<185>1 2019-07-04T18:38:27.687Z DESKTOP-XXXXXXX.WORKGROUP pwsh 10168 - - Async logging is awesome
<190>1 2019-07-04T18:38:27.711Z DESKTOP-XXXXXXX.WORKGROUP pwsh 10168 - - It really is
<187>1 2019-07-04T18:38:28.346Z DESKTOP-XXXXXXX.WORKGROUP pwsh 10168 - - Critical error
```

And thats it! You can now extend and rewrite the logging class for your needs and don't forget to check in frequently for my next post about logging into Azure append blobs :smiley:
````
