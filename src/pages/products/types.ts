import { subgraph } from "@bosonprotocol/react-kit";

import { Offer } from "../../lib/types/offer";

export type VariantV1 = {
  offer: Offer;
  variations: (Omit<subgraph.ProductV1Variation, "type"> & {
    type: "Color" | "Size";
  })[];
};

export type Variation = VariantV1["variations"][number];
