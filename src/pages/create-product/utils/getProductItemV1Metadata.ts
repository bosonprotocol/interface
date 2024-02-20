import { Media, MetadataType, productV1Item } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import uuid from "react-uuid";
dayjs.extend(localizedFormat);

import { FileProps } from "../../../components/form/Upload/types";
import {
  CreateProductForm,
  OPTIONS_EXCHANGE_POLICY
} from "../../../components/product/utils";
import { CONFIG } from "../../../lib/config";
import { getIpfsGatewayUrl } from "../../../lib/utils/ipfs";
import { SupportedJuridiction } from "./types";

type GetProductItemV1MetadataProps = {
  offerUuid: string;
  productInformation: CreateProductForm["productInformation"];
  productAnimation: FileProps | undefined;
  createYourProfile: CreateProductForm["createYourProfile"];
  productType: CreateProductForm["productType"];
  visualImages: productV1Item.ProductBase["visuals_images"];
  shippingInfo: CreateProductForm["shippingInfo"];
  termsOfExchange: CreateProductForm["termsOfExchange"];
  supportedJurisdictions: Array<SupportedJuridiction>;
  redemptionPointUrl: string;
};
export async function getProductItemV1Metadata({
  offerUuid,
  productInformation,
  productAnimation,
  createYourProfile,
  productType,
  visualImages,
  shippingInfo,
  termsOfExchange,
  supportedJurisdictions,
  redemptionPointUrl
}: GetProductItemV1MetadataProps): Promise<productV1Item.ProductV1Item> {
  const animationUrl = getIpfsGatewayUrl(productAnimation?.src || "");
  const visualsVideos: Media[] =
    animationUrl === ""
      ? []
      : [
          {
            url: animationUrl,
            tag: ""
          }
        ];

  return {
    schemaUrl: "https://schema.org/",
    uuid: offerUuid,
    type: MetadataType.ITEM_PRODUCT_V1,
    product: {
      uuid: uuid(),
      version: 1,
      title: productInformation.productTitle?.toString(),
      description: productInformation.description?.toString(),
      identification_sKU: productInformation.sku?.toString(),
      identification_productId: productInformation.id?.toString(),
      identification_productIdType: productInformation.idType?.toString(),
      productionInformation_brandName:
        productInformation.brandName?.toString() || createYourProfile.name,
      productionInformation_manufacturer:
        productInformation.manufacture?.toString(),
      productionInformation_manufacturerPartNumber:
        productInformation.manufactureModelName?.toString(),
      productionInformation_modelNumber:
        productInformation.partNumber?.toString(),
      productionInformation_materials: productInformation.materials?.split(","),
      details_category: productInformation.category.value?.toString(),
      details_subCategory: undefined, // no entry in the UI
      details_subCategory2: undefined, // no entry in the UI
      details_offerCategory: productType.productType.toUpperCase(),
      details_tags: productInformation.tags,
      details_sections: undefined, // no entry in the UI
      details_personalisation: undefined, // no entry in the UI
      visuals_images: visualImages,
      visuals_videos: visualsVideos, // no entry in the UI
      packaging_packageQuantity: undefined, // no entry in the UI
      packaging_dimensions_length: shippingInfo.length?.toString(),
      packaging_dimensions_width: shippingInfo.width?.toString(),
      packaging_dimensions_height: shippingInfo.height?.toString(),
      packaging_dimensions_unit: shippingInfo.measurementUnit.value?.toString(),
      packaging_weight_value: shippingInfo?.weight?.toString() || "",
      packaging_weight_unit: shippingInfo?.weightUnit.value?.toString() || ""
    },
    exchangePolicy: {
      uuid: Date.now().toString(),
      version: 1,
      label: termsOfExchange.exchangePolicy.label,
      template:
        termsOfExchange.exchangePolicy.value === "fairExchangePolicy" // if there is data in localstorage, the exchangePolicy.value might be the old 'fairExchangePolicy'
          ? OPTIONS_EXCHANGE_POLICY[0].value
          : termsOfExchange.exchangePolicy.value || "",
      sellerContactMethod: CONFIG.defaultSellerContactMethod,
      disputeResolverContactMethod: `email to: ${CONFIG.defaultDisputeResolverContactMethod}`
    },
    shipping: {
      defaultVersion: 1,
      countryOfOrigin:
        /*TODO: NOTE: we might add it back in the future: shippingInfo.country?.label || */ "",
      supportedJurisdictions:
        supportedJurisdictions.length > 0 ? supportedJurisdictions : undefined,
      returnPeriod: shippingInfo.returnPeriod.toString(),
      redemptionPoint: redemptionPointUrl
    }
  };
}
