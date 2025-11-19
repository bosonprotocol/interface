---
layout: page
title: Metaverse Toolkit
parent: Widgets
nav_order: 2
---

# Metaverse toolkit

### Introduction <a href="#introduction" id="introduction"></a>

This quick start guide will help you use the first instance of the [Boson Metaverse Toolkit](https://github.com/bosonprotocol/boson-dcl), the Boson Decentraland (DCL) Widget, to allow your customers to purchase items from within the [Decentraland Metaverse](https://decentraland.org/).

It should be noted that the Boson DCL Widget is a client-side only widget which has no dependency on any backend built or hosted by the Boson Protocol team. The Boson DCL SDK uses metatransactions to send transaction through to Polygon, as the protocol is currently only deployed there and in order to deploy this to production as a scene builder you will need to create a [Biconomy](https://biconomy.io/) account to relay the metatransactions and you will need to provide a RPC endpoint so that the Widget can read state from Polygon. For convenience we have provided two pre-configured test environments so that you can get up and running without the need to create any third-party accounts.

The Boson DCL SDK is an [open-source library](https://github.com/bosonprotocol/boson-dcl/blob/main/LICENSE) for putting the Commit functionality of Boson Protocol into your DCL scene. In terms of understanding what the Boson DCL SDK includes, it comprises of two parts:

1.  A Commit Widget (aka the `library`) - Scene developers can choose to instantiate an instance of the Commit Widget from any in-scene action. For example, as a scene developer you might be selling clothes, and in order to buy one, you might want a DCL avatar to walk into a changing booth, or to complete a quest, in order to be able to purchase one of your items. In short, the Commit Widget can be invoked by attaching it to any in game event. Please find below a screen of a Commit Widget, which can be found live in DCL in the [Boson Protocol land](https://play.decentraland.org/?position=-86%2C108).&#x20;

    <figure><img src="/interface/assets/dcl_widget.png" alt=""><figcaption></figcaption></figure>
2.  A Boson Kiosk (example 3D element) - The Boson Kiosk is an in-scene 3D model of a Kiosk that is deployed directly into a DCL scene. The Kiosk is there for people who wish to display their offers without handcrafting their own visual display. The Kiosk will either render one of the Images uploaded to a given Offer, or optionally a scene developer can provide a 3D model of an item to be displayed. There is an example [3D model of a t-shirt provided in the repo, in the scene folder](https://github.com/bosonprotocol/boson-dcl/blob/main/scene/models/OGShirt.glb).&#x20;

    <figure><img src="/interface/assets/dcl_kiosk.png" alt=""><figcaption></figcaption></figure>

### Deploying your Kiosk to Decentraland <a href="#deploying-your-kiosk-to-decentraland" id="deploying-your-kiosk-to-decentraland"></a>

The guide aims to help you get started selling in Decentraland. This will involve you, the Seller, creating your own custom storefront on the web, listing a product in the protocol, calling out specifically that the item MUST be redeemed back at your custom storefront, and then ultimately showing you how to place one of the Kiosks in the Metaverse using the SDK.

From a buyer’s perspective Buyers will be committing to (purchasing) one of your redeemable NFTs from within DCL, by purchasing your offer through a Boson Kiosk, buyers can then either chose to sell their rNFT on a secondary market (any buyer’s NFT marketplace of choice) or they visit your custom storefront to redeem the item which they have committed to.

We will help you get up and running by walking you through the following steps:

1. You will need to start off by [creating your Seller Profile from within the dapp](https://docs.bosonprotocol.io/docs/quick_start/seller_tutorial/profile_creation).
2. Then you can [create your own Custom Storefront on the Boson dApp](https://docs.bosonprotocol.io/docs/quick_start/seller_tutorial/create_a_storefront). _Note that_ this is an optional step, you can always allow your buyers to redeem directly on the [Boson dApp](https://bosonapp.io/),
3. And then you will need to list your offer in the Boson Protocol, the easiest way to do this is [using the Boson dApp](https://docs.bosonprotocol.io/docs/quick_start/seller_tutorial/seller_list).
4. Finally, you will need to install the Boson DCL SDK and deploy it to your scene in DCL, [detailed instructions on how to do this can be found in Boson DCL SDK source repository](https://github.com/bosonprotocol/boson-dcl/blob/main/library/README.md).

If you have any questions or feedback on how to deploy a Boson Kiosk please do ask the [Boson Protocol Discord channel](https://discord.com/invite/5dRV7fWet2) or feel free to create a [Github Issue directly in the repo](https://github.com/bosonprotocol/boson-dcl/issues/new).

_Happy Metaverse Building!_
