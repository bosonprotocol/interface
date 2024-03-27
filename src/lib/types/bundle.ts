import { subgraph } from "@bosonprotocol/react-kit";

export type BundleItem =
  subgraph.BundleMetadataEntityFieldsFragment["items"][number];
