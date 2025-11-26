---
layout: page
title: Buyer Side
description: Explore the new buyer's experience in Boson dApp
nav_enabled: true
redirect_from: /readme/
parent: Quick Start
nav_order: 1
---

# Buyer side

### Commit & Redeem | Buyer Experience on bosonapp.io <a href="#commit--redeem--buyer-experience-on-bosonappio" id="commit--redeem--buyer-experience-on-bosonappio"></a>

Buying products from Boson marketplaces allows you to buy physical or phygital items in an entirely Web3-native way.

Boson Protocol's settlement layer secures the commercial exchange of on-chain value for real-world assets. You can be certain that when redeeming you will either receive the physical good or your money back.

The Boson Protocol dApp is currently deployed to Polygon MATIC network, so you need to have enough currency tokens to purchase items on this network. It is easy to move tokens between networks, called bridging. You can learn more about bridging [on Polygon support page](https://support.polygon.technology/support/solutions/articles/82000889432-how-can-i-deposit-my-funds-from-ethereum-to-polygon-using-bridge-).

### Searching for items <a href="#searching-for-items" id="searching-for-items"></a>

Browse available products by clicking the Explore Products link in the navigation bar. You can search for keywords in the listing, filter by seller and sort by price or other conditions.

![Connect](/interface/assets/buyer_1.png)

### Step 1 - Buying an item by committing to it <a href="#step-1---buying-an-item-by-committing-to-it" id="step-1---buying-an-item-by-committing-to-it"></a>

Once you have found the item you want, you can buy it by clicking on the `Commit` button. Remember this is the first step of the buyer's experience - when committing, you pay for the item by transferring the item price into escrow and in turn receive a redeemable NFT (rNFT) that can later be exchanged for the real-world item it represents.

![Commit](/interface/assets/buyer-1commit.png)

Next, you will see the confirmation screen and options to either view your item (and immediately redeem it if you want) or discover more items.

Note that if the item is token-gated, you will need to unlock that gate by owning required token. Read more about token gating [here](https://docs.bosonprotocol.io/docs/quick_start/seller_side/seller_tutorial/token_gated_commerce/#buying-token-gated-products).

#### Connecting your wallet <a href="#connecting-your-wallet" id="connecting-your-wallet"></a>

If not done before, now is the time to connect your wallet to the dApp. Read the message when connecting and allow your wallet to switch to the correct Polygon network before proceeding.

![Commit](/interface/assets/buyer_2.jpg)

After Commit, you can now simply hold the rNFT and store it as a claim on the physical item, you can transfer it to someone else, perhaps as a gif, or you can trade your rNFT on the secondary market, such as OpenSea.

### Step 2 - Redeeming an rNFT <a href="#step-2---redeeming-an-rnft" id="step-2---redeeming-an-rnft"></a>

The product listing displays a redemption period during which your rNFT is valid and can be exchanged for the asset it represents. During this time you are also free to trade, sell or gift the rNFT. Note that if you do not redeem your item within this time, the seller will no longer be obliged to the exchange and you will incur buyer penalty set initially in the offer agreement.

When you are ready to take possession of the physical (or phygital) item, go back to the dApp to redeem your rNFT. The rNFT will be burned in the process.

![Redeem](/interface/assets/buyer-2redeem.png)

When you click `Redeem`, you will see an overlay detailing the fair exchange policy before you can click `Next` to proceed.

![Initialise XMTP](/interface/assets/buyer_5.png)

> Alternatively, you can `Cancel` the purchase, which means that you will receive the refund, deducted by the potential buyer penalty set by the seller. You can also `Contact seller` directly, through the communication channel that seller prepared, e.g. via an encrypted XMTP chat session.

You need to enter your address in order to redeem your purchase. Unlike when you buy something on a Web 2.0 commerce site, your address is not stored in a centralized database. Instead, you are sharing your details only with the seller of the item you have purchased.

![Address confirmation](/interface/assets/buyer_6.png)

In order to facilitate sharing your address with the seller, you need to initialize a chat session with XMTP, which is a Web3 communication tool. Click the Initialize button in the overlay and you will be prompted to sign a transaction in your wallet to indicate that you are happy to communicate via XMTP.

![Address confirmation](/interface/assets/buyer_7.png)

The next screen is a confirmation screen to ensure you are happy with how you have entered your address and to tell you that you have initialized your chat client.

You will again see a warning message that your rNFT will be burned on redemption.

![Redemption warning](/interface/assets/buyer_9.png)

Once you are happy with all of this, confirm the transaction in your wallet and the redemption step is complete.

Finally, you will be shown the confirmation overlay letting you know that your redemption is complete.

![Redemption confirmed](/interface/assets/buyer_10.png)

You will notice that the item you have purchased now no longer has the Redeem option available. If you need to contact the seller or raise a dispute, you can do so via the item page, which you will find in My Items, with a 'Redeemed' tag showing.

![Redemption confirmed](/interface/assets/buyer_11.png)
