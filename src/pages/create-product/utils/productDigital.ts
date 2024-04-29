import {
  buildUuid,
  bundle,
  digitalTypeMapping,
  MetadataType,
  nftItem
} from "@bosonprotocol/react-kit";
import {
  DigitalFile,
  ExistingNFT,
  Experiential,
  getIsBundleItem,
  NewNFT
} from "components/product/productDigital/getIsBundleItem";
import {
  CreateProductForm,
  digitalFileInfo,
  experientialInfo,
  mintedNftInfo,
  newNftInfo
} from "components/product/utils";
import { isTruthy } from "lib/types/helpers";

import { mapKeys } from "./const";

export function getItemNFTMetadata(
  bundleProps: Omit<nftItem.NftItem, "schemaUrl" | "type">
): nftItem.NftItem {
  return {
    ...bundleProps,
    schemaUrl: "https://schema.org/",
    type: MetadataType.ITEM_NFT
  };
}
const newNftTermsKeys = [
  "newNftTransferCriteria",
  "newNftTransferTime",
  "newNftBuyerTransferInfo"
] as const;
const mintedNftTermsKeys = [
  "mintedNftTokenType",
  "mintedNftTransferTime",
  "mintedNftTransferCriteria",
  "mintedNftBuyerTransferInfo"
] as const;
const digitalFileTermsKeys = [
  "digitalFileFormat",
  "digitalFileTransferCriteria",
  "digitalFileTransferTime",
  "digitalFileBuyerTransferInfo"
] as const;
const experientialTermsKeys = [
  "experientialTransferCriteria",
  "experientialTransferTime",
  "experientialBuyerTransferInfo"
] as const;

const getTermValue = (value: unknown): string => {
  if (!value) {
    return "";
  }
  if (typeof value === "object") {
    const obj = value;
    if ("value" in obj && obj["value"]) {
      return obj["value"].toString() || "";
    }
  }
  return value?.toString() || "";
};
export function getDigitalMetadatas({
  chainId,
  values
}: {
  chainId: number;
  values: CreateProductForm;
}) {
  const {
    productDigital: { bundleItems },
    bundleItemsMedia
  } = values;

  return bundleItems
    .map((bundleItem, index): nftItem.NftItem | null => {
      const image = bundleItemsMedia?.[index]?.image?.[0]?.src;
      const animationUrl = bundleItemsMedia?.[index]?.video?.[0]?.src;
      const quantity = 1;

      if (getIsBundleItem<NewNFT>(bundleItem, "newNftName")) {
        const attributes: nftItem.NftItem["attributes"] = [
          {
            traitType: "type",
            value: digitalTypeMapping["digital-nft"],
            displayType: "Type"
          },

          {
            traitType: "nft-type",
            value: bundleItem.newNftType.value,
            displayType: "NFT type"
          }
        ];
        return getItemNFTMetadata({
          name: bundleItem.newNftName,
          description: bundleItem.newNftDescription,
          image,
          imageData: undefined,
          externalUrl: undefined,
          animationUrl,
          youtubeUrl: undefined, // nothing to map to in the UI
          image_data: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          external_url: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          animation_url: animationUrl,
          youtube_url: undefined, // nothing to map to in the UI
          attributes,
          chainId,
          contract: undefined,
          tokenId: undefined, // nothing to map to in the UI
          tokenIdRange: undefined,
          quantity,
          terms: newNftTermsKeys.map((termKey) => {
            const { key, displayKey } = newNftInfo[termKey];
            return {
              key: mapKeys[key as keyof typeof mapKeys] || key,
              displayKey,
              value: getTermValue(bundleItem[termKey])
            };
          })
        });
      }
      if (
        getIsBundleItem<ExistingNFT>(bundleItem, "mintedNftContractAddress")
      ) {
        const minTokenId = bundleItem.mintedNftTokenIdRangeMin.toString();
        const maxTokenId = bundleItem.mintedNftTokenIdRangeMax.toString();
        const externalUrl = bundleItem.mintedNftExternalUrl;
        const attributes: nftItem.NftItem["attributes"] = [
          {
            traitType: "type",
            value: digitalTypeMapping["digital-nft"],
            displayType: "Type"
          },

          {
            traitType: "nft-type",
            value: bundleItem.mintedNftType.value,
            displayType: "NFT type"
          }
        ];
        return getItemNFTMetadata({
          name: bundleItem.mintedNftContractAddress,
          description: undefined,
          image,
          imageData: undefined,
          externalUrl,
          animationUrl,
          youtubeUrl: undefined, // nothing to map to in the UI
          image_data: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          external_url: externalUrl, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          animation_url: animationUrl,
          youtube_url: undefined, // nothing to map to in the UI
          attributes,
          chainId,
          contract: bundleItem.mintedNftContractAddress,
          tokenId: minTokenId === maxTokenId ? minTokenId : undefined,
          tokenIdRange: {
            min: minTokenId,
            max: maxTokenId
          },
          quantity,
          terms: mintedNftTermsKeys.map((termKey) => {
            const { key, displayKey } = mintedNftInfo[termKey];
            return {
              key: mapKeys[key as keyof typeof mapKeys] || key,
              displayKey,
              value: getTermValue(bundleItem[termKey])
            };
          })
        });
      }
      if (getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")) {
        const attributes: nftItem.NftItem["attributes"] = [
          {
            traitType: "type",
            value: digitalTypeMapping["digital-file"],
            displayType: "Type"
          }
        ];
        return getItemNFTMetadata({
          name: bundleItem.digitalFileName,
          description: bundleItem.digitalFileDescription,
          image,
          imageData: undefined,
          externalUrl: undefined,
          animationUrl,
          youtubeUrl: undefined, // nothing to map to in the UI
          image_data: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          external_url: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          animation_url: animationUrl,
          youtube_url: undefined, // nothing to map to in the UI
          attributes,
          chainId,
          contract: undefined,
          tokenId: undefined,
          tokenIdRange: undefined,
          quantity,
          terms: digitalFileTermsKeys.map((termKey) => {
            const { key, displayKey } = digitalFileInfo[termKey];
            return {
              key: mapKeys[key as keyof typeof mapKeys] || key,
              displayKey,
              value: getTermValue(bundleItem[termKey])
            };
          })
        });
      }
      if (getIsBundleItem<Experiential>(bundleItem, "experientialName")) {
        const attributes: nftItem.NftItem["attributes"] = [
          {
            traitType: "type",
            value: digitalTypeMapping["experiential"],
            displayType: "Type"
          }
        ];
        return getItemNFTMetadata({
          name: bundleItem.experientialName,
          description: bundleItem.experientialDescription,
          image,
          imageData: undefined,
          externalUrl: undefined,
          animationUrl,
          youtubeUrl: undefined, // nothing to map to in the UI
          image_data: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          external_url: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          animation_url: animationUrl,
          youtube_url: undefined, // nothing to map to in the UI
          attributes,
          chainId,
          contract: undefined,
          tokenId: undefined,
          tokenIdRange: undefined,
          quantity,
          terms: experientialTermsKeys.map((termKey) => {
            const { key, displayKey } = experientialInfo[termKey];
            return {
              key: mapKeys[key as keyof typeof mapKeys] || key,
              displayKey,
              value: getTermValue(bundleItem[termKey])
            };
          })
        });
      }
      return null;
    })
    .filter(isTruthy);
}

export function getBundleMetadata(
  bundleProps: Omit<
    bundle.BundleMetadata,
    "type" | "bundleUuid" | "schemaUrl" | "items"
  >,
  itemUrls: string[],
  bundleUuid: string = buildUuid()
): bundle.BundleMetadata {
  return {
    ...bundleProps,
    bundleUuid,
    schemaUrl: "https://schema.org/",
    type: MetadataType.BUNDLE,
    items: itemUrls.map((itemUrl) => {
      return { url: itemUrl };
    })
  };
}
