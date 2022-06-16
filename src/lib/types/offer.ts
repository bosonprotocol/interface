import { OfferFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

export type Offer = OfferFieldsFragment & {
  isValid?: boolean;
  metadata: {
    imageUrl: string;
  };
};
