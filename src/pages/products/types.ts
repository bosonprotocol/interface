import { subgraph } from "@bosonprotocol/react-kit";

import { Offer } from "../../lib/types/offer";

export type VariantV1 = {
  offer: Offer;
  variations: (Omit<subgraph.ProductV1Variation, "metadata" | "type"> & {
    metadata?: subgraph.ProductV1MetadataEntity;
    type: "Color" | "Size";
  })[];
};

export type Variation = VariantV1["variations"][number];
