---
title: Update Exchange Online Mailbox Language Settings
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
date: 2022-07-20 19:52:17
---


Based on the default settings and configuration, mailboxes in Exchange / Exchange Online are created with the default language. This is causing some users to see Inbox (default language en-US) in Outlook instead of "Postfach" (German).

<!-- more -->

This change of the mailbox language can also occur during migration. For example, this problem can happen during a tenant-to-tenant migration of Exchange Online, so it is recommended to check and modify the mailbox language after a successful mailbox migration.


The customization of the mailbox language can only be done using PowerShell. After the modification with the command Set-MailboxRegionalConfiguration the set language is automatically displayed in Outlook.

If this does not happen immediately, the update can be forced on the client via Windows Run and start Outlook with the following parameter: "outlook /resetfoldername".

To change the mailbox langauge, the following PowerShell command is used:
</br>

```powershell

Set-MailboxRegionalConfiguration -Identity "Username/Address" -Language de-de -DateFormat $null -TimeFormat $null -LocalizeDefaultFolderName

````

</br>

For setting the mailbox configuration the identity is needed and to specify which object should be changed. For Identity not only the name can be used, the following values are available to identify the mailbox.

-   Name
-   Alias
-   Distinguished name (DN)
-   Canonical DN
-   Domain\Username
-   Email address
-   GUID
-   LegacyExchangeDN
-   SamAccountName
-   User ID or user principal name (UPN)

</br>

The Date Format can be set manually or to $Null ,then the default settings for will be used. 
</br>

````

-   M/d/yyyy:  default value for en-US.
-   M/d/yy
-   MM/dd/yy
-   MM/dd/yyyy
-   yy/MM/dd
-   yyyy-MM-dd
-   dd-MMM-yy

````

</br>
The "LocalizeDefaultFolderName" parameter localizes the standard folder names of the mailbox in the current or the specified language. You do not need to specify a value for this option

```powershell
-LocalizeDefaultFolderName

```

For the languages the corresponding language tags are used. I have collected an extract from the possible language tags below.
</br>


| Language             | Geographic area            | Language tag |
|----------------------|----------------------------|--------------|
| Arabic               | Saudi Arabia               | ar-SA        |
| Bulgarian            | Bulgaria                   | bg-BG        |
| Chinese (Simplified) | People's Republic of China | zh-CN        |
| Chinese              | Taiwan                     | zh-TW        |
| Croatian             | Croatia                    | hr-HR        |
| Czech                | Czech Republic             | cs-CZ        |
| Danish               | Denmark                    | da-DK        |
| Dutch                | Netherlands                | nl-NL        |
| English              | United States              | en-US        |
| Finnish              | Finland                    | fi-FI        |
| French               | France                     | fr-FR        |
| German               | Germany                    | de-DE        |
| Greek                | Greece                     | el-GR        |
| Hebrew               | Israel                     | he-IL        |
| Hindi                | India                      | hi-IN        |
| Hungarian            | Hungary                    | hu-HU        |
| Indonesian           | Indonesia                  | id-ID        |
| Italian              | Italy                      | it-IT        |
| Japanese             | Japan                      | ja-JP        |
| Korean               | Korea                      | ko-KR        |
| Latvian              | Latvia                     | lv-LV        |
| Lithuanian           | Lithuania                  | lt-LT        |
| Malay                | Malaysia                   | ms-MY        |
| Norwegian (Bokmål)   | Norway                     | nb-NO        |
| Polish               | Poland                     | pl-PL        |
| Portuguese           | Brazil                     | pt-BR        |
| Portuguese           | Portugal                   | pt-PT        |
| Romanian             | Romania                    | ro-RO        |
| Slovak               | Slovakia                   | sk-SK        |
| Slovenian            | Slovenia                   | sl-SI        |
| Spanish              | Spain                      | es-ES        |
| Swedish              | Sweden                     | sv-SE        |
| Thai                 | Thailand                   | th-TH        |

</br>

In a lot of migration scenarios you have a large number of users that you want to check or customize. To do this, you can import the data based on a user list (csv), and let the users be customized via a PowerShell Loop to modify the users. 
</br>

``` powershell 

Connect-ExchangeOnline

$migrateduser = Import-CSV "Path\Filename.csv"  -Encoding UTF8

Foreach($user in $migrateduser)
{
	Set-MailboxRegionalConfiguration -Identity $user.Mail -Language de-de 
	-DateFormat $null -TimeFormat $null -LocalizeDefaultFolderName  
}

```
</br>
