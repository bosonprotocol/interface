import {
  BundleItem,
  DigitalFile,
  ExistingNFT,
  getIsBundleItem,
  NewNFT
} from "./getIsBundleItem";

export const getBundleItemName = (
  bundleItem: BundleItem,
  defaultToContractAddress?: boolean
): string => {
  const name = bundleItem
    ? getIsBundleItem<NewNFT>(bundleItem, "newNftName")
      ? bundleItem.newNftName
      : getIsBundleItem<ExistingNFT>(bundleItem, "mintedNftContractAddress")
        ? defaultToContractAddress
          ? bundleItem.mintedNftContractAddress
          : ""
        : getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")
          ? bundleItem.digitalFileName
          : bundleItem.experientialName
    : "";
  return name;
};
