---
title: Microsoft Defender XDR - Offboarding / Remove Machines
author: Jacob Meissner
tags:
  - Defender
  - Defender XDR
  - Azure
category: Defender
date: 2024-09-08T03:15:00.000Z
---

In some environments, there are a lot of demands on Defender XDR and the management of machines, including offboarding and removal based on tags or a source domain.

<!-- more -->

Microsoft offers an API to do this yourself, but there is also a PowerShell module that simplifies the management of machines in the Defender XDR portal enormously.
The PSMDE (Github) module enables efficient and simple management, which is why we use it for the offboarding of machines.

## Preparations

### Installation Module

To do this, we install the PowerShell module:

```powershell[install-psmde.ps1]
# Install PSMDE (Defender Module)
# https://github.com/Visorian/PSMDE (more Inforamtion)

Install-Module PSMDE
```

::blogImage{src="posts\MicrosoftDefenderXDR-RemoveMachines\psmdebanner.png" alt="PowerShell Module PSMDE"}
::

### Permssion and authorization

In the next step, we must of course first prepare and configure the relevant authorisations so that we can manage the devices using the PSMDE module. For this purpose, there is a separate command in the module to create a service principal.

```powershell[CreateServicePrincipal-PSMDE.ps1]
# Connect Tenant / Environment
Connect-AzAccount -Tenant 'TenantId'
# Add Service Principal or use existing
New-MdeServicePrincipal -initialize
# Grant admin Consent (generated Service Principal / APPID )
```

After successfully creating the service principal, PowerShell should return the following information. This is now required for the use of PSMDE.

::blogImage{src="posts\MicrosoftDefenderXDR-RemoveMachines\Pasted image 20241101002403.png" alt="New-MdeServicePrincipal-Result"}
::

Before we can start, however, we need to grant the authorisations. To do this, we copy the servicePrincipalId (AppId) and search for the created application in the Entra Id under App Registration. This should have been created with the Id and the name PSMDE.
To configure the authorisation, we open it and grant and API permission the authorisations.

::blogImage{src="posts\MicrosoftDefenderXDR-RemoveMachines\Pasted image 20241101003400.png" alt="EntraID-AppRegistration-Grant"}
::

We also want to delete devices / machines, but the standard permissions granted are not sufficient for this. Therefore, we have to click on Windows Defender ATP under API Permission and add and save the additional Machine.ReadWrite and then grant it again.

::blogImage{src="posts\MicrosoftDefenderXDR-RemoveMachines\Pasted image 20241101003850.png" alt="EntraID-AppRegistration-Grant-addpermission"}
::

## PSMDE Connect & Configure

Now that we have created a service principal and assigned the appropriate authorisations, we can get started. First, we set the credentials / authorisation info with which we connect via PSDME and check them again with ‘Get-MdeAuthorisationInfo’.

```powershell[MdeAuthorization-PSMDE.ps1]
# Copy the TenantID / TenantId (servicePrincipalTenantId) AppID(servicePrincipalId) and Secret (servicePrincipalSecret) in setmde-auth...
Set-MdeAuthorizationInfo -tenantId 'tenantId' -appId 'appId' -appSecret 'Secret'

## Check Status an Permission
Get-MdeAuthorizationInfo
```

If the roles or permissions are not yet set, they can of course be adjusted at any time. After customisation, it is recommended to perform a clear so that PSMDE gets a new token.

```powershell[Clear_Set-MdeAuthorization-PSMDE.ps1]
Clear-MdeAuthorizationInfo
# Copy the TenantID / TenantId (servicePrincipalTenantId) AppID(servicePrincipalId) and Secret (servicePrincipalSecret) in setmde-auth...
Set-MdeAuthorizationInfo -tenantId 'tenantId' -appId 'appId' -appSecret 'Secret'
```

In the next step, we filter once on the domain level, i.e. the domain to which the machines we want to remove are assigned, and trigger the remove command for the specific machines in the domain.

```powershell[RemoveMachines-PSMDE.ps1]
#Search by Domain
$domain = 'Domain.local'
$machines = Get-MdeMachine
$commentDelete = "Clear / Offboarding Machine Description"

#Machine List Export Information (path) - Documentation
$filteredDevicelistPath = 'C:\temp\log-removedmachines.csv'

$fitleredMachines = $machines | Where-Object { $_.computerDnsName.endsWith($domain) }
$fitleredMachines | select id, computerDnsName, machineTags,osPlatform,healthStatus,ipAddresses, lastSeen | Export-Csv -Path $filteredDevicelistPath -Delimiter ";" -Encoding utf8
$fitleredMachines | measure

# Remove Defender filtered Devices

foreach ($removeDevices in $fitleredMachines){
    Write-Host "The Device " $removeDevices.computerDnsName "will be deleted."
    Remove-MdeMachine -id $removeDevices.id -comment $commentDelete
}
```

The deletion process or even the offboarding of the devices is triggered and added to the queue. The status is returned as Pending and removed / switched to inactive by Microsoft after a while.

The Powershell module PSMDE uses the following API call in the background to perform offboarding:

```powershell
Invoke-RetryRequest -Method Post -Uri "https://api.securitycenter.microsoft.com/api/machines/$id/offboard" -body (ConvertTo-Json -InputObject @{ Comment = $comment })
```

All further information can be found in the Github Repo of PSMDE. [GitHub Repositories](https://github.com/Visorian/PSMDE)
