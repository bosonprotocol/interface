import { isProductV1Item } from "@bosonprotocol/react-kit";
import { BundleItem } from "lib/types/bundle";

type ProductV1Item = Extract<
  BundleItem,
  { __typename?: "ProductV1ItemMetadataEntity" }
>;

export const getProductV1BundleItemsFilter = (
  items: Pick<BundleItem, "type" | "__typename">[]
) => {
  return items.filter((item): item is ProductV1Item => isProductV1Item(item));
};
