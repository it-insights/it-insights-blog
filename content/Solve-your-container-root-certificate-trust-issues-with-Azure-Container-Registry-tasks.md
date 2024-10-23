---
title:
  Solve your container root certificate trust issues with Azure Container
  Registry tasks
tags:
  - Azure
  - ACR
  - Azure Container Registry
  - AKS
  - Container
  - Image
  - Container Image
  - ACI
  - Azure Container Instance
  - Azure Kubernetes Service
  - Kubernetes
  - MVP
category:
  - Azure
  - Azure Container Registry
author: Jan-Henrik Damaschke

date: 2021-09-10 14:00:00
---

When working with internal container deployments, there are many cases, where applications need to access an internal HTTPS service. If these services use internal certificates from an internal certificate authority (CA), the client (container/pod) needs to trust the certificate chain including the Sub/Issuing CA certificate and the Root CA certificate.
These certificates have to be added to the trusted ROOT CA store, which should not be done at runtime (hence not with a sidecar container or similar constructs). The solution to this problem would be to add them at build time. We will discover how this process can be simplified and automated by using Azure Container Registry (ACR) tasks.

<!-- more -->

<!-- toc -->

When using public images or images from third-parties that you don't want to or cannot build yourself, the easiest way to add the certificates is with a Dockerfile that just references the base image and adds the certificates.

In our example we have a

- Private GitHub repository for the Dockerfile(s) and the certificates (called "acr-repo")
- Private GitHub registry to pull images from (our example image is called "YourApp")
- Azure Container Registry (called "testacr") as a source for all Azure Kubernetes Service (AKS) and Azure Container Instance (ACI) deployments

## GitHub repository

The GitHub repository stores the Dockerfile and the certificates we want to use in our pods. In our case, we have ssl certificates that were issues by the Issuing CA, which means that there is a Root CA that we need to trust as well. Therefore we have a Issuing CA certificate called `issuing-ca.crt` and a Root CA certificate called `root-ca.crt` .
Our image needs to trust these, which we can achieve by copying them and executing update-ca-certificates:

```docker
FROM ghcr.io/visorian/YourApp:latest
COPY issuing-ca.crt /usr/local/share/ca-certificates/issuing-ca.crt
COPY root-ca.crt /usr/local/share/ca-certificates/root-ca.crt
RUN chmod 644 /usr/local/share/ca-certificates/issuing-ca.crt \
 && chmod 644 /usr/local/share/ca-certificates/root-ca.crt \
 && update-ca-certificates
```

## GitHub registry

The private GitHub registry stores some prebuild images we want to use/import in our ACR. Image these as coming from a third-party provider or another team, where you don't have access to the source files.

## ACR tasks

ACR tasks provide image building capabilities for Linux, Windows and ARM and can be used to automate recurring tasks like [OS and framework patching](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview#automate-os-and-framework-patching)
The first step for us is to create a build task that imports our image, pulls our GitHub repository as context and build a new image with the references base image and our Dockerfile. We are using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/) to interact with our ACR.

```
az acr task create --registry testacr --name YourApp --image YourApp:latest --context https://github.com/itpropro/acr-repo.git#main --file Dockerfile-YourApp
```

To disable commit and base image trigger use the `--commit-trigger-enabled false` or `--base-image-trigger-enabled false` parameter.

To make it time triggered, use `--schedule "0 * * * *"`.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
If you just use `acr-repo.git` the acr task tries to use the master branch not main. As the GitHub default branch is main, add `#main` to the end of your context url.
::

## Authentication

Authentication is relevant at multiple levels. While all repositories and registries can be public, in our example, the GitHub repository as well as the GitHub registry is private. This means we have to issue a Personal Access Token (PAT) on our target platform and use it in the task command.

### Context authentication

The context repository, which stores the Dockerfile and the certificates is checked when you send the command, which means that the context url and the access token has to be valid.

#### GitHub

First, [create a PAT](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) in your personal settings in GitHub.
If your context repository is private, you have to add the `--git-access-token` parameter. As we are using GitHub, in our case it will look like this `--git-access-token ghp_abc123`

#### Azure DevOps

For those of you that have not migrated to GitHub, yet, there are some things to bear in mind when using Azure DevOps for the context repository.
As with GitHub, you have to create a PAT first.

1. There is nothing on the Microsoft docs regarding Azure DevOps as context repo
2. All docs examples use .git at the end of the url, which is required for GitHub, but doesn't work for Azure DevOps
3. You have to remove the `ORGNAME@` at the start of your clone url, otherwise the `az acr create/update` command will throw a `Operation returned an invalid status 'Not Found'` error.

For example, if the clone url you get from Azure DevOps looks like this `https://ORGNAME@dev.azure.com/ORGNAME/YourApp/_git/YourApp`, the acr task command should look like this `az acr task create --registry testacr --name YourApp --image YourApp:latest --context https://dev.azure.com/ORGNAME/YourApp/_git/YourApp --file Dockerfile-YourApp --git-access-token PAT`

### Base image authentication

The base image registry, referenced in the Dockerfile (`FROM ghcr.io/visorian/YourApp:latest`) is not public as well. To add authentication information for the base image(s) which are pulled by the acr, you can add credentials to the task. With the GitHub registry, our command looks like this:

```
az acr task credential add --name YourApp --registry testacr --login-server ghcr.io -u GITHUB_USERNAME -p ghp_abc123
```

## Run task

To run a task manually, use `az acr task run --name YourApp --registry testacr`:

```
Queued a run with ID: dnf
Waiting for an agent...
2021/09/09 13:45:25 Downloading source code...
2021/09/09 13:45:27 Finished downloading source code
2021/09/09 13:45:29 Logging in to registry: testacr.azurecr.io
2021/09/09 13:45:30 Successfully logged into testacr.azurecr.io
...
Step 1/4 : FROM ghcr.io/visorian/YourApp:latest
Step 2/4 : COPY issuing-ca.crt /usr/local/share/ca-certificates/issuing-ca.crt
Step 3/4 : COPY root-ca.crt /usr/local/share/ca-certificates/root-ca.crt
Step 4/4 : RUN chmod 644 /usr/local/share/ca-certificates/issuing-ca.crt
  && chmod 644 /usr/local/share/ca-certificates/root-ca.crt
  && update-ca-certificates
Successfully built b9584ef8f454
...
```

## Optional cleanup

If you update the same tag, like `latest`, you will find that with each build, the manifest files start piling up. There are two methods to automatically remove these untagged manifest files.

### Retention policy

First option retention policy use `az acr config retention update --registry testacr --status enabled --days 0 --type UntaggedManifests` to immediately remove untagged manifests.

```
{
  "days": 0,
  "lastUpdatedTime": "2021-09-09T14:16:30.728798+00:00",
  "status": "enabled"
}
```

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
ACR premium plan is requried to use the retention feature
::

### ACR purge command

The `acr purge` command is currently in preview and not built-in, but distributed as a container image. To use is, you can either directly trigger is with `az acr run --cmd {YOUR_PURGE_COMMANDS} --registry testacr /dev/null`, where `/dev/null` refers to the source location.
You can also create a scheduled task, as mentioned in the build part:

```
az acr task create --name purgeTask --cmd {YOUR_PURGE_COMMANDS} --schedule "0 * * * *" --registry testacr --context /dev/null
```

An example purge command that removes all tags and untagged manifests for a specific image could look like this:

```
acr purge --filter 'YourApp:.*' --untagged --ago 0d"
```

`0d` refers to the minimum age of tags/manifests, in this case age 0, meaning all.
`--untagged` refers to deleting untagged manifests.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Currently the `acr purge` command can only delete tags and manifests, not the manifests only. This means that all tags and manifests targeted by the filter will be deleted by this command.
There is an open GitHub issue, where you can discuss this or request to have the feature for **only** deleting untagged manifests added: [Purge behavior differs from documentation (github.com)](https://github.com/Azure/acr-cli/issues/64).
::

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Always use the `--dry-run` command to verify if the correct set of tags and manifests will be deleted, as images deleted by purge are unrecoverable.
::

More information: [Azure/acr-cli (github.com)](https://github.com/Azure/acr-cli#purge-command)

Happy image building!
