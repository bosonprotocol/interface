export const ExploreQueryParameters = {
  name: "name",
  page: "page",
  seller: "seller",
  currency: "currency",
  orderDirection: "orderDirection",
  orderBy: "orderBy",
  sortBy: "sortBy",
  sellerCurationList: "sellerCurationList"
} as const;

export const AccountQueryParameters = {
  tab: "tab",
  manageFunds: "manageFunds"
} as const;

export const TabQueryParameters = {
  exchange: "exchange"
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

export const CreateProductParameters = {
  tokenGated: "tokenGated"
};
