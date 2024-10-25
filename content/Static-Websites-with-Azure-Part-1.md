---
title: Static Websites with Azure - Static site generators
tags:
  - Cloud
  - Hexo
  - Azure
  - Azure Storage
  - Website
  - SSL
  - App Service
  - Security
category: Azure
author: Jan-Henrik Damaschke
date: 2019-01-25 18:55:33
---

This blog series explains what static site generators are, why we have chosen a static site generator for our blog, how static sites can be implemented using only Microsoft Azure technologies and when you should consider using them vs. a CMS like WordPress.

<!-- more -->

This is a multi part article with the following parts:

- Part 1 - Static site generators (You are here)
- [Part 2 - Setup Azure Storage Account for static websites](/static-websites-with-azure-part-2)
- [Part 3 - Setup Azure DNS for static websites](/static-websites-with-azure-part-3)
- [Part 4 - Configure Azure CDN for static websites](/static-websites-with-azure-part-4)
- [Part 5 - Configure Azure Function App for root domain redirection](/static-websites-with-azure-part-5)

## Static site generators

When you are working with websites from time to time, you normally have one or a bunch of preferred solutions that you take as a framework and start customizing till you have what you were looking for. For me this was WordPress for a long time, but I was always annoyed by all the effort you had to put into customizing if you just wanted quite simple things and it normally ended with installing a third party plugin.
I always found it annoying that the whole WordPress ecosystem is dependent on third party plug-ins, as the minority of users is able to create own plug-ins to achive what they want.

My main reasons against WordPress are:

- Overhead for relative simple websites or blogs
- You basically need a WordPress plugin for everything, if you don‘t want to write posts in pure HTML
- Because of the amount of third party extensions, vulnerabilities are very common and therefore the operational overhead needed to keep all plugins up to date (not everything supports auto update). &nbsp;As [this current article by imperva](https://www.imperva.com/blog/the-state-of-web-application-vulnerabilities-in-2018/) shows, the number of WordPress vulnerabilities has tripled last year, whereby 98% of all vulnerabilities are actually third party WordPress modules.
- Backup is much more complicated than using a versioning system like git and doing a bare clone from another place from time to time as an additional backup.

With this in mind, I came across static site generators. What they basically do is take some source files (normally MarkDown) and generate static HTML sites from these source files.
The theming is completely done via templating. This means that there are template files in one of the common templating languages like EJS, pug or NunJucks.
Some of the most used static site generators are:

- Jekyll (Ruby)
- Hugo (Go)
- Hexo (JavaScript)
- Next (JavaScript)
- ...

I chose Hexo, as I found a very active community. Also for customization, I would rather like to use JavaScript than Go or Ruby.
As Next is a react framework and I don't have any prior knowledge to react, this was not an option.

To get started with Hexo, just visit their [https://hexo.io/](https://hexo.io/) or the [https://github.com/hexojs/hexo](github repo).

I made a short recording, how to get started with hexo in under 30 seconds:

::blogVideo{src="posts/static-websites-with-azure-part-1/hexo_setup.gif" alt="Hexo setup"}
::

The most important hexo resources can be found here:

- [hexo plugins](https://hexo.io/plugins/)
- [hexo themes](https://hexo.io/themes/)

See the next part to learn how to setup and configure a Azure Storage account for usage with static websites.
