/* eslint @typescript-eslint/no-explicit-any: "off" */
import { Offer } from "./../../types/offer";

interface ITable {
  name: string;
  value: string;
}
interface IShippingInfo {
  shipping: string;
  shippingTable: Array<ITable>;
}
interface IGetOfferDetails {
  display: boolean;
  name: string;
  offerImg: string;
  shippingInfo: IShippingInfo;
  description: string;
  productData: Array<ITable>;
  artistDescription: string;
  images: Array<string>;
}
export const getOfferDetails = (offer: Offer): IGetOfferDetails => {
  const name =
    offer.metadata?.product?.title || offer.metadata?.name || "Untitled";
  const offerImg = offer.metadata?.image;
  const shippingInfo = {
    shipping: "Shipping details ??????",
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
      value: attr.value
    })) || [];
  const artistDescription = offer.metadata?.productV1Seller?.description || "";
  const images =
    offer.metadata?.product?.visuals_images.map(
      ({ url }: { url: string }) => url
    ) || [];

  return {
    display: false,
    name,
    offerImg,
    shippingInfo,
    description,
    productData,
    artistDescription,
    images
  };
};
