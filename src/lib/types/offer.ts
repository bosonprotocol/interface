import { subgraph } from "@bosonprotocol/react-kit";

export type Offer = subgraph.OfferFieldsFragment & {
  isValid?: boolean;
  metadata: subgraph.ProductV1MetadataEntity & {
    imageUrl: string;
  };
};
