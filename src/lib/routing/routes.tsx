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
  TermsOfUse: "https://www.bosonprotocol.io/",
  PrivacyPolicy: "https://www.bosonprotocol.io/"
} as const;

// TODO: update social routes
export const SocialRoutes = {
  Discord: "https://www.bosonprotocol.io/",
  Github: "https://www.bosonprotocol.io/",
  Twitter: "https://www.bosonprotocol.io/",
  Youtube: "https://www.bosonprotocol.io/",
  Medium: "https://www.bosonprotocol.io/"
} as const;
