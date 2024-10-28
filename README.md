## Build Status

| Stage        | Status                                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| build deploy | [![build and deploy](https://github.com/it-insights/it-insights-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/it-insights/it-insights-blog/actions/workflows/ci.yml) |

## Overview

IT Insights Blog based on Nuxt and Nuxt Content hosted on Azure Static Web Apps

### Local Development

To test the changes locally, you can use "pnpm dev" to execute them locally.

## Creation of a Blogpost

To create a new blog post, a new .md (Markdown) file must be created in the path ‘/content’.

If images, videos or other content is used for the blog post, a folder with the name of the blog post should be created for each blog post in the /posts path and the file should be saved and linked centrally in this folder

### Draft Blogpost

To create this initial as a draft so that it is not immediately live, the header "draft: true" must be set.
