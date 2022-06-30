export type StoreFields = {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  primaryBgColor: string;
};

export const storeFields: StoreFields = {
  storeName: "storeName",
  logoUrl: "logoUrl",
  primaryColor: "primaryColor",
  secondaryColor: "secondaryColor",
  accentColor: "accentColor",
  primaryBgColor: "primaryBgColor"
} as const;
