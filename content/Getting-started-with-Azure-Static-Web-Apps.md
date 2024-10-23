---
title: Getting started with Azure Static Web Apps
tags:
  - Cloud
  - Hexo
  - Azure
  - Static Web Apps
  - Azure Storage
  - Website
  - SSL
  - App Service
  - Security
category: Azure
author: Jan-Henrik Damaschke
date: 2020-05-22 12:00:00
---

At Microsoft Build 2020 [lots of new updates and services](https://aka.ms/Build2020BookOfNews) were announced. Today we will take a look at a specific one that I am pretty excited about, Static Web Apps. Read on to learn what it is, how to use it and and why it helps us to reduce effort when deploying web applications to Microsoft Azure.

<!-- more -->
<!-- toc -->

## Introduction

First things first, what exactly is Static Web Apps? It is a new service that combines the features of many other Azure resources that we would otherwise need to deploy a production ready static web app to Azure. This includes services like:

- Azure Storage  (for all the files)
- (Optional) Azure Function Apps (as serverless backend)
- (Optional) Azure CDN (for free SSL, Caching and CDN rules)
- (Optional) CI/CD integration (e.g. with Azure DevOps)

With Azure Static Web Apps you have all this in one service. These are the key features of Static Web Apps (as described by Microsoft):

- Free web hosting for static content like HTML, CSS, JavaScript, and images.
- Free API support provided by Azure Functions.
- First-party GitHub integration where repository changes trigger builds and deployments.
- Globally distributed static content, putting content closer to your users.
- Free SSL certificates, which are automatically renewed.
- Custom domains to provide branded customizations to your app. (apex will be available after preview)
- Seamless security model with a reverse-proxy when calling APIs, which requires no CORS configuration.
- Authentication provider integrations with Azure Active Directory, Facebook, Google, GitHub, and Twitter.
- Customizable authorization role definition and assignments.
- Back-end routing rules enabling full control over the content and routes you serve.
- Generated staging versions powered by pull requests enabling preview versions of your site before publishing.

To understand how these can help us, we will first start with a small deployment that we can use as an example throughout the post.

::callout{icon="i-heroicons-information-circle" color="blue"}
If you want to follow though and compare Static Web Apps to a current approach, read [our older posts here](/static-websites-with-azure-part-1).
::

## Deployment

Currently the only deployment option is GitHub. We have to sign-in with our GitHub credentials at the first step of the setup wizard. Without linking a repository, we cannot continue setup.

::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_deployment_01.png" alt="Static Web App resource in Azure portal"}
::

The following steps are required to get our Static Web App up and running. We will use the static site generator Hexo (which also powers this blog) to show the process:

1. We have to create a new GitHub repository (assuming we don't want to use an existing one). We called ours "hexo-demo"
1. No we can create our Static Web App by going through the wizard
1. The last step is to push some code into our repository and see the magic happen

We choose a name and a resource group and sign-in with our GitHub account to choose the right repository ("hexo-demo").
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_04.png" alt="Static Web Apps wizard"}
::
We leave everything at default as we don't have a function app right now.
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_05.png" alt="Static Web Apps wizard"}
::
We can check all our settings in the summary and finally deploy our service.
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_06.png" alt="Static Web Apps wizard"}
::

Next, we just execute the following few lines to initialize a new hexo website and push it to Static Web Apps:

```bash
npm install hexo-cli -g
cd /hexo-demo
hexo init
git add -A
git commit -m 'Initial commit'
git push
```

Now we can navigate to the link provided in the Static Web App overview:
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_07.png" alt="Static Web App overview"}
::
Where we see our newly created hexo website:
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_website.png" alt="New hexo website"}
::

What happened in the background was that Azure created a new GitHub action based on all our parameters in the .github/workflows folder of our repository. This, when triggered, deploys the content of our web app and of the optional Function App to Azure Static Web Apps (probably a storage account).

In one of our next posts, we will migrate our NUXT.js and Azure Functions based link shortener service to Azure Static Web Apps, so stay tuned for a real-world example.

## Architecture

Let's start with the architecture. In the following sections, we will take a look at the most important topics and compare them to the current experience.`

### Backend communication

With classic Azure services, a serverless backend needs to be integrated via client-side REST over public internet and hosted in a different service like Azure Functions.
Static Web Apps come with integrated Azure Functions that use an internal reverse-proxy when calling APIs, which requires no CORS configuration.
It does not only mean that we have an "api" route available, but also that we can manipulate routes to e.g. serve some subpage only if the user is authenticated without changing anything in our web application.
This is completely optional and can be defined at creation time or later on, updating the GitHub Actions YAML configuration with the correct `api_location` entry:

```yaml
...
- name: Build And Deploy
  id: builddeploy
  uses: Azure/static-web-apps-deploy@v0.0.1-preview
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_PEBBLE_0AB7DB803 }}
    repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
    action: upload
    # ##### Repository/Build Configurations - These values can be configured to match you app requirements. ######
    app_location: / # App source code path
    api_location: api # Api source code path - optional
    app_artifact_location: '' # Built app content directory - optional
    # ##### End of Repository/Build Configurations ######
...
```

### Custom Domains

If we want to use custom domains with the current Azure services, custom domains can be added to the storage account, what leads to missing support for SSL. Instead we would use a Azure CDN to use its free SSL certificates (see the Security section) and maybe a Azure DNS zone. Additionally, as domain apex (staticwebsite.de instead of www.staticwebsite.de) entries are not allowed. So one solution would be to add the root/apex domain name to an Azure Function App, manage let's encrypt with a custom ACME challenge function and redirect everything to <https://www.staticwebsite.de/{rest>}.
Fortunately, custom domains are natively supported in Static Web Apps including Microsoft's free SSL certificate offer. More important, support for Apex domains will be available at GA (General availability) :tada:

### Management

When thinking of a static web app or an SPA in Azure, we currently need at least a few, depending on our goal, a few more Azure services (see the introduction list). One of the biggest benefits of using Static Web Apps is that we have everything (serverless backend and frontend) at one place. There is actually just a single resource being deployed into a resource group:

::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_01.png" alt="Static Web App resource in Azure portal"}
::

#### Routing

HTTP routes would normally be managed in an Azure Function proxy or with a service like Azure API Management (APIM). Thanks to the integrated reverse-proxy, we can directly control internal and external routes from Static Web Apps.
The configuration of routes is done with a routes.json file that has to be placed at the root of the app's build artifact folder. More information on routes and examples can be found [here](https://docs.microsoft.com/en-us/azure/static-web-apps/routes) at the Microsoft Docs.

### Security

Before taking a look at Identity and Access Management (IAM), I want to talk about SSL certificates. For a long time, only bought or custom certificates could be used in Azure services. [It is possible to use let's encrypt in Azure](https://itinsights.org/static-websites-with-azure-part-5, but in is not an intuitive approach although there is a great App Service extension available.
This is why I was excited when [Microsoft announced](https://azure.microsoft.com/en-us/updates/secure-your-custom-domains-at-no-cost-with-app-service-managed-certificates-preview/) the preview of "App Service Managed Certificates". Then I read "If you’re planning to do a live site migration with TXT record, need support for apex domains, or need a wildcard certificate, then use App Service Certificates or bring our own certificate." and was disappointed again. In Static Web Apps however, it will be possible to use Azure Managed (free) certificates on custom domains (that now support root domains)!
As long as we are in preview and root domains are not available, feel free to use the method [mentioned above](https://itinsights.org/static-websites-with-azure-part-5) or use [this excellent tutorial](https://burkeholland.github.io/posts/static-app-root-domain/) by [@Burke Holland](http://www.twitter.com/burkeholland) to achieve the same by using Cloudflare's free CDN tier.

Let's take a look at the current authentication/authorization experience. Currently we would need a mix of an Azure Function App with activated and configured "App service authentication" plus client-side application logic (like MSAL and some internal routing) to configure our login/logout routes and to get and display user information. Static Web Apps have built-In authentication using different OAuth2 providers and it exposes the information as well as the endpoints internally with the reverse-proxy. The currently supported providers are:

- Azure Active Directory
- GitHub
- Facebook
- Google
- Twitter

The big advantage of using the integrated auth is that it does a lot more than default App Service authentication. We can adjust our routes for login or logout and we can orverrite error routes if the user is e.g. "Unauthenticated". To get user information we can directly query a dedicated endpoint from the client or the API.

The only way to add users is to create an invitation (this probably get's extended over time). The invitation also contains roles and results in a role assignment in Static Web Apps:
::blogImage{src="posts/getting-started-with-azure-static-web-apps/static_portal_03.png" alt="Users view including role assignments"}
::

We can access the information by either using the "direct-access" endpoint ("/.auth/me") from our client app or using our FUnction App to parse the "x-ms-client-principal" request header field. The resulting "client principal data" object looks similar to this:

```json
{
  "identityProvider": "facebook",
  "userId": "USERID",
  "userDetails": "user@example.com",
  "userRoles": ["admin", "authenticated"]
}
```

## Pricing

The only currently available pricing tier is free and this free tier will stay  after general availability (GA). When the service is available, additional tiers will be added, probably to allow for some higher performance and better latency. I think this is not really a big difference, as hosting static websites on Azure right now only costs us something between 1$ and 5$ a month depending on the usecase. For more information see our [older posts here](/static-websites-with-azure-part-1).

## Limitations

For me the most annoying limitation write now are:

- Support for all Azure Functions language worker instead of only Node.js (.NET, PowerShell, Python, etc.)
- Integration in other CI/CD services like Azure DevOps

## Summary

I hope you got an idea what Azure Static Web Apps is and how it simplifies handling of static websites and SPA frameworks. Like always, check out the Docs [here](https://docs.microsoft.com/en-us/azure/static-web-apps/)!
In a later blog post, we will migrate our existing link shortener service to Static Web Apps. If you want to keep updated, [follow us on Twitter](https://twitter.com/ItInsights_) or [subscribe to our RSS feed](https://itinsights.org/atom.xml).
