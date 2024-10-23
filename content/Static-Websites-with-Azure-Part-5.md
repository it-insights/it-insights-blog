---
title: Configure Azure Function App for root domain redirection with SSL support
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
  - Letsencrypt
category: Azure
author: Jan-Henrik Damaschke
date: 2019-07-27 09:00:00
---

Learn how to redirect custom domain traffic for HTTP and HTTPS (with free valid certificate) to another domain with Azure Functions.
<!-- excerpt -->

::blogImage{src="posts/static-websites-with-azure-part-5/less.jpg" alt="ServerLess"}
::

::callout
Photo by [K8](https://unsplash.com/@k8_iv?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
::

Learn how to redirect custom domain traffic for HTTP and HTTPS (with free valid certificate) to another domain with Azure Functions.

This is a multi part article with the following parts:

* [Part 1 - Static site generators](/static-websites-with-azure-part-1/)
* [Part 2 - Setup Azure Storage Account for static websites](/static-websites-with-azure-part-2/)
* [Part 3 - Setup Azure DNS for static websites](/static-websites-with-azure-part-3/)
* [Part 4 - Configure Azure CDN for static websites](/static-websites-with-azure-part-4/)
* Part 5 - Configure Azure Function App for root domain redirection (You are here)

In this part we will implement an Azure Function to redirect traffic from the root of our staticwebsite.de domain to the `www.staticwebsite.de` domain. Then we will use Azure Function proxies and the Let's Encrypt extension in combination with a PowerShell function to get a free SSL certificate.

<!-- toc -->

## Introduction

As explained in [part 4](/static-websites-with-azure-part-4/), it is currently not possible to add root domains like `staticwebsite.de` as a custom domain to Azure CDN. So we need a way to forward traffic to the www subdomain and still provide SSL support to satisfy the requirements for hsts preloading.
I had the following ideas:

* Use the rule engine of Azure CDN in Verizon Premium tier to send 301 replies - *Does not work, as there is currently no way to add root domains to Azure CDN. None of the known workarounds work anymore.*
* Use a function App with consumption plan to return a 301 HTTP status code - *Would work*
* Use function App with app service plan - *Would work.*
* App Service with smallest App service plan with SSL support - *Would work*

I chose the Function App, as it is the cheapest variant and I wanted to test and implement let's encrypt with a PowerShell Function for a long time.

## Setup Azure Function App

First we setup the Azure Function App with PowerShell as language worker.

::blogImage{src="posts/static-websites-with-azure-part-5/functionapp.png" alt="Function App setup"}
::

## Redirection function

::blogVideo{src="posts/static-websites-with-azure-part-5/function_redirector.gif" alt="Redirector function"}
::

When the Function App is ready, we create a new function called "redirector" where the redirection logic will be implemented. We need a HTTP trigger and a HTTP reply as an output so we just use the HTTP trigger template.
We need to create a HTTP reply packet with code 301 for "Moved Permanently" and add the location parameter to the response header. The location parameter tells the browser, where the website has moved to and will directly follow that path.

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

$path = $Request.Headers['x-original-url']

$status = [HttpStatusCode]::MOVED
$headers = @{Location = "https://www.staticwebsite.de$path"}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
    Headers = $headers
    Body = ''
})
```

### Map custom domain

Regarding to the documentation, it is necessary to add a CNAME for our custom domain. As explained in [part 3](/static-websites-with-azure-part-3/), this is not possible for root domain (it's why we are doing this in the first place :wink:), but with a little trickery we can use another validation method to add our custom domain. If we add our custom domain, the function app IP is shown in the portal. We have to create a A record for `@` pointing to this IP. After clicking validate, the portal will tell us that only CNAME is supported for custom domain validation, but will show us the necessary TXT record, if we choose TXT based validation from the dropdown.

DNS entry | type | value
---|---|---
www.staticwebsite.de | CNAME | staticwebsitede.azureedge.net
@ | A | (FunctionAppIp)
@ | TXT | (FunctionAppUrl)

The trick is to click validate again and then switch back to CNAME. Now the custom domain has successful been added to the function app.

::blogVideo{src="posts/static-websites-with-azure-part-5/function_custom_domain.gif" alt="Add custom domain"}
::

### Proxy configuration

::blogVideo{src="posts/static-websites-with-azure-part-5/function_proxy_redirection.gif" alt="Function proxy setup"}
::

To redirect all traffic from the root domain including everything after the forward slash e.g. `http://staticwebsite.de/article01`, we need to create a function proxy that redirects all traffic to our function app. By using the placeholder path, we can later use that part in the code to parse the origin url and append it to the www subdomain. In our example it would redirect to `https://www.staticwebsite.de/article01`.

## SSL with Let's Encrypt

Our redirection function works as expected, but we have just taken care of the HTTP protocol.
We don't want our users to navigate to <https://staticwebsite.de> and get a certificate error, so we need to add a SSL certificate to our custom domain.
We will use the excellent Let's Encrypt extension by [sjkp](https://github.com/sjkp) for this.

### Install Let's Encrypt extension

To install the Let's Encrypt extension, we navigate to extension, click add and choose the Let's Encrypt extension. Wait for the installation and **restart the function app** afterwards.

::blogVideo{src="posts/static-websites-with-azure-part-5/function_letsencrypt.gif" alt="Let's Encrypt extension installation"}
::

We verify the successful installation by browsing the Let's Encrypt extension in the portal by navigating to "site extensions -> Azure Let's Encrypt -> Browse". The website should look like this:

::blogImage{src="posts/static-websites-with-azure-part-5/lets_encrypt_extension.png" alt="Let's Encrypt extension site"}
::

::callout{icon="i-heroicons-information-circle" color="blue"}
Normally this should work without problems, but if you run into timeouts or other errors, try restarting the Function App from Kudu using "Platform features -> Advanced tools (Kudu) -> Site extensions -> Restart Site".
::

### Let's Encrypt reply function

We will create a new function in our app to reply to the ACME challenge and thereby validate the ownership of our domain.

::blogImage{src="posts/static-websites-with-azure-part-5/function_letsencrypt.png" alt="letsencrypt reply function"}
::

There is a [functions v1 example for C#](https://github.com/sjkp/letsencrypt-siteextension/wiki/Azure-Functions-Support) in the docs for the Let's Encrypt extension that I used as a template for the following PowerShell function:

```powershell
using namespace System.Net

param($Request, $TriggerMetadata)

Write-Host "PowerShell HTTP trigger function processed a request."

$code = $Request.Params.rest

$content = [System.IO.File]::ReadAllText("D:\home\site\wwwroot\.well-known\acme-challenge\$code");

$status = [HttpStatusCode]::OK

$body =  $content

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
    Body = $body
})
```

### Proxy configuration

Next we need to define a route for the so called "HTTP-01" ACME challenge. As it is a fixed defined path, we have to route traffic to the path `http://{YOUR_DOMAIN}/.well-known/acme-challenge/{TOKEN}` directly to our reply function. Read more about how letsencrypt validation works from the [Challenge Types Documentation](https://letsencrypt.org/docs/challenge-types/).

So let's create a proxy called "letsencryptAcme" for the redirection with the token parameter captured in the `rest` variable. We use this variable in line 7 of our PowerShell function.

::blogImage{src="posts/static-websites-with-azure-part-5/letsencrypt_proxy.jpg" alt="letsencrypt ACME proxy"}
::

### Request and install certificate

The last thing we need is an Azure Service Principal with permissions on the resourcegroup where the function app and the App Service plan are located. The process is explained by Microsoft in great detail [HERE](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal).
Now we have prepared everything for the Let's Encrypt extension to be able to request and install a certificate for our custom domain. To open the web frontend of the Let's Encrypt extension, we navigate to "Site Extensions -> Azure Let's Encrypt -> Browse".
We are now presented with a form where we have to insert all the details of our service principal as well as the function app name. If you don't want to type your service principal credentials each time you request or renew a certificate, just check the "Update Application Settings and Virtual Directory (if needed)" checkbox.
The settings will then be saved to the application settings of the function app.

::blogVideo{src="posts/static-websites-with-azure-part-5/certificate_installation.gif" alt="Request and install the SSL certificate"}
::

The next step is to press next, choose a custom domain and hit the "Request and Install certificate" button.
After waiting about a minute, we are presented with our brand new or renewed SSL certificate in the summary.

::callout{icon="i-heroicons-information-circle" color="blue"}
If you want to deploy the extension as part of a deployment pipeline or as part of a "[Run from package](https://docs.microsoft.com/en-us/azure/azure-functions/run-functions-from-deployment-package)" deployment, I recommend to set the application settings manually/by script. You can find a [detailed guide on the parameters](https://github.com/sjkp/letsencrypt-siteextension#fully-automated-installation) in the extensions GitHub repo.
::

## Summary

We can test the redirection by opening the "Developer Tools" in Firefox, Chrome or Edge and visit `https://staticwebsite.de`.
The Response Headers look like this:

```bash
HTTP/1.1 301 Moved Permanently
Content-Type: text/plain; charset=utf-8
Location: https://www.staticwebsite.de/
Date: Fri, 26 Jul 2019 19:51:55 GMT
Content-Length: 0
```

The SSL certificate is acknowledged as valid and has the SHA1 thumbprint from the extensions summary page:

```json
{
  "Connection:": {
    "Protocol version:": "TLSv1.2",
    "Cipher suite:": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
    "Key Exchange Group:": "P256",
    "Signature Scheme:": "RSA-PKCS1-SHA1"
  },
  "Host staticwebsite.de:": {
    "HTTP Strict Transport Security:": "Disabled",
    "Public Key Pinning:": "Disabled"
  },
  "Certificate:": {
    "Issued To": {
      "Common Name (CN):": "staticwebsite.de",
      "Organization (O):": "<Not Available>",
      "Organizational Unit (OU):": "<Not Available>"
    },
    "Issued By": {
      "Common Name (CN):": "Let's Encrypt Authority X3",
      "Organization (O):": "Let's Encrypt",
      "Organizational Unit (OU):": "<Not Available>"
    },
    "Period of Validity": {
      "Begins On:": "Friday, July 26, 2019",
      "Expires On:": "Thursday, October 24, 2019"
    },
    "Fingerprints": {
      "SHA-256 Fingerprint:": "56:E1:8A:33:F0:BF:6D:39:E4:BC:88:1E:F3:76:3B:BF:31:49:1A:B6:23:37:E7:59:70:A2:C2:03:81:51:B4:9E",
      "SHA1 Fingerprint:": "50:D8:18:90:28:C6:85:28:51:54:AA:B0:9D:56:1F:FE:35:3D:4E:71"
    },
    "Transparency:": "<Not Available>"
  }
}
```

We now have a function app that listens on HTTP and HTTPS with a valid renewable free SSL certificate that redirects all our traffic to our www subdomain. Feel free to experiment and extend the redirection for your needs!
