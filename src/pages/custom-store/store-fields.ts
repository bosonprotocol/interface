export type StoreFields = {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  primaryBgColor: string;
  sellerCurationList?: string;
  offerCurationList?: string;
  metaTransactionsApiKey?: string;
};

export const storeFields: StoreFields = {
  storeName: "storeName",
  logoUrl: "logoUrl",
  primaryColor: "primaryColor",
  secondaryColor: "secondaryColor",
  accentColor: "accentColor",
  primaryBgColor: "primaryBgColor",
  sellerCurationList: "sellerCurationList",
  offerCurationList: "offerCurationList",
  metaTransactionsApiKey: "metaTransactionsApiKey"
} as const;
