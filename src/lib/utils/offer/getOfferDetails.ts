/* eslint @typescript-eslint/no-explicit-any: "off" */
import {
  isBundle,
  isProductV1,
  offers,
  subgraph
} from "@bosonprotocol/react-kit";

import { Offer } from "../../types/offer";
import { getProductV1BundleItemsFilter } from "../bundle/filter";

interface ITable {
  name: string;
  value: string;
}
interface IShippingInfo {
  returnPeriodInDays: number | undefined;
  shippingTable: Array<ITable>;
}

type ProductV1ProductSeller = Pick<
  subgraph.ProductV1MetadataEntity["productV1Seller"],
  "images" | "description" | "contactLinks"
>;
type ProductV1ItemProductSeller = Pick<
  subgraph.ProductV1ItemMetadataEntity["productV1Seller"],
  "images" | "description" | "contactLinks"
>;

type ProductV1OrProductV1ItemSubProductV1Seller =
  | ProductV1ProductSeller
  | ProductV1ItemProductSeller;
interface IGetOfferDetails {
  display: boolean;
  name: string;
  offerImg: string | undefined;
  mainImage: string;
  animationUrl: string;
  shippingInfo: IShippingInfo;
  description: string;
  artist: ProductV1OrProductV1ItemSubProductV1Seller | null;
  artistDescription: string;
  images: Array<string>;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export const getOfferAnimationUrl = (
  offerMetadata: Partial<Offer["metadata"]> | undefined | null
): string => {
  return offerMetadata?.animationUrl === "about:blank"
    ? ""
    : offerMetadata?.animationUrl || "";
};

export const getOfferDetails = (
  offerMetadata: Offer["metadata"]
): IGetOfferDetails => {
  const offer = { metadata: offerMetadata };
  const productV1ItemMetadataEntity:
    | (Pick<subgraph.ProductV1MetadataEntity, "shipping"> & {
        product: Pick<
          subgraph.ProductV1MetadataEntity["product"],
          "title" | "description" | "visuals_images"
        >;
        productV1Seller: ProductV1ProductSeller;
      })
    | (Pick<subgraph.ProductV1ItemMetadataEntity, "shipping"> & {
        product: Pick<
          subgraph.ProductV1ItemMetadataEntity["product"],
          "title" | "description" | "visuals_images"
        >;
        productV1Seller?: ProductV1ItemProductSeller | null;
      })
    | undefined = isProductV1(offer)
    ? offer.metadata
    : isBundle(offer)
    ? offer.metadata?.items
      ? getProductV1BundleItemsFilter(offer.metadata.items).map(
          (productV1ItemMetadataEntity) => ({
            ...productV1ItemMetadataEntity,
            productV1Seller: productV1ItemMetadataEntity.product.productV1Seller
          })
        )[0]
      : undefined
    : undefined;
  const name =
    productV1ItemMetadataEntity?.product?.title ||
    offerMetadata?.name ||
    "Untitled";
  const offerImg = offerMetadata?.image;

  const animationUrl = getOfferAnimationUrl(offerMetadata);
  const shippingInfo = {
    returnPeriodInDays:
      productV1ItemMetadataEntity?.shipping?.returnPeriodInDays,
    shippingTable:
      productV1ItemMetadataEntity?.shipping?.supportedJurisdictions?.map(
        (jurisdiction: any) => ({
          name: jurisdiction.label,
          value: jurisdiction.deliveryTime
        })
      ) || []
  };
  const description =
    productV1ItemMetadataEntity?.product?.description ||
    offerMetadata?.description ||
    "";
  const artist = productV1ItemMetadataEntity?.productV1Seller || null;
  const artistDescription =
    productV1ItemMetadataEntity?.productV1Seller?.description || "";
  const images =
    productV1ItemMetadataEntity?.product?.visuals_images?.map(
      ({ url }: { url: string }) => url
    ) || [];
  const mainImage = offerImg || images?.[0] || "";
  return {
    display: false,
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    artist,
    artistDescription,
    images,
    mainImage
  };
};
