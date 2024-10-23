---
title: Template Chooser
tags:
  - Office 365
  - SharePoint
  - Template Chooser
  - Office Add-In
category: Office 365
author: Jacob Meissner

keywords:
  - Content Chooser
  - Template Chooser
  - officeatwork
  - Office 365
  - SharePoint
  - Template management
  - Office
  - Word
  - Excel
  - PowerPoint
  - Productivity
  - cloud productivty
  - SharePoint Site
  - Azure AD
  - Azure Active Directory
  - Site Collection
  - Template
  - File Template
  - Add-Ins
  - Office Add-Ins
  - Word Add-Ins
  - Microsoft Teams
date: 2019-08-09 15:00:00
---

In many Office 365 projects, SharePoint migrations or document structure planning, the question often araises, where to store templates so that every user has access to them and, more importantly, always uses the latest version.

<!-- more -->

In many companies it is still common practice that documents are stored on a file server share or SharePoint Site and every user downloads templates or finished documents and uses them. In many cases, there are countless versions of templates called "Final_1" or "Final_final". This makes it difficult to keep track of the version history and to ensure an efficient and compliant use with e.g. company design guides.
Therefore, here is a tool powered approach that solves this problem and uses cloud technology to solve all these problems.

::blogImage{src="posts/template-chooser/TemplateChooser0.png" alt="Old way vs. new way to work with templates"}
::

The approach, the company [officeatwork AG](https://www.officeatwork.com/) offers with it's (paid) Apps [Template Chooser](https://docs.officeatwork365.com/manuals/template-chooser/introduction.html) / [Content Chooser](https://docs.officeatwork365.com/manuals/content-chooser/introduction.html) interacts directly with the office applications (Word, Excel, PowerPoint, Project, Teams) in form of Add-Ins. This new feature allows users to access the company's approved templates directly in Word via the respective add-in instead of having to navigate through shares or sites as before.

## Template chooser

The template chooser directly accesses files from SharePoint Online (Template Chooser Site Collection) and let's the user decide, which template to use as a base. So you always have a central version and no longer have to maintain different files (FileServer, Intranet, etc.). You can see how easy this is in the following GIF:

::blogVideo{src="posts/template-chooser/template_chooser.gif" alt="Template Chooser"}
::

But Template Chooser is just the first part of officeatwork Template Management.

## Template Designer

The more interesting part is the personalization of documents. This means that not only can documents simply be stored as templates, they can also be provided with placeholders. These can be for example fields from Office 365, personal outlook contacts, SharePoint lists, plain text fields, dropdowns and more. Therefore the editor (name, position, department) could be automatically entered in the document while creating by using the Azure Active Directory / Office365 data.

::blogVideo{src="posts/template-chooser/template_chooser_personalize.gif" alt="Personalize Template"}
::

The adaptation of documents and the adding of placeholders and inuput fields can easily be done via the Designer Add-In of officeatwork. No in-depth macro knowledge is required as a simple and intuitive user interface is provided.

::callout{icon="i-heroicons-information-circle" color="blue"}
As the placeholders are calculated using [nunjucks](https://mozilla.github.io/nunjucks/templating.html) you can create very advanced and complex dynamic content by using value functions.
::

## Content Chooser

There is one more add-in that we have to mention when talking about officeatwork template management. Content Chooser let's you manage your content in the same way as you manage your templates. That means that you can store pictures in several formats, textblocks as txt and even full xml formatted text blocks like a table of content or a product description. These can then easily be inserted from inside of the current Office application with a similar interface to template chooser.
Here are the supported content types that content chooser can manage:

|  | DOCX | OOXML | TXT | HTML | PNG | JPG | GIF | BMP | SVG |
|------------|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| Word | X | X | X | X | X | X | X | X | X |
| Excel |  |  | X |  | X | X | X | X | X |
| PowerPoint |  |  | X |  | X | X | X | X | X |
| OneNote |  |  | X |  | X | X | X | X |  |
| Outlook |  |  | X | X |  |  |  |  |  |

## Summary

The [software from officeatwork](https://www.officeatwork365.com/products.html) is a really good alternative to existing Office Template management solutions based on Intranet / Fileserver or similar infrastructure. And the best is, you can use the add-ins as standalone or together and only prerequisite is Office 2016/2019/365 and even the iOS version is supported.
If you want to follow a modern workplace approach with Office 365 integration and looking for an uncomplicated way of managing your templates, you should take a look at the officeatwork suite.

::callout
Disclaimer: We have not been paid or received sponsoring for writing this article. This article only reflects the opinions and experiences of the author.
::
