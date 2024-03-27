import { BundleItem } from "./getIsBundleItem";

export const getBundleItemId = (bundleItem: BundleItem): string => {
  return Object.values(bundleItem).join("-");
};
