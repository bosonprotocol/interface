import { CreateProductForm } from "components/product/utils";

export type BundleItem =
  CreateProductForm["productDigital"]["bundleItems"][number];
export type NewNFT = Extract<BundleItem, { newNftName: string }>;
export type ExistingNFT = Extract<
  BundleItem,
  { mintedNftContractAddress: string }
>;
export type DigitalFile = Extract<BundleItem, { digitalFileName: string }>;
export type Experiential = Extract<BundleItem, { experientialName: string }>;

export function getIsBundleItem<
  T extends NewNFT | ExistingNFT | DigitalFile | Experiential
>(
  bundleItem: NewNFT | ExistingNFT | DigitalFile | Experiential,
  type: keyof T
): bundleItem is T {
  return type in bundleItem;
}
