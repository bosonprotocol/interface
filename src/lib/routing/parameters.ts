export const ExploreQueryParameters = {
  name: "name",
  seller: "seller",
  currency: "currency",
  orderDirection: "orderDirection",
  orderBy: "orderBy",
  disputeResolver: "dr-admin"
} as const;

export const AccountQueryParameters = {
  tab: "tab"
} as const;

export const UrlParameters = {
  offerId: "id",
  exchangeId: "id",
  accountId: "id",
  page: "page",
  sellerPage: "sellerPage",
  buyerId: "id",
  sellerId: "id",
  disputeResolverPageId: "disputeResolverPage"
} as const;
