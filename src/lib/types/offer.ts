import { subgraph } from "@bosonprotocol/react-kit";

export type Offer = subgraph.OfferFieldsFragment & {
  isValid?: boolean;
  metadata: subgraph.ProductV1MetadataEntity & {
    imageUrl: string;
  };
  additional?: {
    product: subgraph.ProductV1Product;
    variants: subgraph.OfferFieldsFragment[];
  };
};
