---
title: Weekly digest for twitter with Logic Apps
tags:
  - Cloud
  - Azure
  - Logic Apps
  - Twitter
  - JSON
  - Power Platform
  - Flow
category: Azure
author: Jan-Henrik Damaschke

keywords:
  - Cloud
  - Azure
  - Logic Apps
  - Twitter
  - JSON
  - Power Platform
  - Flow
date: 2019-06-19 01:30:00
---

To keep your readers up to date and to deliver constant social media activity, it's a great idea to provide weekly digests to your readers. And what could be better to get the job done than Azure Logic Apps ;)

<!-- more -->
<!-- toc -->

## Prerequisites

The things we need are

1. Available rss feed of the current blog posts
2. An Azure Account
3. A Twitter account

For our blog we chose the following layout for the twitter posts:

```bash
ItInsights Weekly Digest CW XX

https://itinsights.org/article-name-01
https://itinsights.org/article-name-02
https://itinsights.org/article-name-03

#weekly #digest #insights
```

## Logic App

We start with an empty Logic App.
To collect all the information needed, we will

1. Get all post from the rss feed
2. Filter for the defined interval (7 days)
3. Concat everything together
4. Post it on twitter

In the following steps we will build up the needed actions step by step.

### Trigger

As a trigger we use the Recurrence Action from Logic Apps with the following configuration:

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/Recurrence_Action.JPG" alt="Recurrence Trigger"}
::

```json
{
  "triggers": {
    "Recurrence": {
      "recurrence": {
        "frequency": "Week",
        "interval": 1,
        "startTime": "2019-02-22T09:00:00Z"
      },
      "type": "Recurrence"
    }
  }
}
```

### Variable initialization

To collect all posts into a variable, we need to initialize it first. To declare a variable, we use the "Initialize variable" action.

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/post_string.JPG" alt="post_string initialization"}
::

```json
{
  "Initialize_posts_string": {
    "inputs": {
      "variables": [
        {
          "name": "posts_string",
          "type": "String"
        }
      ]
    },
    "runAfter": {},
    "type": "InitializeVariable"
  }
}
```

### RSS Feed items

To get a recent list of blog posts, we create a "List all RSS feed items" action. The only important parameter is the RSS feed URL. At our blog, the rss feed is located at `https://itinsights.org/atom.xml`

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/RSS_Action.JPG" alt="Get RSS feed items"}
::

```json
{
  "List_all_RSS_feed_items": {
    "inputs": {
      "host": {
        "connection": {
          "name": "@parameters('$connections')['rss']['connectionId']"
        }
      },
      "method": "get",
      "path": "/ListFeedItems",
      "queries": {
        "feedUrl": "https://itinsights.org/atom.xml"
      }
    },
    "runAfter": {
      "Initialize_posts_string": [
        "Succeeded"
      ]
    },
    "type": "ApiConnection"
  }
}
```

### Collect Posts

To collect posts, we first create a "For each" to loop with a Condition over all posts to determine the ones that were released in the last week (7 days). As condition we use and expression to convert the field `publishDate` to DataTime. Then we check if it is greater than the current date decreased by 7 days.
We use the automatic "Body" variable from the previous "List_all_RSS_feed_items" step.

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/ForEach_outer.JPG" alt="Outer For Each"}
::

```json
{
  "expression": {
    "and": [
      {
        "greater": [
          "@formatDateTime(items('For_each_2')?['publishDate'])",
          "@addDays(utcNow(), -7)"
        ]
      }
    ]
  }
}
```

We don't handle the false case, but add an additional "For each" to the true case.
This will be used to append all post links to the "posts_string" variable with the "concat" function.
`concat(items('For_each'), '\n')`
Thanks to the nested property "Feed links", we can directly use that variable and don't need to add logic to get the post links.

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/ForEach_inner.JPG" alt="Inner For Each"}
::

```json
{
  "For_each": {
    "actions": {
      "Append_to_string_variable": {
        "inputs": {
          "name": "posts_string",
          "value": "@concat(items('For_each'), '\n')"
        },
        "runAfter": {},
        "type": "AppendToStringVariable"
      }
    },
    "foreach": "@items('For_each_2')?['links']",
    "runAfter": {},
    "type": "Foreach"
  }
}
```

::callout{icon="i-heroicons-information-circle" color="blue"}
Notice:
We need to add a line break with `\n`. This will not be displayed correctly in the Logic Apps Designer and has to be added in the code view.
::

### Concat and Post Tweet

The last step is to post the collected post links with our defined body on Twitter.
We will use the "Post a tweet" action from the Twitter connector. To use twitter, you have to add a connection after adding the action. Click "Add new" and fill in your Twitter credentials in the following pop-up window. The Oauth token will securely be stored in the background and Azure automatically acquires a new access token every time an action with the specified connection will be used.

The interesting part is the expression to generate the tweet text:

```bash
concat('ItInsights Weekly Digest CW ', If(greater(div(float(dayOfYear(utcNow())),7),div(dayOfYear(utcNow()),7)),div(add(dayOfYear(utcNow()),6),7),div(dayOfYear(utcNow()),7)), '\n\n',variables('posts_string'), '\n', '#weekly #digest #insights')`
```

We use an expression from the powerusers community to get the current calendar week. The algorithm could be known from common coding languages, but a user from the flow community managed to get it to run with the limited functions available in expressions. We just changed it a little bit and changed the third 7 to a 6 to work for the current week.
Here is the link to the discussion: [How-to-calculate-week-number-in-a-year-in-flows](https://powerusers.microsoft.com/t5/Flow-Ideas/How-to-calculate-week-number-in-a-year-in-flows/idi-p/104499)

::blogImage{src="posts/weekly-digest-for-twitter-with-logic-apps/Post_tweet.JPG" alt="Post Tweet"}
::

```json
{
  "Post_a_tweet": {
    "inputs": {
      "host": {
        "connection": {
          "name": "@parameters('$connections')['twitter']['connectionId']"
        }
      },
      "method": "post",
      "path": "/posttweet",
      "queries": {
        "tweetText": "@{concat('ItInsights Weekly Digest CW ', If(greater(div(float(dayOfYear(utcNow())),7),div(dayOfYear(utcNow()),7)),div(add(dayOfYear(utcNow()),6),7),div(dayOfYear(utcNow()),7)), '\n\n',variables('posts_string'), '\n', '#weekly #digest #insights')}"
      }
    },
    "runAfter": {
      "For_each_2": [
        "Succeeded"
      ]
    },
    "type": "ApiConnection"
  }
}
```

::callout{icon="i-heroicons-information-circle" color="blue"}
Notice:
We need to add a line breaks with `\n`. They will not be displayed correctly in the Logic Apps Designer and have to be added in the code view.
::

Thats it for today, have fun and be creative using the twitter connector from Logic Apps :)
