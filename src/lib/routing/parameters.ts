export const ExploreQueryParameters = {
  name: "name",
  seller: "seller",
  currency: "currency",
  orderDirection: "orderDirection",
  orderBy: "orderBy"
} as const;

export const CollectionsQueryParameters = {
  value: "value",
  orderDirection: "orderDirection",
  orderBy: "orderBy",
  exchangeOrderBy: "exchangeOrderBy",
  validFromDate_lte: "validFromDate_lte"
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
  sellerId: "id"
} as const;
