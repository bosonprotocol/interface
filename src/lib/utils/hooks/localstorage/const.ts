export type CreateProductImageCreateYourProfileLogo =
  "create-product-image_createYourProfile.logo";

export type CreateProductImageProductImages =
  | "create-product-image_productImages.thumbnail"
  | "create-product-image_productImages.secondary"
  | "create-product-image_productImages.everyAngle"
  | "create-product-image_productImages.details"
  | "create-product-image_productImages.inUse"
  | "create-product-image_productImages.styledScene"
  | "create-product-image_productImages.sizeAndScale"
  | "create-product-image_productImages.more";

export type CreateProduct = "create-product";

export const createProductKeys: (
  | CreateProductImageProductImages
  | CreateProductImageCreateYourProfileLogo
  | CreateProduct
)[] = [
  "create-product-image_createYourProfile.logo",
  "create-product-image_productImages.thumbnail",
  "create-product-image_productImages.secondary",
  "create-product-image_productImages.everyAngle",
  "create-product-image_productImages.details",
  "create-product-image_productImages.inUse",
  "create-product-image_productImages.styledScene",
  "create-product-image_productImages.sizeAndScale",
  "create-product-image_productImages.more",
  "create-product"
];

export type GetItemFromStorageKey =
  | CreateProduct
  | "tracing-url"
  | "convertionRates"
  | "shouldDisplayOfferBackedWarning"
  | "isConnectWalletFromCommit"
  | "showCookies"
  | "showCookiesDrCenter"
  | "release-version"
  | CreateProductImageProductImages
  | CreateProductImageCreateYourProfileLogo;
