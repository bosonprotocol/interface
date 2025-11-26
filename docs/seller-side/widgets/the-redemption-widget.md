---
layout: page
title: The Redemption Widget
parent: Widgets
nav_order: 4
---

# The Redemption Widget

### Redeeming rNFTs using the Boson Widget <a href="#redeeming-rnfts-using-the-boson-widget" id="redeeming-rnfts-using-the-boson-widget"></a>

With the release of the Boson Redemption Widget Sellers can now offer redemption of their rNFTs on their own domains.

Sellers can choose to sell their rNFTs everywhere in the metaverse, in game, on NFT marketplaces, or from the Boson dApp whilst bringing users back to their own domain to redeem their NFTs.

The Boson Redemption Widget allows Sellers to simply embed, via a few lines of code, redemption functionality of their rNFTs into an existing website.

![Redemption Widget steps](/interface/assets/redemption_widget_1.png)

To integrate the Boson Redemption Widget, all a seller needs to do is:

1. Add the following `<script>` entry, either in `<head>` or `<body>` of their website:

```html
<script async type="text/javascript" src="https://widgets.bosonprotocol.io/scripts/boson-widgets.js"></script>
```

2. The Seller then needs to create a button with the fragment identifier _id="boson-redeem"_. When clicked, the redeem modal will popup on the Seller's website.

```html
<button type="button" id="boson-redeem">Show Redeem</button>
```

![Redemption Widget Items View](/interface/assets/redemption_widget_2.png)

### Using the Boson Redemption Button <a href="#using-the-boson-redemption-button" id="using-the-boson-redemption-button"></a>

As a seller you can also choose to use the Boson branded "Redeem" Button on your website, if you would like to do this, all you need to do is :

1. Add the below 2 lines of code in HTML `<head>` section:

```html
 <head>
    ...
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://widgets.bosonprotocol.io/styles.css">
  </head>
```

2. Add the below class name to the "boson-redeem" button:

```html
<button type="button" id="boson-redeem" class="bosonButton">Show Redeem</button>
```

![Boson Redeem Button](/interface/assets/redeem.png)

#### Redeeming a specific rNFT <a href="#redeeming-a-specific-rnft" id="redeeming-a-specific-rnft"></a>

The Boson Widget's default behaviour is to show a buyer all of their redeemable vouchers, the widget can be configured to direct a buyer to a given rNFT for redemption, this enables different user flows. This the way that the Widget is used on [the Boson dApp](https://bosonapp.io/).

A Seller can specify which exchange is going to be redeemed by the widget, by:

1. add a _data-exchange-id_ tag to the "boson-redeem" button, specifying the exchangeId of a given exchange:

```html
<button type="button" id="boson-redeem" data-exchange-id="80">Redeem Exchange 80</button>
```

You can find an example HTML file which embeds the widgets on the widgets subdomain : [https://widgets.bosonprotocol.io/example.html](https://widgets.bosonprotocol.io/example.html)
