import { subgraph } from "@bosonprotocol/react-kit";

// type ProductV1MetadataEntityReduced = Extract<
//   subgraph.BundleMetadataEntityFieldsFragment["offer"]["metadata"],
//   { __typename?: "ProductV1MetadataEntity" }
// >;

export type Offer = subgraph.OfferFieldsFragment & {
  isValid?: boolean;
  metadata?: subgraph.OfferFieldsFragment["metadata"] & { imageUrl?: string };
  additional?: {
    product: subgraph.ProductV1Product;
    variants: subgraph.OfferFieldsFragment[];
  };
};
