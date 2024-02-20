import {
  buildUuid,
  bundle,
  CoreSDK,
  MetadataType,
  nftItem
} from "@bosonprotocol/react-kit";
import { CreateProductForm } from "components/product/utils";

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
  values,
  coreSDK
}: {
  chainId: number;
  values: CreateProductForm;
  coreSDK: CoreSDK;
}) {
  const { productDigital, bundleItemsMedia } = values;
  const attributes: nftItem.NftItem["attributes"] = [
    {
      trait_type: "NFT type",
      value: productDigital.nftType.value
    },
    {
      trait_type: "Type",
      value: productDigital.type.value
    }
  ];
  return productDigital.bundleItems.map(
    (bundleItem, index): nftItem.NftItem => {
      const newNft = !getDoesBundleItemExist(bundleItem);
      if (newNft) {
        return getItemNFTMetadata({
          name: bundleItem.name,
          description: bundleItem.description,
          image: bundleItemsMedia?.[index]?.image?.[0]?.src,
          imageData: undefined,
          externalUrl: undefined,
          animationUrl: bundleItemsMedia?.[index]?.video?.[0]?.src,
          youtubeUrl: undefined, // nothing to map to in the UI
          image_data: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          external_url: undefined, // stay compliant with https://docs.opensea.io/docs/metadata-standards
          animation_url: bundleItemsMedia?.[index]?.video?.[0]?.src,
          youtube_url: undefined, // nothing to map to in the UI
          attributes,
          chainId: chainId,
          contract: undefined,
          tokenId: undefined, // nothing to map to in the UI
          tokenIdRange: undefined,
          quantity: undefined, // nothing to map to in the UI
          transferMethod: bundleItem.howWillItBeSentToTheBuyer,
          transferDelay: bundleItem.whenWillItBeSentToTheBuyer
        });
      }
      throw new Error(
        "There is a bundle item that is an existing nft and another that is not"
      );
    }
  );
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
type BundleItem = CreateProductForm["productDigital"]["bundleItems"][number];
type NewNFT = Extract<BundleItem, { name: string }>;
type ExistingNFT = Extract<BundleItem, { contractAddress: string }>;
export function getDoesBundleItemExist(
  bundleItem: NewNFT | ExistingNFT
): bundleItem is ExistingNFT {
  return !("name" in bundleItem);
}
