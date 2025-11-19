---
layout: page
title: Overview
parent: The Commit Button Widget
nav_order: 1
---

# Overview

### Integrating 'Commit' functionality using the Boson Commit button <a href="#integrating-commit-functionality-using-the-boson-commit-button" id="integrating-commit-functionality-using-the-boson-commit-button"></a>

With the Boson Commit button, sellers can allow their buyers to commit to a Boson offer on their own domains.&#x20;

<div align="left"><figure><img src="./assets/commit-button.png" alt=""><figcaption></figcaption></figure></div>

Clicking on the button as shown above displays the Commit widget. &#x20;

<figure><img src="./assets/commit-widget-overall.png" alt=""><figcaption></figcaption></figure>

The Commit widget allows buyers to:

* show details about the specified product
* connect their Web3 wallet
* commit to the product (after they have connected their wallet and have enough funds)

If they click on the "What is a physical NFT?", customers will see a purchase overview:&#x20;

<figure><img src="./assets/purchase-overview.png" alt=""><figcaption></figcaption></figure>

### How to integrate the Boson Commit button? <a href="#how-to-integrate-the-boson-commit-button" id="how-to-integrate-the-boson-commit-button"></a>

To integrate the Boson Commit button, all a seller needs to do is:

1. Add the following `<script>` entries, either in `<head>` or `<body>` of their website:

```html
<script type="text/javascript" src="https://widgets.bosonprotocol.io/scripts/zoid/zoid.min.js"></script>
<script type="text/javascript" src="https://widgets.bosonprotocol.io/scripts/commit-button.js"></script>
```

2. Add following code wherever you want to display the commit button:

```html
<div id="container"></div>

<script>
  const instance = CommitButton({
    configId: "testing-80002-0",
    context: "iframe",
    productUuid: "086b32-3fcd-00d1-0624-67513e85415c",
    sellerId: "138",
    modalMargin: "2%",
    lookAndFeel: "modal",
    disabled: false,
    buttonStyle: {
      minWidth: "100px",
      minHeight: "100px",
      shape: "rounded",
      color: "white"
    },
    onGetDimensions: function (dimensions) {
      const { offsetHeight, offsetWidth } = dimensions;
      document.querySelector(
        "#container"
      ).style.height = `${offsetHeight}px`;
      document.querySelector(
        "#container"
      ).style.minWidth = `${offsetWidth}px`;
    }
  });

  instance.render("#container");
</script>
```

You can also update properties dynamically with `updateProps(updatedPropertiesObject)`:

```html
<script>
    let disabled = false;
    const instance = CommitButton({
      /* ... */
      disabled,
    });
    
    instance.render("#container");
    function toggleDisableState() {
      disabled = !disabled;
      instance.updateProps({ disabled });
    }
  </script>

<button onclick="toggleDisableState()" style="margin: 20px;">toggle disable state</button>
```

The Commit button has been created with [zoid](https://github.com/krakenjs/zoid/tree/main) so you can use their drivers to have [components in your favorite framework](https://github.com/krakenjs/zoid/blob/main/docs/api/component.md#react).

### Commit Widget Parameters <a href="#commit-widget-parameters" id="commit-widget-parameters"></a>

The following parameters configure the widget and the button. They must be passed as properties of the CommitButton call. For instance:

```html
<script>
const instance = CommitButton({
  configId: "testing-80002-0",
  context: "iframe",
  productUuid: "086b32-3fcd-00d1-0624-67513e85415c",
  sellerId: "138",
  modalMargin: "2%",
  lookAndFeel: "modal",
  disabled: false,
  buttonStyle: {
    minWidth: "100px",
    minHeight: "200px",
    shape: "rounded",
    color: "white"
  },
  containerStyle: {
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  onGetDimensions: function (dimensions) {
    const { offsetHeight, offsetWidth } = dimensions;
    document.querySelector(
      "#container"
    ).style.height = `${offsetHeight}px`;
    document.querySelector(
      "#container"
    ).style.minWidth = `${offsetWidth}px`;
  },
  onClickCommitButton: function () {
    document.querySelector("body").style.overflow = "hidden";
    console.log("you clicked on the commit button!");
  },
  onClickTagline: function () {
    console.log("you clicked on the tagline!");
  },
  onCloseCommitButton: function () {
    console.log("commit button widget was closed!");
  },
  onCloseTagline: function () {
    console.log("purchase overview widget was closed!");
  }
});
</script>
```

<table><thead><tr><th>Parameter</th><th>Required</th><th>Default Value</th><th>Purpose</th><th valign="top">Example</th></tr></thead><tbody><tr><td>configId</td><td>yes</td><td>none</td><td>the Boson Protocol environment the widget is linked to (see <a href="https://github.com/bosonprotocol/widgets/blob/main/docs/boson-environments.md">Boson Environments</a>)</td><td valign="top"><code>"production-137-0"</code></td></tr><tr><td>sellerId</td><td>When offerId is not used</td><td>none</td><td>specifies the Boson Seller ID that publishes the Product being offered with the plugin.</td><td valign="top"><code>"2"</code></td></tr><tr><td>productUuid</td><td>When offerId or bundleUuid are not used</td><td>none</td><td>specifies the ProductUUID of the Product being offered with the plugin.</td><td valign="top"><code>"2540b-1cf7-26e7-ddaf-4de1dcf7ebc"</code></td></tr><tr><td>bundleUuid</td><td>When offerId or productUuid are not used</td><td>none</td><td>specifies the BundleUUID of a Phygital Offer being offered with the plugin.</td><td valign="top"><code>"4d5262-28cf-d860-06f-6406bd65fa10"</code></td></tr><tr><td>offerId</td><td>When sellerId/productUuid or sellerId/bundleUuid are not used</td><td>none</td><td>specifies the ID of the Offer being offered with the plugin. Note: an offer ID is the low-level identification of the Boson Offer on-chain, while a Product can match several offers, like several variants (size, color, ...)).</td><td valign="top"><code>"1099"</code></td></tr><tr><td>account</td><td>none</td><td>the address of the wallet the widget should accept. When specified, the user can't connect any other wallet that the one specified. This parameter is optional and can be used if you want to prevent the user to use the Commit Widget if they don't connect with the given wallet.</td><td><code>"0x023456789abcd0213456789abcd213456789abcd"</code></td><td valign="top"></td></tr><tr><td>context</td><td>no</td><td><code>"iframe"</code></td><td>the way the widget and the purchase overview open: <code>"iframe"</code> to see them in the same window or <code>"popup"</code> to open them in a new window.</td><td valign="top"><code>"popup"</code></td></tr><tr><td>lookAndFeel</td><td>no</td><td><code>"modal"</code></td><td>the look and feel for the widget (<code>"regular"</code> or <code>"modal"</code>). When set to <code>"modal"</code>, allow to define a margin around the widget to be appearing like a modal popup.</td><td valign="top"><code>"modal"</code></td></tr><tr><td>modalMargin</td><td>no</td><td>"2%"</td><td>the margin to apply around the widget when lookAndFeel is set to <code>"modal"</code></td><td valign="top"><code>"5%"</code></td></tr><tr><td>buttonStyle</td><td>no</td><td>none</td><td>the allowed styles of the commit button</td><td valign="top"><code>{ minWidth: "100px", minHeight: "200px", shape: "rounded", color: "white"}</code></td></tr><tr><td>buttonStyle.minWidth</td><td>no</td><td>none</td><td>the commit button min width</td><td valign="top"><code>"100px"</code></td></tr><tr><td>buttonStyle.minHeight</td><td>no</td><td>none</td><td>the commit button min height</td><td valign="top"><code>"200px"</code></td></tr><tr><td>buttonStyle.shape</td><td>no</td><td>"sharp"</td><td>the commit button shape: <code>"sharp"</code>,<code>"rounded"</code> or <code>"pill"</code></td><td valign="top"><code>"rounded"</code></td></tr><tr><td>buttonStyle.color</td><td>no</td><td>"green"</td><td>the commit button color: <code>"green"</code>,<code>"black"</code> or <code>"white"</code></td><td valign="top"><code>"white"</code></td></tr><tr><td>onGetDimensions</td><td>no</td><td>none</td><td>the callback that is called with the actual dimensions of the commit button in its iframe</td><td valign="top"><code>onGetDimensions: ({offsetHeight, offsetWidth, boundingClientRect}) => console.log({offsetHeight, offsetWidth, boundingClientRect})</code></td></tr><tr><td>onClickCommitButton</td><td>no</td><td>none</td><td>the callback that is called after clicking on the commit button and just after the commit widget is called to be opened</td><td valign="top"><code>onClickCommitButton: () => console.log("you clicked on the commit button!")</code></td></tr><tr><td>onClickTagline</td><td>no</td><td>none</td><td>the callback that is called after clicking on the tagline and just after the purchase overview widget is called to be opened</td><td valign="top"><code>onClickTagline: () => console.log("you clicked on the tagline!")</code></td></tr><tr><td>onCloseCommitButton</td><td>no</td><td>none</td><td>the callback that is called when the commit widget is closed</td><td valign="top"><code>onCloseCommitButton: () => console.log("commit button widget was closed!")</code></td></tr><tr><td>onCloseTagline</td><td>no</td><td>none</td><td>the callback that is called when the purchase overview widget is closed</td><td valign="top"><code>onCloseTagline: () => console.log("purchase overview widget was closed!")</code></td></tr><tr><td>containerStyle.justifyContent</td><td>no</td><td>none</td><td>the commit button container justify-content</td><td valign="top"><code>center</code></td></tr><tr><td>containerStyle.alignItems</td><td>no</td><td>none</td><td>the commit button container align-items</td><td valign="top"><code>flex-end</code></td></tr></tbody></table>

### Discover more... <a href="#discover-more" id="discover-more"></a>

The Commit Widget is part of the React Component library from Boson Core Component you can discover on this [Storybook page](https://main--65f314a856a256708dd840ea.chromatic.com/?path=/story/widgets-commit--commit). Also, you can play around with the Commit button itself [Storybook page](https://main--65f314a856a256708dd840ea.chromatic.com/?path=/story/visual-components-buttons-commitbutton--base).

You can find an example HTML file which embeds the commit button on the the widgets subdomain: [https://widgets.bosonprotocol.io/scripts/commit-button-example.html](https://widgets.bosonprotocol.io/scripts/commit-button-example.html)
