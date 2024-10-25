---
title: HashiCorp Vault - Raft Storage Snapshot Recovery
tags:
  - HashiCorp
  - Recovery
  - Disaster
  - Raft
  - Backup
  - DevOps
category: DevOps
author: Ingo Deissenroth
date: 2020-11-26 12:00:00
---

HashiCorp introcuded with Vault version 1.2 a new integrated Storage backend. It went into general availability with version 1.4 in April 2020. In November HashiCorp released Vault version 1.6 which includes further enhancements of the Raft storage backend. I took this opportunity to show how to create and restore Raft storage backend snapshots and share this with the community.

<!-- more -->
<!-- toc -->

## Introduction

The integrated storage backend of HashiCorp Vault is based on the Raft Consensus Algorithm. Since this post aims to provide practical technical guidance on recovering HashiCorp Vault's storage implementation, where replication is based , im not going into the details about the Raft consensus algorithm itself. The following links may provide some insights on this topic.

- [raft.github.io](https://raft.github.io) - Official source
- [hashicorp/raft](https://github.com/hashicorp/raft) - HashiCorp Implementation

::callout{icon="i-heroicons-information-circle" color="blue"}
Some familiarity with basic HashiCorp Vault concepts are assumed.
::

For readability reasons the integrated storage backend of HashiCorp Vault will be called Raft storage in this post.

## Scenario

This scenario assumes you have two running HashiCorp Vault instance/clusters with the Raft storage backend enabled. We also assume you have sufficient permissions to perform the actions required to restore a snapshot. Our goal is to create a Raft storage Snapshot of instance A and restore it into instance B.
::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Snapshot functionality is not supported when Raft is used only for high availability storage!
::

::blogImage{src="posts/hashicorp-vault-raft-storage-snapshot-recovery/1.png" alt="Vault Raft Storage Recovery"}
::

In my case, i installed two HashiCorp Vault instances into an Azure Kubernetes Cluster using the [Vault Helm](https://github.com/hashicorp/vault-helm) chart. The values.yaml for these installations can be found [here](https://gist.github.com/rooftop90/7096dc46d0a4157d2977284e9a41a762).

- Vault Instance A - Name: vault

::blogImage{src="posts/hashicorp-vault-raft-storage-snapshot-recovery/2.png" alt="Vault Instance A; Name: vault"}
::

- Vault Instance B - Name: vault-dev

::blogImage{src="posts/hashicorp-vault-raft-storage-snapshot-recovery/3.png" alt="Vault Instance B; Name: vault-dev"}
::

Demo Secrets are written to the kv-v2 secret engine in the Vault instance A. We will demonstrate the recovery of these secrets to Vault instance B. The secrets are stored as follows:

- secret/frontent/* -> secrets that are used by a frontend application
- secret/backend/* -> secrets that are used by a backend application
- secret/environment/* -> secrets that are used for defining an environment

## Creating Raft storage snapshot

Creating a Vault Raft storage backend snapshot is very simple. All it takes is one simple command:

```bash
vault operator raft snapshot save <name-of-the-snapshot>
```

```
```

To verify the snapshot was successfully created check for the file that bears the name of the snapshot you just created. Currently we have no utility to check the validity and integrity of the created snapshot. As long as Vault doesnt throw an error during the creation of said snapshot we assume the snapshot is valid.

```bash
ls -lah <name-of-the-snapshot>
```

The tutorials and demos of the HashiCorp Vault documentation create snapshots with the following naming scheme: mysnapshot.snap. I think this is a good practice because this way it is easy to clearly identify that this file represents a snapshot. Although its not in scope of this blog post, the common practices for backup files should be applied for storing HashiCorp Vault snapshots.

## Restoring from Raft storage snapshot

Restoring a HashiCorp Vault instance from a snapshot is just as easy as creating one. In this post we will restore this snapshot into a different HashiCorp Vault instance.

```bash
vault operator raft snapshot restore <name-of-the-snapshot>
```

Since the second instance has been setup with different seal keys HashiCorp Vault will warn us:

::blogImage{src="posts/hashicorp-vault-raft-storage-snapshot-recovery/4.png" alt="HashiCorp Vault Warning Snapshot Check"}
::

We are aware of this in this scenario so we can bypass this check by using the "-force" parameter.

```bash
vault operator raft snapshot restore -force <name-of-the-snapshot>
```

In our scenario Vault will be sealed after the restore process and needs to be unsealed. The unseal keys that have to be used for this operation are the ones with which the Vault instance was setup from which we saved the snapshot.

## Validating successfull recovery

The first step of validating succesfull recovery is to unseal the Vault.

```bash
vault operator unseal <unseal key>
```

::callout{icon="i-heroicons-information-circle" color="blue"}
After the recovery has been performed, the unseal process needs the unseal keys of Vault instance A, not the ones of instance B.
::

After the Vault instance is unsealed we can login and check if KV Secret Engine secrets that were present in instance A are now also present in the other instance.

```bash
vault kv list secret
```

::blogImage{src="posts/hashicorp-vault-raft-storage-snapshot-recovery/5.png" alt="Vault Instance B Status after Recovery"}
::

All secrets that were present in instance A are now present in instance B. The recovery was successfull.

::callout{icon="i-heroicons-information-circle" color="blue"}
Recovering an instance with an earlier snapshot of the same instance doesn't require you to unseal the instance after the restore as the unseal keys are matching!
::

## Summary

This post shows how effective HashiCorp Vault Raft storage recovery really is and only shows the tip of the iceberg of what is possible with this integrated storage option. Since the introduction HashiCorp has made numerous improvements to the integrated storage backend and continues to do so with the focus on easing operational aspects of Vault.

HashiCorp Vault Enterprise customers have even more [options](https://www.hashicorp.com/products/vault/pricing) to create efficient Backup & Recovery concepts for their productive environments. The Open-Source version of HashiCorp Vault nonetheless provides enough capabilities to secure your Vault instance and archieve great reliabilty.
