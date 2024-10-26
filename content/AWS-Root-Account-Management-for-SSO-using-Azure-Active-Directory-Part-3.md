---
tags:
  - Azure
  - Azure Active Directory
  - AWS
  - AWS IAM
  - Identity and Access Management
  - IAM
  - AWS root user
category:
  - Azure
author: Christoph Burmeister
date: 2023-03-02 05:45:00
title:
---

Using a central IAM provider is certainly a great thing. While setting SSO up for AWS, the management for the AWS root-users became a issue, because its required for them to have globally unique e-mail address. This might not a problem for small companies, but if you plan several hundred or even thousand of AWS-accounts, this becomes a nightmare real fast. In this post, I will go over one approach on how you can manage all your root-users with M365 offerings and some Azure services, pretty much for free.
This is the third and final part of the series, that covers the API and deployment.

<!-- more -->
<!-- toc -->

## Introduction

This is a multi part post - you can find all related posts here:

- [Part 1 - Problem, Architecture, next steps](/aws-root-account-management-for-sso-using-azure-active-directory-part-1)
- [Part 2 - Shared Mailboxes](/aws-root-account-management-for-sso-using-azure-active-directory-part-2)
- Part 3 - API (You are here)

## API

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
The Function App is written in PowerShell and therefore is kind of slow for this purpose. However, the amount of request is so low, it does not matter for this case. Unless you deploy 100 AWS accounts a minute, you will be fine :wink:
::

The code can be found [here](https://github.com/chrburmeister/aws-root-user-management-api/tree/main/function_app/aws_root_account_mail_mgmt).

The API provides four endpoints:

- getAwsRootAccount
- newAwsRootAccount
- updateAwsRootAccount
- deleteAwsRootAccount

Below, you will find examples for each endpoint.

### getAwsRootAccount

List root-users by either:

- AWS account id
- user mail
- aws mail

```powershell
$uri = 'https://<function_name>.azurewebsites.net/api/getAwsRootAccount?code=<auth code>&aws_account_id=12345'
$response = Invoke-WebRequest -Method Get -Uri $uri
Write-Output $response.content

$uri = 'https://<function_name>.azurewebsites.net/api/getAwsRootAccount?code=<auth code>&user_mail=first.last@comany.com'
$response = Invoke-WebRequest -Method Get -Uri $uri
Write-Output $response.content

$uri = 'https://<function_name>.azurewebsites.net/api/getAwsRootAccount?code=<auth code>&aws_mail=first.last@comany.com'
$response = Invoke-WebRequest -Method Get -Uri $uri
Write-Output $response.content
```

### newAwsRootAccount

```powershell
$uri = 'https://<function_name>.azurewebsites.net/api/newAwsRootAccount?code=<auth code>'
$body = @{
  'user_mail' = 'first.last@company.com'
}

$response = Invoke-WebRequest -Method Post -Uri $uri -Body (ConvertTo-Json -InputObject $body)

Write-Output $response.content
```

### updateAwsRootAccount

```powershell
$uri = 'https://<function_name>.azurewebsites.net/api/updateAwsRootAccount?code=<auth code>'
$body = @{
  'aws_mail'       = 'aws_aijkdhs@company.com'
  'aws_account_id' = '123'
}

$response = Invoke-WebRequest -Method Put -Uri $uri -Body (ConvertTo-Json -InputObject $body)

Write-Output $response.content
```

### deleteAwsRootAccount

```powershell
$uri = 'https://<function_name>.azurewebsites.net/api/deleteAwsRootAccount?code=<auth code>'
$body = @{
  'aws_mail' = 'aws_aijkdhs@company.com'
}

$response = Invoke-WebRequest -Method Delete -Uri $uri -Body (ConvertTo-Json -InputObject $body)

Write-Output $response.content
```

## Deployment

Some of you might have already spotted it, there are some pipelines includes in the repo in the [**.azuredevops**](https://github.com/chrburmeister/aws-root-user-management-api/tree/main/.azuredevops) folder. They are written for Azure Pipelines, and I would suggest you give them a go.
If you want to learn more about those pipelines, I would suggest a previous [post](https://itinsights.org/Terraform-Ecosystem-Pipelines), they are all explained in further detail over there :wink:

## Conclusion

With this, your AWS team can manage all e-mail related tasks their own and your IT department has no worries for this. And If you run out of aliases, just create another shared mailbox using the script and you are good to go.
