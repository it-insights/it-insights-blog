# Build Status

Stage | Status
---------|----------
build deploy | [![build and deploy](https://github.com/it-insights/blog/actions/workflows/build_deploy.yml/badge.svg)](https://github.com/it-insights/blog/actions/workflows/build_deploy.yml)


# Introduction

Static site generator Hexo based blog repo for [itinsights.org](https://www.itinsights.org).

# Getting Started

1. Configure your git name with `git config --global user.name "John Doe"` and `git config --global user.email johndoe@example.com`
1. Clone repo with git
1. Check if you have nodejs installed and configured
1. Check if you have hexo-cli installed (`npm i -g hexo-cli`)
1. Create or update posts and see a local live preview with `hexo server --draft`
1. If an issue during hexo server startup occurs - install hexo server: `npm install hexo-server --save`
1. Commit and push the changes to the preview branch, review on preview url and wait for your post to go live.

# Post publishing flow

1. Create new git branch for your post by using

```bash
git checkout -b post/[name_of_your_post]
git push origin post/[name_of_your_post]
```

or work directly on the preview branch.

1. Create post by using

```bash
hexo new draft '<title>'
```

1. (Optional) Create pull request to preview branch, if not working directly on preview branch.
1. Review content on [preview storage account](https://itinsightsblogpreview.z6.web.core.windows.net/)
1. Check the Authors Kanban Board in Azure DevOps
1. Choose the next available publishing slot (Monday or Tuesday 5:00 AM UTC) and set it in your post like `date: 2020-03-30 05:00:00`
1. Publish post with

```bash
hexo publish draft <title>
```

1. Wait for the post to be merged into master and thereby published by a maintainer

# Posts

## Content

### Topics

We focus on modern, cutting edge technology and technologies that are new to the market or have not been used in the way we describe it. If we write about a topic that has been described before, we focus on adding value by showing new ways, describe things more detailed or add best practices or field knowledge.

### Methods

When we provide technical guidance for one or multiple steps, these always have to be described in code. So e.g. when writing a post about Azure technologies, we always provide guidance in form of console commands or API calls (Azure CLI, Azure PowerShell, ARM templates, REST API).
Pictures can of course be added but are never the primary point of guidance.
When using more than one script/scriptfile, we try to ensure that every command or every step in our posts is as independent as possible. Meaning, when there is no need for a dependency on an earlier step, avoid it.

When working with script blocks we generally use the standard MarkDown script block syntax with highlighting or use the [github/gist tag](#github). When showing the output of one or few more commands, we use the [gdemo-terminal tag](#source-code).

### Reason

We do this due to our commitment to automation and for the readers to be able to reproduce the same steps to get the same outcome (idempotency). It is also much more easy for our readers to reproduce a certain scenario when using terminals like the Azure CloudShell, because there is nearly nothing to prepare and no setup.

## Categories

To flag the post to belong to a cetain category, use the yml list syntax like this:

```bash
category:
 - Azure
```

If you want to work with subcategories, just use the following syntax:

```bash
category:
 - [Azure, Logic Apps]
```

The article would then be listed in the "Logic Apps" category, which is nested under the "Azure" category.

## Tags

Tags are very import for SEO and are also used to generate the tags overview page as well as the tag cloud.
To tag the post with more than one tag, use yml list syntax like in this example:

```bash
tags:
 - Cloud
 - Hexo
 - Azure
 - Azure Storage
 - Website
 - SSL
 - App Service
```

## Keywords

Keywords are not important for SEO anymore and there is no benefit in using them.

## Preview text

There are 2 kinds of preview plugins supported:

1. Taking a part of the original article as introduction on overview pages `<!-- more -->`
2. Using a completely different text as introduction on overview pages `<!-- excerpt -->`

The main difference is that the `excerpt` could be a text part not in the article, but the `more` tag uses the portion of the article until the tag is inserted.

## Pictures

After creating a post with `hexo new`, hexo automatically creates a asset folder named the same as the md file. This folder should be used to hold all post related assets. To refer to these assets, use the hexo tag plugins. With native Markdown image tags, there will be problems with rendering at archive or index pages.
Example with pictures:

```bash
::blogImage{src="--IMG_PATH--/example.png" alt="Picture title"}
::
```

## Source code

You can add sourcecode with standard markdown, but you can also use the plugin gdemo to create beautiful code representation.
There are 2 keywords you can use with the gdemo plugin:

* gdemo_terminal - Terminal window with multiple commands with optional and multiple returns without highlighting to be displayed
* gdemo_editor - Editor window with only code with optional highlighting to be displayed

```bash
{% gdemo_terminal command [minHeight] [windowTitle] [onCompleteDelay] [promptString] [id] [highlightingLang] %}
content
{% endgdemo_terminal %}
```

```bash
{% gdemo_editor [minHeight] [windowTitle] [onCompleteDelay] [id] [highlightingLang] %}
content
{% endgdemo_editor %}
```

### Example

```bash
{% gdemo_terminal '. "c:\\\\temp\\\\AdvancedPing.ps1";$aPing = [AdvancedPing]::new("google.de", 10, 5000);$aPing.ping()' '300px' 'PowerShell 6 (x64)' '500' 'PS C:\>' 'example1' 'powershell' %}
PING google.de (216.58.213.195) 64 bytes of data.
64 bytes from 216.58.213.195: icmp_seq=1 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=2 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=3 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=4 ttl=57 time=3 ms
64 bytes from 216.58.213.195: icmp_seq=5 ttl=57 time=3 ms
--- 216.58.213.195 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 5024ms
{% endgdemo_terminal %}
```

### Azure CloudShell

If you are writing posts about Azure topics and your source code in CloudShell compatible, please add the following right before the 'more' tag:

```bash
...
::callout{icon="i-heroicons-check-circle" color="blue"}
This Post is Azure CloudShell compatible
::
<!-- more -->
...
```

## Github/Gist

To include github code, use the following plugin code in your post:

```bash
{% ghcode https://github.com/PowerShellMafia/PowerSploit/blob/master/AntivirusBypass/Find-AVSignature.ps1 %}
```

You can also include some optional parameters, to customize the output. The following example also includes an optional language tag (use if no row numbers are generated) and custom start and end row numbers:

```bash
{% ghcode https://github.com/PowerShellMafia/PowerSploit/blob/master/AntivirusBypass/Find-AVSignature.ps1 5 20 {lang:PowerShell} %}
```

## Emojis

Emojis can be used within posts by using the syntax `:emojiname:` e.g. :tada:.
You can supported emojis here: [Emoji Cheat Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)

## Theme specific plugins

There are a bunch of inline plugins for highlighting, commenting and embedding content that are built in the theme that we are using for hexo (tranquilpeak).
These can be found here:
[Writing Posts](https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/blob/master/DOCUMENTATION.md#writing-posts)

## Multi part posts

If you want to write an article that consists of multiple parts, use the following syntax:

```Markdown
Introduction intro intro

<!-- more -->

This is a multi part article with the following parts:

* [Part 1 - Title](https://itinsights.org/Your-awesome-article-Part-1/)
* [Part 2 - Title](https://itinsights.org/Your-awesome-article-Part-2/)
* [Part 3 - Title](https://itinsights.org/Your-awesome-article-Part-3/)
* [Part 4 - Title](https://itinsights.org/Your-awesome-article-Part-4/)
```

## Alert boxes

To insert alert boxes, use the following syntax

```bash
{% alert [classes] %}
content
{% endalert %}
```

where classes stands for one of

* info
* success
* warning
* danger
* no-icon

# Theme updating

After updating a the theme by downloading the most current master.zip from the github repo, adjust the following files fom the old settings:

* _config.yml in the theme folder
* en.yml in the language folder
* meta.ejs in the layout/_partial/post folder
* sidebar.ejs in the layout/_partial folder
* copy jslink.js from the old scripts/tags folder to the updated theme
* copy google-analytics-optout.ejs from the old layout/partial folder to the updated theme
* copy cookieconsent.ejs from the old layout/partial folder to the updated theme
* add box shadow to image.js in scripts folder
* fix font loading
* add the following lines at the bottom of head.ejs

```ejs
    <%- partial('google-analytics-optout') %>
    <%- partial('cookieconsent') %>
```

* add the following lines to _config.yml of theme

```yaml
# Integrate Google analytics optout into your site
google_analytics_optout:
    enable: true
```
