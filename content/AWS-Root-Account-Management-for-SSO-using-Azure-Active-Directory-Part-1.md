---
title: AWS Root User Management for SSO using Azure Active Directory - Part 1
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
date: 2022-12-16 05:45:00
---

Using a central IAM provider is certainly a great thing. While setting SSO up for AWS, the management for the AWS root-users became an issue, because its required for them to have globally unique e-mail address. This might not a problem for small companies, but if you plan several hundred or even thousand of AWS-accounts, this becomes a nightmare real fast. In this post, I will go over one approach on how you can manage all your root-users with M365 offerings and some Azure services, pretty much for free.

<!-- more -->
<!-- toc -->

## Introduction

This is a multi part post - you can find all related posts here:

- Part 1 - Challenge, Architecture, next steps (You are here)
- [Part 2 - Shared Mailboxes](/aws-root-account-management-for-sso-using-azure-active-directory-part-2)
- [Part 3 - API](/aws-root-account-management-for-sso-using-azure-active-directory-part-3)

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
I used Azure Active Directory as the central IAM, but this topic is valid for all IAM solutions and even just a standalone AWS deployments. However, this post will not cover the actual setup of SSO and SCIM for AWS IAM Identity Center using Azure AD. You can find the official SSO and SCIM setup documentation [here](https://learn.microsoft.com/en-us/azure/active-directory/saas-apps/aws-single-sign-on-provisioning-tutorial).
::

## The Challenge

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
All terms in regards to AWS components like accounts, root-users, IAM users and so an will be quiet confusing at first, but it will get better with little time.
::

Depending on how your organization managing e-mail addresses, setting up and managing hundreds or even thousands of e-mail accounts can cause some major issues in your IT department. Most companies have a central e-mail solution and technical users have one purpose and one purpose only, even if they only used for sending mails.

Some possible problems:

- cost
  - using e-mail in Azure AD accounts and something like G-Suite cost money for licenses to have a mailbox
- administrative overhead
- security concerns
  - you have to disable 2FA for these accounts
- access to several mailboxes
- plenty more

Some obvious Challenge, or I would rather say inconveniences emerge regardless:

- MFA 2FA setup for AWS root-users
- storing and managing credentials
- managing e-mail addresses

The main goal of this series is to setup the management of centrally managed e-mail addresses for the root-users.

Looking at the AWS account structure (below), you will see, that each AWS account, even the root account, requires a root user.

::blogImage{src="posts/aws-root-account-management-for-sso-using-azure-active-directory-part-1/1.png" alt="AWS Account Structure"}
::

<!-- <br> -->

On the other hand, IAM users must not be unique and also can be created using SCIM from your central identity provider (an Azure AD for instance). They can even be created by SCIM as IAM users in the AWS root account and then be added as IAM Users to child AWS accounts.
The diagram below shows this

::blogImage{src="posts/aws-root-account-management-for-sso-using-azure-active-directory-part-1/4.png" alt="AWS IAM Account Provisioning using SCIM"}
::

## Architecture

The solution has three main components:

- Shared Mailboxes from Exchange Online
- a database for managing the shared mailboxes and their aliases
- a Function App to provide an API for the AWS DevOps team

The figure below shows the architecture but I will cover all of the components in the next two posts.

::blogImage{src="posts/aws-root-account-management-for-sso-using-azure-active-directory-part-1/3.png" alt="Architecture"}
::
<br>
