import type { AdditionalFooterLink } from "./AdditionalFooterLinksTypes";
import type { ContactInfoLinkIconValues } from "./ContactInfoLinkIcon";
import type { SocialLogoValues } from "./SocialLogo";
import type { SelectType } from "./types";
export type StoreFields = {
  isCustomStoreFront: string;
  storeName: string;
  title: string;
  description: string;
  bannerImgPosition: string;
  bannerUrl: string;
  logoUrl: string;
  headerBgColor: string;
  headerTextColor: string;
  primaryBgColor: string;
  secondaryBgColor: string;
  accentColor: string;
  textColor: string;
  footerBgColor: string; // deleted but kept for backwards compatibility
  footerTextColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  fontFamily: string;
  navigationBarPosition: SelectType;
  copyright: string;
  showFooter: SelectType;
  socialMediaLinks: SelectType<SocialLogoValues>[];
  contactInfoLinks: SelectType<ContactInfoLinkIconValues>[];
  additionalFooterLinks: AdditionalFooterLink[];
  withOwnProducts: SelectType;
  sellerCurationList: string;
  offerCurationList: string;
  commitProxyAddress: string;
  openseaLinkToOriginalMainnetCollection: string;
  metaTransactionsApiKey: string;
  supportFunctionality: SelectType[]; // deleted but kept for backwards compatibility
};
export type InternalOnlyStoreFields = {
  // fields that must not be saved in the generated url, for this page use only
  bannerSwitch: boolean;
  bannerUrlText: string;
  bannerUpload: { name: string; size: number; src: string; type: string }[];
  logoUrlText: string;
  logoUpload: { name: string; size: number; src: string; type: string }[];
  customStoreUrl: string;
};

export type StoreFormFields = StoreFields & InternalOnlyStoreFields;
