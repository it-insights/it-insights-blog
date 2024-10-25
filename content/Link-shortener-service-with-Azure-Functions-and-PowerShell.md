---
title: Link shortener service with Azure Functions and PowerShell
tags:
  - PowerShell
  - REST
  - API
  - Azure
  - Azure Functions
author: Jan-Henrik Damaschke
date: 2020-03-30 05:00:00
category: Azure
---

I recently had to write some code to provide a one time link functionality, where links will be invalidated and the underlying files will be deleted as soon as they are accessed once. This brought me to the idea, we will take a look at today. I basically wanted to create a REST API for a link shortener service.

<!-- more -->
<!-- toc -->

As we have to write a lot of concepts and whitepapers at our company, there is always a problem with keeping links up to date and with not overloading sections with 200 character links.
The first thing I did was creating a list of functionalities that our API should provide:

- Create shortlink
- Get shortlink
- Delete shortlink
- Update shortlink

## Requirements

We will use the following resources for our link shortener backend:

- Azure Function App (used for functions and proxies)
- Azure Storage account (for Function App an table storage)
- Custom domain (optional)

Besides higher tiers (e.g. dedicated for Function) I would also recommend considering the following services for production API's with higher requirements:

- Azure API Management
- Azure CDN

## API design

For the API design, I wanted to be as compliant with HTTP standards as possible. I decided to go with one single endpoint for shortlinks under api.yourdomain.abc/v1/shortlink. Depending on the chosen HTTP method, the corresponding Azure Function will be called. The routing should be achieved by using Azure Function proxies. Also if you want to access a specific link with the GET function, always use the schema api.yourdomain.abc/v1/shortlink/{yourId} instead of api.yourdomain.abc/v1/shortlink?id={yourId}. Otherwise it could be agued that you are not compliant or at least not using best practices.
That is why we have two functions, getShortlink and getShortlinkDetails. The former is for getting a shortlink by the accessKey query string with all details, the latter is just for checking, if the shortlink is available and it returns a HTTP ok (200) or conflict (409) status code depending on the availability.

::blogImage{src="posts/link-shortener-service-with-azure-functions-and-powershell/api_design.png" alt="API design"}
::

The following table describes the configuration of Azure Functions and Azure Function proxies:

| Resource                                         | Authorization | Allowed Methods | Backend Url                                 |
| ------------------------------------------------ | ------------- | --------------- | ------------------------------------------- |
| Azure Function (getShortlink)                    | Function Key  | GET             | -                                           |
| Azure Function (getShortlinkDetails)             | Function Key  | GET             | -                                           |
| Azure Function (createShortlink)                 | Function Key  | POST            | -                                           |
| Azure Function (deleteShortlink)                 | Function Key  | DELETE          | -                                           |
| Azure Function (updateShortlink)                 | Function Key  | PATCH           | -                                           |
| Azure Function proxy (/v1/shortlink/{shortlink}) | Anonymous     | GET             | <https://localhost/api/getShortlink>        |
| Azure Function proxy (/v1/shortlink)             | Anonymous     | GET             | <https://localhost/api/getShortlinkDetails> |
| Azure Function proxy (/v1/shortlink)             | Anonymous     | POST            | <https://localhost/api/createShortlink>     |
| Azure Function proxy (/v1/shortlink)             | Anonymous     | DELETE          | <https://localhost/api/deleteShortlink>     |
| Azure Function proxy (/v1/shortlink)             | Anonymous     | PATCH           | <https://localhost/api/updateShortlink>     |

We will use the localhost notation to avoid internet roundtrips for Azure Function proxies. We also have to add the HTTP method to enable filtering by objective (GET to getShortlink).
I made some decisions that you might want to re-evaluate for your specific use case:

- POST or PUT for create method? I decided to use POST, as it is currently a dedicated creation endpoint. If I we decide to change it to "Create or Update" in the future, I just have to change it to PUT. But anyway, both are correct.
- Use a body for DELETE? Regarding to the [spec](https://tools.ietf.org/html/rfc7231#section-4.3.5), it is totally fine to use a body object with delete, but for simplicity, we will use query attributes.

## Implementation

### Azure Function proxies

To apply the proxy configuration from the above table, we can use the following json:

```json
{
  "$schema": "http://json.schemastore.org/proxies",
  "proxies": {
    "Get": {
      "matchCondition": {
        "route": "/v1/shortlink",
        "methods": [
          "GET"
        ]
      },
      "backendUri": "https://localhost/api/getShortlinkDetails",
      "requestOverrides": {
        "backend.request.querystring.code": "FUNCTION_KEY"
      }
    },
    "Delete": {
      "matchCondition": {
        "route": "/v1/shortlink",
        "methods": [
          "DELETE"
        ]
      },
      "backendUri": "https://localhost/api/deleteShortlink",
      "requestOverrides": {
        "backend.request.querystring.code": "FUNCTION_KEY"
      }
    },
    "Update": {
      "matchCondition": {
        "route": "/v1/shortlink",
        "methods": [
          "PATCH"
        ]
      },
      "backendUri": "https://localhost/api/updateShortlink",
      "requestOverrides": {
        "backend.request.querystring.code": "FUNCTION_KEY"
      }
    },
    "Create": {
      "matchCondition": {
        "route": "/v1/shortlink",
        "methods": [
          "POST"
        ]
      },
      "backendUri": "https://localhost/api/createShortlink",
      "requestOverrides": {
        "backend.request.querystring.code": "FUNCTION_KEY"
      }
    },
    "GetChildren": {
      "matchCondition": {
        "route": "/v1/shortlink/{shortlink}",
        "methods": [
          "GET"
        ]
      },
      "backendUri": "https://localhost/api/getShortlink/{shortlink}",
      "requestOverrides": {
        "backend.request.querystring.code": "FUNCTION_KEY"
      }
    }
  }
}
```

### Azure Functions

To avoid dead links, it's a good idea to require or generate an expiration date. There could also be a function that regularly checks for dead links, but that is something for another day when more functions are implemented :wink:. I chose to generate an expiration date of 90 days by default and provide the possibility to renew this period. I thought it would also be a quite practical to have the possibility to update shortlinks instead of deleting and adding them again.
The following functions are created to provide the basic functionality:

- getShortlink
- deleteShortlink
- updateShortlink
- createShortlink

I dont' want to paste all the code in here, but to provide an idea how we could work with Azure Functions for this task, here is the getShortlinkDetails function:

```powershell
using namespace System.Net

param($shortlinkEntry, $Request, $TriggerMetadata)

$accessKey = $request.query.accessKey

if ($accessKey) {
    if ($accessKey -and $shortlinkEntry) {
        $status = [HttpStatusCode]::Ok
        $body = @{shortlink = $shortlinkEntry.PartitionKey; expirationDate = $shortlinkEntry.expirationDate; url = $shortlinkEntry.url}
    }
    else {
        $body = "Access key not found"
        $status = [HttpStatusCode]::NotFound
    }
}
else {
    $status = [HttpStatusCode]::BadRequest
    $body = "Missing parameters"
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
    Body = $body
})
```

and this is the corresponding `function.json` binding configuration:

```json
{
  "bindings": [
    {
      "authLevel": "admin",
      "type": "httpTrigger",
      "direction": "in",
      "name": "Request",
      "methods": [
        "get"
      ],
      "route": "getShortlink/{shortlink}"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    },
    {
      "name": "shortlinkEntry",
      "tableName": "shortlinks",
      "take": 50,
      "filter": "PartitionKey eq '{shortlink}'",
      "connection": "YOUR_STORAGE_CONNECTION",
      "direction": "in",
      "type": "table"
    }
  ],
  "disabled": false
}
```

### Web Application

We can now call the API from a web application (I am using NUXTjs which uses axios as a library for HTTP requests) like this in a form:

```javascript
function onSubmit(evt) {
  evt.preventDefault()
  this.$axios({
    method: 'POST',
    url: 'https://api.yourdomain.abc/v1/shortlink',
    data: JSON.stringify(this.form),
    headers: { 'content-type': 'application/json' }
  })
    .then((result) => {
      this.onReset()
      this.submitSuccess = true
    })
    .catch((error) => {
      console.error(error)
      this.submitError = true
    })
}
```

For the access key and the corresponding link information, I have created a validation module for the HTML form that enabled updates:

```javascript
async function isValid(value) {
  if (value === '' || value === null)
    return false
  try {
    const { data } = await this.$axios.get(
      `https://api.yourdomain.abc/v1/shortlink?accessKey=${value}`
    )
    this.form.url = data.url
    this.form.date = data.expirationDate
    return Boolean(await data)
  }
  catch {
    return false
  }
}
```

## Summary

I hope you got some ideas on how to create your own Azure API with Azure Function proxies and an idea which ways you can go. In a later blog post, we will take a detailed look on how to authenticate API requests of the REST APIs using Azure provided authentication services like Azure AD and Azure AD B2C.
