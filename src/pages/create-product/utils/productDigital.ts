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
import { CreateProductForm } from "components/product/utils";
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
      const commonAttributes: nftItem.NftItem["attributes"] = [
        {
          traitType: "Type",
          value: productDigital.type.value
        },
        ...(productDigital.type.value === digitalTypeMapping["digital-nft"] &&
        productDigital.nftType.value
          ? [
              {
                traitType: "NFT type",
                value: productDigital.nftType.value
              }
            ]
          : [])
      ];
      // TODO: where to save shipping days? bundleItem.shippingInDays
      if (getIsBundleItem<NewNFT>(bundleItem, "newNftName")) {
        const attributes: nftItem.NftItem["attributes"] = commonAttributes;
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
          transferMethod: bundleItem.newNftHowWillItBeSentToTheBuyer,
          transferDelay: bundleItem.newNftWhenWillItBeSentToTheBuyer
        });
      }
      if (
        getIsBundleItem<ExistingNFT>(bundleItem, "mintedNftContractAddress")
      ) {
        const attributes: nftItem.NftItem["attributes"] = commonAttributes;

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
          transferMethod: undefined,
          transferDelay: bundleItem.mintedNftShippingInDays?.toString()
        });
      }
      if (getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")) {
        const attributes: nftItem.NftItem["attributes"] = commonAttributes;

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
          transferMethod: bundleItem.digitalFileHowWillItBeSentToTheBuyer,
          transferDelay: bundleItem.digitalFileShippingInDays?.toString()
        });
      }
      if (getIsBundleItem<Experiential>(bundleItem, "experientialName")) {
        const attributes: nftItem.NftItem["attributes"] = commonAttributes;

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
          transferMethod: bundleItem.experientialHowWillTheBuyerReceiveIt,
          transferDelay: bundleItem.experientialShippingInDays?.toString()
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
