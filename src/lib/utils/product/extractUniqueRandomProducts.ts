import groupBy from "lodash/groupBy";

import { ExtendedOffer } from "../../../pages/explore/WithAllOffers";

interface Props {
  products: Readonly<ExtendedOffer[]>;
  quantity: number;
}
/**
 * Returns another list of the same products sorted by first the unique sellers and then the rest
 * @param
 * @returns
 */
export default function extractUniqueRandomProducts({
  products,
  quantity
}: Props) {
  const sellerIdToProducts = groupBy(products, (p) => p.seller.id);
  const productsToReturn = [];
  const maxProductsToReturn = Math.min(products.length, quantity);
  for (
    let index = 0;
    index < quantity || productsToReturn.length < maxProductsToReturn;
    index++
  ) {
    const sellerIds = Object.keys(sellerIdToProducts);
    const sellerId = sellerIds[index % sellerIds.length];
    const sellerProducts = sellerIdToProducts[sellerId];
    if (!sellerProducts) {
      continue;
    }
    const randomSellerProductIndex = Math.floor(
      Math.random() * sellerProducts.length
    );
    const product = sellerProducts[randomSellerProductIndex]; // pick random product from the seller
    if (!product) {
      continue;
    }
    productsToReturn.push(product);

    sellerIdToProducts[sellerId] = sellerProducts.filter(
      (_, idx) => idx !== randomSellerProductIndex
    );
    if (!sellerIdToProducts[sellerId].length) {
      // delete seller if there are no more products
      delete sellerIdToProducts[sellerId];
    }
  }
  return productsToReturn;
}
