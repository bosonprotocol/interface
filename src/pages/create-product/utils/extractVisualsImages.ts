import { productV1Item } from "@bosonprotocol/react-kit";
import { CreateProductForm } from "components/product/utils";
import map from "lodash/map";

export type VisualImages = productV1Item.ProductBase["visuals_images"];

export function extractVisualImages(
  productImages: CreateProductForm["productImages"]
): VisualImages {
  const visualImages = Array.from(
    new Set(
      map(
        productImages,
        (v) =>
          v?.[0]?.src &&
          ({
            url: v?.[0]?.src,
            tag: "product_image",
            height: v?.[0]?.height,
            width: v?.[0]?.width,
            type: v?.[0]?.type,
            name: v?.[0]?.name
          } as VisualImages[number])
      ).filter((n): n is VisualImages[number] => !!n)
    ).values()
  );
  return visualImages;
}
