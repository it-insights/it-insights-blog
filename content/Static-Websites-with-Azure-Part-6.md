---
title: Static Websites with Azure - Part 6
author: itinsights
draft: true
---

This blog series explains what static site generators are, why we have chosen a static site generator for our blog, how static sites can be implemented using only Microsoft Azure technologies and when you should consider using them vs. a CMS like WordPress.
<!-- more -->

This is a multi part article with the following parts:

* [Part 1 - Static site generators](https://itinsights.org/Static-Websites-with-Azure-Part-1/)
* [Part 2 - Setup Azure Storage Account for static websites](https://itinsights.org/Static-Websites-with-Azure-Part-2/)
* [Part 3 - Setup Azure DNS for static websites](https://itinsights.org/Static-Websites-with-Azure-Part-3/)
* [Part 4 - Configure Azure CDN for static websites](https://itinsights.org/Static-Websites-with-Azure-Part-4/)
* [Part 5 - Configure Azure Function App for root domain redirection](https://itinsights.org/Static-Websites-with-Azure-Part-5/)
* Part 6 - Setup Azure DevOps CI/CD pipeline for static websites (You are here)

In this part we will implement an Azure Function to redirect traffic from the root of our staticwebsite.de domain to the www.staticwebsite.de domain. Then we will use Azure Function proxies and the letsencrypt extension in combination with a PowerShell function to get a free SSL certificate.