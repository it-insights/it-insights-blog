---
title: Setup Azure DNS for static websites
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
date: 2019-07-19 05:00:00
---

If you want to use Azure resources for website hosting, one of the essential services is DNS. In this blog post we will migrate a DNS zone to Azure DNS and prepare it for usage with an Azure hosted static website.
<!-- more -->
This is a multi part article with the following parts:

* [Part 1 - Static site generators](/static-websites-with-azure-part-1/)
* [Part 2 - Setup Azure Storage Account for static websites](/static-websites-with-azure-part-2/)
* Part 3 - Setup Azure DNS for static websites (You are here)
* [Part 4 - Configure Azure CDN for static websites](/static-websites-with-azure-part-4/)
* [Part 5 - Configure Azure Function App for root domain redirection](/static-websites-with-azure-part-5/)

In this part we will delegate our DNS zone to Azure DNS and prepare it for CDN validation and Function App redirection.

## Azure DNS

First we need to migrate the domain to Azure DNS. Therefore we create a DNS Zone:

```
{
...
  "name": "staticwebsite.de",
  "nameServers": [
    "ns1-03.azure-dns.com.",
    "ns2-03.azure-dns.net.",
    "ns3-03.azure-dns.org.",
    "ns4-03.azure-dns.info."
  ],
...
}
```

To delegate the DNS zone ownership to Azure DNS, we have to open the DNS web portal of the domain hoster, where you bought your domain.
In my case, it’s GoDaddy. To delegate DNS zone ownership, the NS records have to be updated to the Azure DNS servers shown in the output above - including the dots at the end of each record.

::blogImage{src="posts/static-websites-with-azure-part-3/godaddy_dns.PNG" alt="GoDaddy nameserver entries"}
::

To verify a successful delegation, nslookup can be used to receive the primary nameserver from the SOA record.

```
Server:  dns.quad9.net
Address:  9.9.9.9

Non-authoritative answer:
staticwebsite.de
        primary name server = ns1-03.azure-dns.com
        responsible mail addr = azuredns-hostmaster.microsoft.com
        serial  = 1
        refresh = 3600 (1 hour)
        retry   = 300 (5 mins)
        expire  = 2419200 (28 days)
        default TTL = 300 (5 mins)
```

We will use the www subdomain as the main website entry point. That means we have to forward all traffic from the zone apex to www and that www also has to point to the CDN endpoint we will create later. For www subdomain and to verify our custom DNS name on the CDN endpoint later, we are going to create the following records for our DNS zone subdomain:

DNS entry | type | value
---|---|---
www.staticwebsite.de | CNAME | staticwebsitede.azureedge.net
@ | A | (FunctionAppIp)
@ | TXT | (FunctionAppUrl)

As you can see, we add a CNAME pointing to the later created CDN endpoint on the www subdomain. Unfortunately this is not possible for the root domain, as it would contradict to the DNS RFC. This [ISC Blogpost](https://www.isc.org/blogs/cname-at-the-apex-of-a-zone/) explains in detail, why you cannot create CNAME entries in the zone apex.
The two `@` entries are reserved for later. We will create a Azure Function to forward traffic from the root domain to www in [part 5](/static-websites-with-azure-part-5/).

See the next part to learn how to setup the Azure CDN, get a free SSL certificate and use the Verizon rules engine.
