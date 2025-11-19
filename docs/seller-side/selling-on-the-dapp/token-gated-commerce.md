---
layout: page
title: Token Gated Commerce
description: >-
  Web3 unlocks new capabilities in commerce, of which token-gating is one of the
  most exciting ones.
parent: Selling on the dApp
nav_order: 5
---

# Token-gated Commerce

### Selling token-gated products <a href="#selling-token-gated-products" id="selling-token-gated-products"></a>

Token gated offers are an optional feature that can make your offer exclusive to certain audience. It allows purchasing your product only to those users that hold a specific token (a "gate"). For example, you may want to unlock the gate to your product only to people who hold $BOSON or to the one person that owns a particular NFT. This is known as token gating.

> Please note that the gating currently only supports tokens on Polygon MATIC network.

The token you select to act as a gate can be any fungible [ERC-20 token](https://eips.ethereum.org/EIPS/eip-20), or non-fungible tokens compliant with [ERC-721](https://eips.ethereum.org/EIPS/eip-721) and [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) standards. If you are not sure which one to pick, please click on the links to read more about them. All have three required fields:

1. **Token address**, that is the address of the token's smart contract (on Polygon MATIC)
2. **Minimum token balance**, the number of tokens that the buyer will have to have; must be greater than 0 (for ERC721 specifics see bellow)
3. **Unlocks per wallet**, how many times will the gate be unlocked for a specific buyer; must be greater than 0

ERC721 token type can be used in two ways. You can gate it at contract level to a **Collection balance**, where you set the minimum balance threshold; or you can get it to a **Specific token** ID, in which case you set the exact token ID from the NFT contract that the buyer must have.

ERC1155 token type requires an exact **Token ID** to be specified, along with other required fields, as it is a more complex token contract.

![Token gated offer](./assets/seller-create-product/seller-create-product-7gating.png)

### Buying token-gated products <a href="#buying-token-gated-products" id="buying-token-gated-products"></a>

When a product is locked behind a gate, a "lock" icon is displayed over the image, making it easy to see which products are exclusive offers.

![Token gated product](./assets/seller-create-product/seller-create-product-7gating-tile.png)

On the product detail page, more information about the gate is presented, such as the amount of tokens needed and the address of the token contract. If the buyer doesn't have the required token balance and/or ID to unlock the product, purchasing is not possible and this is actually enforced on-chain!

![Token gated product details](./assets/seller-create-product/seller-create-product-7gating-details.png)
