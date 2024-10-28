---
title: Invoice Upload to ERP with Logic App and Azure Functions
tags:
  - PowerShell
  - Azure
  - LogicApp
  - Azure Function
  - Automation
author: Jacob Meissner
date: 2024-10-27T17:47:18.000Z
category:
  - Function
---

This example is intended to show how quickly and easily workflows such as the automatic upload of invoices to the ERP system (in this case Lexoffice / Lexware Office) can be implemented using Azure Services.

<!-- more -->

The following services are part of the automation:

- Shared Mailbox (Exchange Online)
- Azure Logic App
- Azure Storage Account
- Azure Function

## Architecture

Let'us start with the first point about architecture and advance planning, which should always be carried out first. This briefly describes the goal and the starting point.
The goal is to have e-mails arriving by e-mail (PDF) automatically imported and processed by the ERP / accounting program, so that the manual effort of uploading them to the software is reduced and you can concentrate on more important things. The starting point is Exchange Online with mailboxes and an ERP / accounting program (LexOffice / Lexware Office) in which the documents / invoices are assigned to the bank postings.

The first and most important question is which ERP software and which interface it offers. In this case, it was relatively easy to find out, because we have a REST API with exact descriptions, so we could start planning.

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241027233937.png" alt="Overview"}

The next step is to create a brief overview of the services. Due to the simple requirement, it is recommended to use Logic App for email processing, because it has ready-made connectors and is relatively inexpensive for the intended purpose. In connection with an Azure Function and a Storage Account (for storing the files), it is efficient and easy to maintain and implement.

## Structure & Implementation

We proceed as follows for the development of the infrastructure and workflow automation, and we need the following resources:

### 1. Mailbox (Exchange Online)

If it does not already exist, we will create a new shared mailbox in Exchange Online. This mailbox will in future receive the files (PDF, etc.) for upload to our ERP.

Note: A shared mailbox is recommended instead of a Microsoft group, as the shared mailbox is included in the standard connector in Logic App and Microsoft 365 Groups are not optimally suited for automated processing.

Beispiel Erstellung Shared Mailbox mit PowerShell:

```powershell
New-Mailbox -Shared -Name "Import" -DisplayName "Import" -Alias Import
```

### 2. Storage Account

We use an Azure Storage account to store the files, if this does not yet exist, one should be created. Basically, local redudant and generalv2 are absolutely fine in this case.

```powershell
az storage account create --name stgeuwerpimport --resource-group rgpeuwerpimport --location westeurope --sku Standard_LRS
```

In the next step, it is very useful to create 2 containers in the storage account "invoiceimport" & "invoicearchive"

```powershell
az storage container create --name invoiceimport --account-name stgeuwerpimport
az storage container create --name invoicearchive --account-name stgeuwerpimport
```

We have now created the framework for storing our PDF and invoice files and we can now focus on workflow automation.

### 3. Azure Logic App

We use the Microsoft Azure Logic App to monitor and trigger the shared mailbox. This means that when an email arrives in the mailbox, it is checked to see whether it contains an attachment and this is automatically processed further and stored in the storage account for further processing. Furthermore, the Logic app will automatically move older documents / files to the archive container so that we only have a manageable number of current files in our storage account container.

he structure of the Logic app is relatively simple and looks as follows:

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028130536.png" alt="LogicApp"}

#### Logic App Plan

Microsoft offers a variety of plans and SKUs for Logic Apps. In this case, a Logic App was used on a consumption basis, as there are only a small number of processing operations and the time factor is not very important.

#### Description / Structure of the Logic App:

##### Trigger

The trigger for the function is the ready-made connector from Microsoft for Exchange Online: ‘When a new email arrives in a shared mailbox (V2)’

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028131221.png" alt="LogicApp"}

First you have to log in to the connector with an M365 account that has access to the shared mailbox. This account is used in the backend to establish the connection and must not be deleted after this.

The settings are set as follows:

- Original Mailbox Address*
  - "Email Adress Shared Mailbox "
- Importance
  - "Any"
- Only with Attachments
  - "Yes /True"
- Include Attachments
  - "Yes /True"
- Folder
  - "Inbox"
- Recurrence
  - Interval "3" "Minute" (MEZ)

All other settings are left at default

#### Actions

As actions we have 2 parallel streams that are processed. 1. stream is the processing and storage of the files and 2. performs a clean-up / archive.

##### Stream 1 - process files

The 1st stream is very simple: we take the attachments from the trigger into the For Each loop and check them for the type by means of condition using contains ‘pdf.’. If this is true, the files with the current utc timestamp and attachment name are stored in the previously created storage account using the Create blob ```‘@{utcNow()}_@{items(’For_each_2‘)?[’name']}’"``.

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028132327.png" alt="LogicAppDetail"}

##### Stream 2 - Archive files / CleanUp

In the 2nd Stream clean-up, the current blob (importinvoice) is read out and selected using a filter ```@{addDays(utcNow(), -3)}`` (everything older than 3 days) and moved to the archive container and then deleted in the import.

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028133205.png" alt="LogicAppDetail2"}

### 4. Azure Function

In order to be able to automate the workflow relatively quickly, I decided to use an Azure function based on Consumption and PowerShell in the example. This is relatively flexible and easy to implement.

#### Description / Code of the Azure Function

##### Trigger

We use the Azure Blob Trigger as the trigger of the function and use our created storage account and the container ‘invoiceimport’

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028133955.png" alt="FunctionTrigger"}

##### Code / PowerShell

The following code was created to access the lexoffice API (files) via API Reuqest and to upload files to it. The access is established via API. This was generated in Lexoffice and not stored in the code but in the Azure Function envrionment variables.

This serves as an example of how an upload can be carried out using a PowerShell function and is not a final function with error handling etc.

```powershell
# Input bindings are passed in via param block.

param([byte[]] $InputBlob, $TriggerMetadata)
$accessToken = $env:LEXOFFICE_API_KEY
$uri = 'https://api.lexoffice.io/v1/files'
$fileName = $TriggerMetadata.Name
$tempFile = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllBytes($tempFile, $InputBlob)
$httpClient = New-Object System.Net.Http.HttpClient
$content = New-Object System.Net.Http.MultipartFormDataContent
$headers = $httpClient.DefaultRequestHeaders
$headers.Clear()
$headers.Add("Authorization", "Bearer $accessToken")
$headers.Add("Accept", "application/json")
$fileStream = [System.IO.File]::OpenRead($tempFile)
$streamContent = New-Object System.Net.Http.StreamContent($fileStream)
$streamContent.Headers.ContentType = New-Object System.Net.Http.Headers.MediaTypeHeaderValue('application/octet-stream')
$content.Add($streamContent, "file", $fileName)
$content.Add((New-Object System.Net.Http.StringContent("voucher")), "type")

try {
    $response = $httpClient.PostAsync($uri, $content).Result
    $responseContent = $response.Content.ReadAsStringAsync().Result
    if ($response.IsSuccessStatusCode) {
        Write-Output "Successfully uploaded: $responseContent"
     } else {
         Write-Output "Error during upload: $($response.StatusCode) - $responseContent"
    }

} catch {
     Write-Error "An error has occurred: $_"
} finally {
    $fileStream.Close()
    Remove-Item $tempFile
    $httpClient.Dispose()
}
```

As mentioned in the section above, the API key is not created and set in the code but in the environemnt variable for the test. It is recommended to save this in an Azure Key Vault and access it using managed identity.

::blogImage{src="posts/LogicAppFunctionERPUpload/Pasted image 20241028134547.png" alt="FunctionEv"}

In summary, this is now a workflow that automatically makes incoming documents that have been sent to a mailbox by e-mail available in the ERP system Lexoffice via Microsoft Azure Service.
