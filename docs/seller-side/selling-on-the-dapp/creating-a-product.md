---
layout: page
title: Creating a Product
parent: Selling on the dApp
nav_order: 4
---

# Creating a Product

### The first decentralized marketplace built on Boson Protocol allows you to tokenize, trade or transfer any physical item as an NFT <a href="#the-first-decentralized-marketplace-built-on-boson-protocol-allows-you-to-tokenize-trade-or-transfer" id="the-first-decentralized-marketplace-built-on-boson-protocol-allows-you-to-tokenize-trade-or-transfer"></a>

![Sell Physicals](/assets/seller_list1.png)

In this tutorial you will learn how to create a product and offer it for sale on the Boson decentralized application (dApp).

There are two ways to sell products: directly from your profile or from your customized storefront.

The Boson dApp has been launched on Polygon and is planned to expand to other EVM compatible networks later.

### First step - Create Products <a href="#first-step---create-products" id="first-step---create-products"></a>

By now, you should have already created a seller profile and have the wallet connected to the dApp. You don't need any MATIC in your wallet to cover transaction fees, as we are subsidizing gas through meta-transactions. You will only need to sign messages as authorization.

To continue, click on the `Create Products` button at the top right.

![Create Products](/assets/seller-create-product/seller-create-product-1button.png)

#### Select the product type <a href="#select-the-product-type" id="select-the-product-type"></a>

You will be presented to choose the type and variants of the product. The column to the right provides explanation of various options and their meaning.

![Product type](/assets/seller-create-product/seller-create-product-2type.png)

Click `Next` when you are ready to move on. For simplicity, we'll now asume that we selected a Physical and One item type.

#### Product Information screen <a href="#product-information-screen" id="product-information-screen"></a>

Describe the product to buyers using the title and description fields.

Tell them about its unique features, or why you are selling it. The goal is to tell them why they might want to buy it. As with selling on any other marketplace, you should aim to provide clear, factual information about the product, for example, the fabric composition or - if you are listing a vintage collectible - the exact condition of the item.

![Product description](/assets/seller-create-product/seller-create-product-3info.png)

Categories will be helpful to focus search results, so it’s best to select an existing category if appropriate. If it is truly unique, you can create your own category by filling in the "other" category field. Select a category using the dropdown menu.

Further down on the same screen, you will see an input field for search tags, which can be used to expose most important properties and help with finding similar products.

Attributes provide a way to organize more product details in a systematic way that buyers can easily understand.

#### Additional information <a href="#additional-information" id="additional-information"></a>

Optionally, you can provide additional information about the product that is commonly used in commerce, such as SKUs, product identifiers such as serial numbers, brand information and manufacturer model numbers.

Larger-scale merchants who have multiple items for sale will find this section invaluable for entering inventory information and other identifiers for products.

![Additional information](/assets/seller-create-product/seller-create-product-4additional.png)

Click `Next` to proceed.

#### Product Images <a href="#product-images" id="product-images"></a>

Pictures bring your product to life and improve buyer's confidence. Don’t forget to include different angles, e.g. top, bottom, front and back as well as any that highlight special features. We support the following formats: jpg, jpeg, gif, png, webp.

You can also add an MP4 video for the extra punch! Animated gifs also work.

When you are happy with your picture selection, click `Next`.

![Product Images](/assets/seller-create-product/seller-create-product-5images.png)

### Core Terms of Sale <a href="#core-terms-of-sale" id="core-terms-of-sale"></a>

This is where you specify the contractual details for the sale of the product, including the price in a specific currency, available quantity, validity period, the redemption period and any special conditions such as token gating.

You can list the price in any of the supported ERC20 tokens, or in native MATIC. Note that if you choose to list in $BOSON, there will be no fees levied! Also bear in mind that transaction fees will be denominated in $MATIC as we are using the Polygon network.

Offer validity period is the interval during which purchasing the product's rNFT is possible. When the offer period expires, buyers are no longer able to make a commitment to buy the rNFT.

The redemption period is the time during which the buyer can trade their rNFT. Generally, the longer the redemption period, the better, as this means the buyer will be able to benefit from the option to trade it on secondary markets. However, only make this period as long as you are able to deliver the underlying product.

![Core Terms of Sale](/assets/seller-create-product/seller-create-product-6coreterms.png)

#### Token gated offers <a href="#token-gated-offers" id="token-gated-offers"></a>

Please see detailed instructions on a dedicated [token-gated offers page](https://docs.bosonprotocol.io/docs/quick_start/seller_side/seller_tutorial/token_gated_commerce).

#### Fees <a href="#fees" id="fees"></a>

* The protocol fee of 0.5% is only charged on happy path exchanges, meaning the rNFT was redeemed and the exchange was finalized without a dispute. If offers are priced in $BOSON tokens, no protocol fee is charged!
* Dispute Resolution Costs - Boson Protocol ensures the trust-minimized exchange of on-chain value for off-chain assets. Dispute resolvers are called upon when an exchange is escalated (when buyer and seller can’t resolve the dispute amongst themselves). For launch, there is only one dispute resolution service available. This service is free of charge.

Click `Next` to proceed.

### Terms of Exchange <a href="#terms-of-exchange" id="terms-of-exchange"></a>

The exchange policy covers the contractual terms of the exchange to protect both the seller and the buyer. This includes the obligation of both parties to follow through with their commitment, and to evidence requirements in case there is a dispute. The policy also includes fair protocol terms, to make it easy for sellers to set up a fair exchange. Currently, one such policy is made available.

If the buyer fails to redeem the item within the redemption period, they will receive the refunded payment minus the buyer cancellation penalty. This penalty is to cover inconvenience caused to the seller.

Seller can set their own deposit requirement, which signals to potential buyers that the seller promises to deliver the product or else the buyer will additionally be compensated by this amount.

Dispute resolver is the entity that is chosen for jumping in when the seller and buyer don't agree about the (quality of) delivery. Currently, one such dispute resolver is operating.

The dispute period is a minimum of 30 days after redeeming the rNFT.

![Terms of Exchange](/assets/seller-create-product/seller-create-product-8terms-exchange.png)

Click `Next` to proceed.

#### Shipping Info <a href="#shipping-info" id="shipping-info"></a>

On this screen, define the regions you are prepared to ship to, along with the expected delivery time and acceptable return period in days.

![Shipping Info](/assets/seller-create-product/seller-create-product-9shipping.png)

You may optionally wish to add values for parcel measurements and weight, as well as a url to the redemption point (this is set by default to the Boson dApp).

![Additional information](/assets/seller-create-product/seller-create-product-90additional.png)

### Confirm Product Details <a href="#confirm-product-details" id="confirm-product-details"></a>

This is where you get the opportunity to review and confirm everything you have entered so far.

![Initializing chat client](/assets/seller-create-product/seller-create-product-91init-chat.png)

Preview your product data and terms of sale. You can move between screens using the breadcrumb menu at the top.

When you are satisfied with all the relevant details, you need to establish a communication channel with your buyers. To do that, please press `Initialize` button. We are using a great, proper web3 protocol for this, called [XMTP](https://xmtp.org/).

The first time you use XMTP with a specific wallet, you will be prompted to sign a message in your wallet that will start with a message "XMTP: Create Identity". From then on, you will only need to sign "XMTP: Enable Identity" once per session. You can read more about these messages at [XMTP docs](https://xmtp.org/docs/concepts/account-signatures). Please sign these messages so that buyers can contact you.

Remember that because this is an on-chain transaction, you will not be able to go back and edit product information later - you would have to create a new offer.

This is it! You can preview the final page by clicking the `Preview product detail page`. To finalize the process, click `Confirm`. You will be prompted by your wallet to sign the transaction.

Once the transaction is processed, a popup will appear notifying you of the created product. You can inspect its details or continue creating more.

![Overview of new product](/assets/seller-create-product/seller-create-product-92finish.png)
