export const ExploreQueryParameters = {
  name: "name",
  page: "page",
  seller: "seller",
  currency: "currency",
  orderDirection: "orderDirection",
  orderBy: "orderBy",
  sortBy: "sortBy"
} as const;

export const CollectionsQueryParameters = {
  value: "value",
  orderDirection: "orderDirection",
  orderBy: "orderBy",
  exchangeOrderBy: "exchangeOrderBy",
  validFromDate_lte: "validFromDate_lte",
  disputeResolver: "dr-admin"
} as const;

export const AccountQueryParameters = {
  tab: "tab",
  manageFunds: "manageFunds"
} as const;

export const UrlParameters = {
  offerId: "id",
  uuid: "uuid",
  exchangeId: "id",
  accountId: "id",
  page: "page",
  sellerPage: "sellerPage",
  buyerId: "id",
  sellerId: "id",
  tokenId: "id",
  disputeResolverPageId: "disputeResolverPage"
} as const;
