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
  "newNftHowWillItBeSentToTheBuyer",
  "newNftWhenWillItBeSentToTheBuyer",
  "newNftShippingInDays"
] as const;
const mintedNftTermsKeys = [
  "mintedNftWhenWillItBeSentToTheBuyer",
  "mintedNftShippingInDays"
] as const;
const digitalFileTermsKeys = [
  "digitalFileFormat",
  "digitalFileHowWillItBeSentToTheBuyer",
  "digitalFileWhenWillItBeSentToTheBuyer",
  "digitalFileShippingInDays"
] as const;
const experientialTermsKeys = [
  "experientialWhatWillTheBuyerReceieve",
  "experientialHowCanTheBuyerClaimAttendTheExperience",
  "experientialHowWillTheBuyerReceiveIt",
  "experientialWhenWillItBeSentToTheBuyer",
  "experientialShippingInDays"
] as const;
export function getDigitalMetadatas({
  chainId,
  values
}: {
  chainId: number;
  values: CreateProductForm;
}) {
  const { productDigital, bundleItemsMedia } = values;

  return productDigital.bundleItems
    .map((bundleItem, index): nftItem.NftItem | null => {
      const image = bundleItemsMedia?.[index]?.image?.[0]?.src;
      const animationUrl = bundleItemsMedia?.[index]?.video?.[0]?.src;
      const quantity = 1;
      const attributes: nftItem.NftItem["attributes"] = [
        {
          traitType: "type",
          value: productDigital.type.value,
          displayType: "Type"
        },
        ...(productDigital.type.value === digitalTypeMapping["digital-nft"] &&
        productDigital.nftType.value
          ? [
              {
                traitType: "nft-type",
                value: productDigital.nftType.value,
                displayType: "NFT type"
              }
            ]
          : [])
      ];
      if (getIsBundleItem<NewNFT>(bundleItem, "newNftName")) {
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
              key,
              displayKey,
              value: bundleItem[termKey]?.toString() || ""
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
        return getItemNFTMetadata({
          name: "",
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
              key,
              displayKey,
              value: bundleItem[termKey]?.toString() || ""
            };
          })
        });
      }
      if (getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")) {
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
              key,
              displayKey,
              value: bundleItem[termKey]?.toString() || ""
            };
          })
        });
      }
      if (getIsBundleItem<Experiential>(bundleItem, "experientialName")) {
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
              key,
              displayKey,
              value: bundleItem[termKey]?.toString() || ""
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
