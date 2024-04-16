import {
  BundleItem,
  DigitalFile,
  ExistingNFT,
  getIsBundleItem,
  NewNFT
} from "./getIsBundleItem";

export const getBundleItemTransferDelay = (bundleItem: BundleItem): string => {
  const transferDelay = bundleItem
    ? getIsBundleItem<NewNFT>(bundleItem, "newNftName")
      ? bundleItem.newNftShippingInDays?.toString()
      : getIsBundleItem<ExistingNFT>(bundleItem, "mintedNftContractAddress")
        ? bundleItem.mintedNftShippingInDays?.toString()
        : getIsBundleItem<DigitalFile>(bundleItem, "digitalFileName")
          ? bundleItem.digitalFileShippingInDays?.toString()
          : bundleItem.experientialShippingInDays?.toString()
    : "";
  return transferDelay || "";
};
