---
title: Load PowerShell assemblies from nuget packages
category:
  - PowerShell
author: Jan-Henrik Damaschke
date: 2019-07-29 13:00:00
tags:
  - PowerShell
  - Nuget
  - Azure Storage
  - Azure
  - CosmosDb
---

PowerShell can manage NuGet packages since a few years now, but loading a dll, which is part of a installed NuGet package in PowerShell is not that intuitive.

<!-- more -->

I wanted to directly use the `Microsoft.Azure.Cosmos.Table` package from NuGet. You could also use the `AzTable` module, but if you want to use the most current Version of the underlying dll's (if they are even completely loaded from the PowerShell module) or if there is no module available that loads that specific nuget package (e.g. [SSH.NET](https://www.nuget.org/packages/SSH.NET)), you have to install them manually.

::callout{icon="i-heroicons-information-circle" color="blue"}
Since version 9.4.0 of the Microsoft Azure Storage SDK for .NET, the Table service is not supported anymore. Support for table storage is provided by CosmosDB libraries and was recently moved into the [`Microsoft.Azure.Cosmos.Table`](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) package.
::

So first, I needed to install the most current version of the package from nuget:

```powershell
install-package Microsoft.Azure.Cosmos.Table -RequiredVersion 1.0.4-preview -source https://www.nuget.org/api/v2
```

After installing, you can verify the installation with the following command.

```
Name                           Version          Source                           ProviderName
----                           -------          ------                           ------------
Microsoft.Azure.Cosmos.Table   1.0.4-preview    C:\Program Files\PackageManag... NuGet
```

By trying to use one of the classes inside of the `Microsoft.Azure.Cosmos.Table` namespace, we can check, if anything is loaded yet:

```
Unable to find type [Microsoft.Azure.Cosmos.Table.CloudStorageAccount].
At line:1 char:1

+ $storageAccount = [Microsoft.Azure.Cosmos.Table.CloudStorageAccount]::Parse($storageConnectionString)
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+ CategoryInfo          : InvalidOperation: (Microsoft.Azure.Cosmos.Table.CloudStorageAccount:TypeName) [], RuntimeException
+ FullyQualifiedErrorId : TypeNotFound
```

As the error suggests, we don't have any namespace available that hosts the class.

If we now want to load the assembly, we only have the path to the nupkg file in the source parameter. As we cannot load nupkg in PowerShell [yet](https://github.com/PowerShell/PowerShell/issues/7259), we need a workaround.
The following lines of PowerShell will help with that:

```powershell
$zip = [System.IO.Compression.ZipFile]::Open((Get-Package Microsoft.Azure.Cosmos.Table).Source,"Read")
$memStream = [System.IO.MemoryStream]::new()
$reader = [System.IO.StreamReader]($zip.entries[2]).Open()
$reader.BaseStream.CopyTo($memStream)
[byte[]]$bytes = $memStream.ToArray()
$reader.Close()
$zip.dispose()
```

What we have done here was

1. Opening the nupkg file as a zip file in memory
2. Create a memory stream to store the raw bytes
3. Create a `StreamReader` instance and save the raw bytes from the `BaseStream` property into our memory stream
4. Saving the bytes from the memory stream as a byte array
5. Disposing the used objects

Now we can try loading the assembly with the `[System.Reflection.Assembly]::Load()` method, which support byte arrays.

```
GAC    Version        Location
---    -------        --------
False  v4.0.30319
```

Let's verify, if we can use the namespace now:

```
TableEndpoint                                  TableStorageUri
-------------                                  ---------------
<https://storageaccount.table.core.windows.net/> Primary = 'https://storageaccount.table.core.windows.net/';...
```

You can use these technique to load all kinds of dll's from within archives, but keep in mind that dependency loading will not work. If you have assemblies with a lot of dependencies, you should think of another way of importing.
