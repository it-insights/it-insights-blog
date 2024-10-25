---
title: AWS Root User Management for SSO using Azure Active Directory - Part 2
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
date: 2023-01-13 05:45:00
head:
  meta:
    - name: 'keywords'
      content: 'nuxt, vue, content'
---

Using a central IAM provider is certainly a great thing. While setting SSO up for AWS, the management for the AWS root-users became a issue, because its required for them to have globally unique e-mail address. This might not a problem for small companies, but if you plan several hundred or even thousand of AWS-accounts, this becomes a nightmare real fast. In this post, I will go over one approach on how you can manage all your root-users with M365 offerings and some Azure services, pretty much for free.
This is the second part of the series, that covers the Shared Mailbox Setup.

<!-- more -->
<!-- toc -->

## Introduction

This is a multi part post - you can find all related posts here:

- [Part 1 - Problem, Architecture, next steps](/aws-root-account-management-for-sso-using-azure-active-directory-part-1/)
- Part 2 - Shared Mailboxes (You are here)
- [Part 3 - API](/aws-root-account-management-for-sso-using-azure-active-directory-part-3/)

## Shared Mailbox

Each AWS-accounts root-users' e-mail address must be unique, therefore, we create several shared mailboxes with a lot of aliases as shown below:
::blogImage{src="posts/aws-root-account-management-for-sso-using-azure-active-directory-part-2/2.png" alt="Exchange Online Shared Mailbox Structure"}
::

In this example, we will have 11 shared mailboxes, one main mailbox called `aws@company.com` and ten mailboxes with 300 mail aliases each. The ten mailboxes forward all mails to `aws@company.com`. Thus, all mails com together at a central mailbox. The AWS administrators get access to the shared mailbox `aws@company.com` and therefore have access to all root accounts. Each AWS accounts root-users e-mail will be configured with mail-alias. All mail-aliases and their root-mailbox info will be stored in a table of an Azure Table storage. We will go into more detail in the next and final post.

You can find the initial setup in the [repository](https://github.com/chrburmeister/aws-root-user-management-api).
::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
You need to setup the Azure resources first, otherwise the data will not be written to the table storage. You will find a Terraform deployment within the [repo](https://github.com/chrburmeister/aws-root-user-management-api/tree/main/terraform).
::

[GitHub Gist](https://github.com/chrburmeister/aws-root-user-management-api/blob/main/initial_setup/setup.ps1)

## Next Steps

The third and final post will go over the API for the AWS root-user management.
