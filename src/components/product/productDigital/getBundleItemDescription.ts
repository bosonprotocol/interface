import {
  BundleItem,
  DigitalFile,
  ExistingNFT,
  getIsBundleItem,
  NewNFT
} from "./getIsBundleItem";

export const getBundleItemDescription = (bundleItem: BundleItem): string => {
  const description = bundleItem
    ? getIsBundleItem<NewNFT>(bundleItem, "newNftName")
      ? bundleItem.newNftDescription
      : getIsBundleItem<ExistingNFT>(bundleItem, "mintedNftContractAddress")
        ? ""
        : getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")
          ? bundleItem.digitalFileDescription
          : bundleItem.experientialDescription
    : "";
  return description;
};
