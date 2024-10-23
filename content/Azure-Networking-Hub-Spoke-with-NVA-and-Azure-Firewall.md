---
title: Azure Networking - Hub-Spoke with NVA and Azure Firewall
tags:
  - Azure
  - Networking
  - Azure Firewall
  - Virtual Network
  - Routing
  - Network Virtual Appliance
category: Azure
author: Christoph Burmeister
date: 2019-08-07 05:00:00
---

When you plan on using Azure-Firewall in your Network-Infrastructure, you have to keep some things in mind - especially when it comes to Routing. In this article, I go over a specific scenario that involves a Hub-Spoke VNet architecture, a VPN or Express Route, a Network Virtual Appliance, User Defined Routes and last but not least, the Azure Firewall.

<!-- more -->
<!-- toc -->

## The Scenario

::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/Overview.png" alt="Architecture Overview"}
::

In this scenario, we have a Hub-Spoke VNet structure. The Hub-Vnet (Core) is the central point where everything connects. Because we don’t have any capable devices, we cannot use BGP.
The Architecture itself is quite simple but the Azure Firewall in combination with an NVA makes the routing a little bit more challenging - especially with disabled BGP.

Below, you'll find the key-facts of the architecture:

### Hub-VNet (Core)

The Hub-Vnet is the central point for the network activity in Azure. It connects all involved components. It holds the VPN/Express Route (with disabled BGP), the NVA which creates a Site-to-Site (S2S) VPN to another site as well as the Azure Firewall. All traffic has to pass the Azure-Firewall (except for intra-stage traffic).

### Spoke-VNet (Stages)

All actual network clients are directly connected to a Spoke-VNet. Traffic within a stage (intra-stage traffic) is not directed to the Azure-Firewall. Traffic among stages (Dev and Prod) is not allowed, only the Shared-stage can reach everything.

### Routing

The routing within stages shall not pass the Azure-Firewall, the routing among stages has pass the Azure-Firewall and traffic directed to the Internet also has to pass the Azure-Firewall

### Azure-Firewall
The Azure-Firewall filters traffic among stages as well as inbound traffic from on-premises.

### Network Virtual Appliance (NVA)
The NVA adds a second security layer to the architecture.

In this post I will focus on the Azure-Firewall portion - particularly the Routing that comes with it when we don't use BGP.

## Routing

If you are not familiar with Routing in Azure VNets, I recommend to read this [MS Docs Article](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview) first.

::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/Overview_Detail.png" alt="Detailed View"}
::

The image above shows a more detailed view with the On-Premises part, as well as the Hub-VNet (Core) and one stage (Dev) set up as the Spoke-VNets.

The Dev-Stage has the network range 10.1.20.0/23. I did split this up into two /24 VNets.

### Peering
#### Cross VNet-Peering

All VNets of a Stage are cross-peered, this ensures the fastest routing since only one hop is taken. If we would have ten VNets in Dev, each would be peered with each other.

The Cross VNet-Peering settings are listed below:

| Peering-Name  | Configure virtual network access settings | Configure forwarded traffic settings | Allow Gateway Transit | Use Remote Gateway |
|---|---|---|---|---|
| Dev1-Dev2  | enabled | disabled | disabled | disabled  |
| Dev2-Dev1  | enabled | disabled | disabled | disabled  |

*Configure virtual network access settings*
Enabled - grants access the peered VNet.

*Configure forwarded traffic settings*
Disabled - not necessary - traffic only originates in the peered VNet.

*Allow Gateway Transit*
Disabled - not necessary - no Azure Gateway involved.

*Use Remote Gateway*
Disabled - not necessary - no Azure Remote Gateway involved.

Below is a traceroute from Az1 (10.0.21.25) to Az2 (10.1.21.25).

```
traceroute to 10.1.21.25 (10.1.21.25), 30 hops max, 60 byte packets
 1  10.1.21.25 (10.1.21.25)  2.323 ms !X  2.213 ms !X  2.131 ms !X
```

#### Hub-Spoke-Peering

Each VNet of a Stage is also peered to the Hub-Vnet. This allows the Spoke-VNets to use the Remote-Gateway to access On-Premises resources and it forces all traffic with a destination outside of the current stage to go through the Azure Firewall.

The Hub-Spoke Peering settings are listed below:

| Peering-Name  | Configure virtual network access settings | Configure forwarded traffic settings | Allow Gateway Transit | Use Remote Gateway |
|---|---|---|---|---|
| Dev1-Hub  | enabled | enabled | disabled | enabled  |
| Hub-Dev1  | enabled | disabled | enabled | disabled  |
| Dev2-Hub  | enabled | enabled | disabled | enabled  |
| Hub-Dev2  | enabled | disabled | enabled | disabled  |

With this done, all peerings are ready. Now we have one big Routing-Domain that contains all VNets.
We now have to change some Routes to ensure the traffic always goes through the Azure-Firewall.

### Network Virtual Appliance
For now, I will not go into detail of the configuration of the NVA, we just assume it's setup properly and the Routing in configured for both ways.

### User Defined Routes

UDRs enable us to overwrite system routes. In this case, we need to create a UDR for the following Subnets:

* NVA Subnet
* Azure Firewall Subnet
* one for each stage (all subnets have the some one)

#### NVA UDR

::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/nva_udr.png" alt="NVA Subnet UDR"}
::

You may ask, why don't we just add the entire range (10.1.20.0/23) of the Dev-stage to the route insted of adding each VNet individually - the answer is the algorithm Azure uses to determine the route to take. The [*longest prefix match algorithm*](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#how-azure-selects-a-route).

Since all Spoke-VNets are peered, the routing table alrady contains a route to our target, but we want the entire traffic to pass the Azure-Firewall. If we would add the entire range 10.1.20.0/23, the VNet-peering would still match first because it has precedence over the user defined route due to the longest prefix. To overwrite this, we have to add the range of each Spoke-VNet individually, to have at least the same prefix length.

#### Spoke-VNet UDR
::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/spoke_udr.png" alt="Spoke Subnet UDR"}
::

This UDR sets the Azure Firewall as default route. As the implicit learned VNET peering routes have a longer prefix, the traffic between Dev 1 and Dev 2 still flows directly. This avoids unnecessary costs on the Azure Firewall, as well as peering traffic costs.

#### Firewall UDR
::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/fw_udr.png" alt="Firewall Subnet UDR"}
::

The UDR added to the AzureFirewallSubnet contains all Routes that need to be forwarded to the NVA. In this case one on-premises network that is available over the S2S VPN, established on the NVA.
The ip-ranges, needed to route traffic between stages, are learned implicitly from the peerings.

## Azure Firewall

For now, lets just set the Azure-Firewall to allow basic traffic without much restrictions.

::blogImage{src="posts/azure-networking-hub-spoke-with-nva-and-azure-firewall/fw_any-any.png" alt="basic Firewall ruleset"}
::

```
 ...
 PING 10.1.21.25 (10.1.21.25) 56(84) bytes of data.
 64 bytes from 10.1.21.25: icmp_seq=1 ttl=120 time=11.0 ms
 64 bytes from 10.1.21.25: icmp_seq=1 ttl=120 time=10.9 ms
 64 bytes from 10.1.21.25: icmp_seq=1 ttl=120 time=11.4 ms
 64 bytes from 10.1.21.25: icmp_seq=1 ttl=120 time=10.2 ms
 ...
```

In the next post we will take a look at the code needed to deploy this in your own subscription. Then you can play around and change this to your desired design.
