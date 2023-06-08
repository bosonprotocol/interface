import { subgraph } from "@bosonprotocol/react-kit";

export type SalesChannels = NonNullable<
  NonNullable<subgraph.SellerFieldsFragment["metadata"]>["salesChannels"]
>;
