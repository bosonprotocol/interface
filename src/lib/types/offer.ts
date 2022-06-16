import { offers as offersApi } from "@bosonprotocol/core-sdk";

export type Offer = offersApi.RawOfferFromSubgraph & {
  isValid?: boolean;
  metadata: {
    imageUrl: string;
  };
};
