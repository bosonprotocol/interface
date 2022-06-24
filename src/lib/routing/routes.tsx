import { UrlParameters } from "./parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: "/explore",
  ExplorePage: "/explore/page",
  ExplorePageByIndex: `/explore/page/:${UrlParameters.page}`,
  CreateOffer: "/create-offer",
  Exchange: `/exchange/:${UrlParameters.exchangeId}`,
  YourAccount: `/account`,
  Account: `/account/:${UrlParameters.accountId}`,
  CreateStorefront: "/custom-store"
} as const;

export const OffersRoutes = {
  Root: "/offers",
  OfferDetail: `/offers/:${UrlParameters.offerId}`
} as const;

export const ExternalRoutes = {
  TermsOfUse: "https://google.com",
  PrivacyPolicy: "https://google.com"
} as const;

export const SocialRoutes = {
  Discord: "https://discord.com",
  Github: "https://github.com",
  Telegram: "https://telegram.com",
  Twitter: "https://twitter.com",
  Youtube: "https://youtube.com"
} as const;
