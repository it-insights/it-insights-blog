---
title: Setup Azure storage account for static websites
tags:
  - Cloud
  - Hexo
  - Azure
  - Azure Storage
  - Website
  - SSL
  - App Service
  - Security
  - DNS
  - CDN
  - Serverless
category: Azure
author: Jan-Henrik Damaschke
date: 2019-07-18 15:30:00
---

In this blog we will learn how setup an Azure Storage Account for static website usage and what the limitations of Azure storage accounts for static websites are.
<!-- more -->
This is a multi part article with the following parts:

* [Part 1 - Static site generators](/static-websites-with-azure-part-1/)
* Part 2 - Setup Azure Storage Account for static websites (You are here)
* [Part 3 - Setup Azure DNS for static websites](/static-websites-with-azure-part-3/)
* [Part 4 - Configure Azure CDN for static websites](/static-websites-with-azure-part-4/)
* [Part 5 - Configure Azure Function App for root domain redirection](/static-websites-with-azure-part-5/)

In this part we will take a look at the required Microsoft Azure services for static website hosting and setup the storage account as main part of our website backend.

## Azure Services

For the setup, we will be using Azure CLI in Azure Cloud shell. That is the easiest way and it enables us to work completely from our browser. We already created a resourcegroup called `staticwebsitedemo`, where all resources needed for our website are located.

We will use the following Azure services:

Azure Service | Description | Comments
---|---|---
Storage Account | We will use the "static website" feature of Azure storage accounts to host our website. | Custom SSL certificate/domain not supported
CDN Verizon | We will use the verizon CDN for caching, redirecting and (free!) SSL certificates. | We use the "Premium Verizon" tier to have the rules engine available
DNS Zone | We will use the DNS zone to host all necessary DNS records of the site. | We need to use a workaround for CNAME apex records for CDN validation
Function App | Used for redirection from root domain to subdomain www. | Workaround, as root domains can currently not be added to a CDN endpoint

## Storage Account

At first, we will setup the storage account name `staticsitedemo` for our test blog:

```
{
  ...
  "primaryEndpoints": {
    "blob": "https://staticsitedemo.blob.core.windows.net/",
    "dfs": "https://staticsitedemo.dfs.core.windows.net/",
    "file": "https://staticsitedemo.file.core.windows.net/",
    "queue": "https://staticsitedemo.queue.core.windows.net/",
    "table": "https://staticsitedemo.table.core.windows.net/",
    "web": "https://staticsitedemo.z6.web.core.windows.net/"
  },
  "primaryLocation": "westeurope",
  "provisioningState": "Succeeded",
  "resourceGroup": "staticwebsitedemo",
...
}
```

Next we need to enable the static website feature on the created storage account:

```
{
...
  "staticWebsite": {
    "enabled": true,
    "errorDocument_404Path": null,
    "indexDocument": "index.html"
  }
}
```

We have now created the complete hosting backend for our static website. We could already start using it by uploading files into the `$web` container and visiting the above shown url `https://staticsitedemo.z6.web.core.windows.net/`.
But as already described in the overview table, there are several limitation that we need to tackle:

* Storage Accounts support HTTPS but not for custom domains. A custom domain could be added to the storage account, but HTTPS will not work with it.
* Storage Accounts don't support HTTP to HTTPS forwarding
* Storage Account don't support caching
* Storage accounts don't support PFS

We will implement all listed features in the following parts using only Azure services.

See the next part to learn about how to migrate your DNS zone to Azure and how to configure it for custom domain usage with your static site.
