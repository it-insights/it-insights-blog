---
title: Kubernetes Ingress Nginx Custom Default Backend
author: Christoph Burmeister
draft: true
tags:
  - Azure
  - Kubernetes
  - Azure Kubernetes Services
  - AKS
  - Ingress
  - Nginx
  - Custom Backend
  - Helm
category:
  - Kubernetes
  - Azure
date: 2024-06-06 05:45:00
---

Nginx is the most commonly used ingress controller for Kubernetes. If you want to configure your ingress controller to respond with customized html or perhaps even json reponses, keep reading!

<!-- more -->
<!-- toc -->

# Introduction

In this blog post, I will go over the steps you need to take to configure your Nginx ingress controller to use a default backend with your own responses.

# TL;DR

Head over to my [GitHub repo](https://github.com/chrburmeister/nginx-ingress-custom-backend) for the code and follow the steps in the readme-file.

# Default Backend

The term **default backend** comes is defined by the Nginx developers:

> The default backend is a service which handles all URL paths and hosts the nginx controller doesn't understand (i.e., all the requests that are not mapped with an Ingress).<br>
> Basically a default backend exposes two URLs:
> <br>/healthz that returns 200
> / that returns 404

Source: [Nginx Ingres Controller Default Backend](https://kubernetes.github.io/ingress-nginx/user-guide/default-backend).

In a nutshell, the default backend is another webserver that serves content if the ingress controller can not respont properly.
In general, its a good idea to use a default backend so you can mask the fact your are using nginx.
