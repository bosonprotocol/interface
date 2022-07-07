export type StoreFields = {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  primaryBgColor: string;
  sellerWhitelist?: string;
  offerWhitelist?: string;
  metaTransactionsApiKey?: string;
};

export const storeFields: StoreFields = {
  storeName: "storeName",
  logoUrl: "logoUrl",
  primaryColor: "primaryColor",
  secondaryColor: "secondaryColor",
  accentColor: "accentColor",
  primaryBgColor: "primaryBgColor",
  sellerWhitelist: "sellerWhitelist",
  offerWhitelist: "offerWhitelist",
  metaTransactionsApiKey: "metaTransactionsApiKey"
} as const;
