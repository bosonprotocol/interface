import { subgraph } from "@bosonprotocol/react-kit";

export type Offer = subgraph.OfferFieldsFragment & {
  isValid?: boolean;
  metadata: {
    imageUrl: string;
  };
};
