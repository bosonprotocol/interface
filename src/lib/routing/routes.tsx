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

// TODO: update social routes
export const ExternalRoutes = {
  TermsOfUse: "https://www.bosonprotocol.io/privacy-policy",
  PrivacyPolicy: "https://www.bosonprotocol.io/privacy-policy"
} as const;

export const SocialRoutes = {
  Discord: "https://discord.com/invite/QSdtKRaap6",
  Github: "https://github.com/bosonprotocol",
  Twitter: "https://twitter.com/BosonProtocol",
  Youtube:
    "https://www.youtube.com/channel/UCcxilOavX03XF2d5Q9LbMwA/featured?view_as=subscriber",
  Medium: "https://medium.com/bosonprotocol"
} as const;
