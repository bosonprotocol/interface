/* eslint @typescript-eslint/no-explicit-any: "off" */
import { offers, subgraph } from "@bosonprotocol/react-kit";

import { Offer } from "./../types/offer";

interface ITable {
  name: string;
  value: string;
}
interface IShippingInfo {
  returnPeriodInDays: number | undefined;
  shippingTable: Array<ITable>;
}
interface IGetOfferDetails {
  display: boolean;
  name: string;
  offerImg: string | undefined;
  animationUrl: string;
  shippingInfo: IShippingInfo;
  description: string;
  productData: Array<ITable>;
  artist: subgraph.ProductV1Seller | null;
  artistDescription: string;
  images: Array<string>;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export const getOfferAnimationUrl = (
  offer: Offer | undefined | null
): string => {
  return offer?.metadata?.animationUrl === "about:blank"
    ? ""
    : offer?.metadata?.animationUrl || "";
};

export const getOfferDetails = (offer: Offer): IGetOfferDetails => {
  const name =
    offer.metadata?.product?.title || offer.metadata?.name || "Untitled";
  const offerImg = offer.metadata?.image;

  const animationUrl = getOfferAnimationUrl(offer);
  const shippingInfo = {
    returnPeriodInDays: offer.metadata?.shipping?.returnPeriodInDays,
    shippingTable:
      offer.metadata?.shipping?.supportedJurisdictions?.map(
        (jurisdiction: any) => ({
          name: jurisdiction.label,
          value: jurisdiction.deliveryTime
        })
      ) || []
  };
  const description =
    offer.metadata?.product?.description || offer.metadata?.description || "";
  const productData =
    offer.metadata?.attributes?.map((attr: any) => ({
      name: attr.traitType,
      value:
        attr.displayType === "date"
          ? new Date(parseInt(attr.value)).toUTCString()
          : attr.value
    })) || [];
  const artist = offer.metadata?.productV1Seller || null;
  const artistDescription = offer.metadata?.productV1Seller?.description || "";
  const images =
    offer.metadata?.product?.visuals_images?.map(
      ({ url }: { url: string }) => url
    ) || [];

  return {
    display: false,
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    productData,
    artist,
    artistDescription,
    images
  };
};
