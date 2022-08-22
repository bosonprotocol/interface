import { UrlParameters } from "./parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: "/explore",
  ExplorePage: "/explore/page",
  ExplorePageByIndex: `/explore/page/:${UrlParameters.page}`,
  Sell: "/sell",
  Exchange: `/exchange/:${UrlParameters.exchangeId}`,
  YourAccount: `/account`,
  Account: `/account/:${UrlParameters.accountId}`,
  CreateStorefront: "/custom-store",
  TermsOfUse: "/terms-of-use", // TODO: add page to handle this route
  LearnMore: "/learn-more", // TODO: add page to handle this route
  Chat: "/chat",
  ChatMessage: `/chat/:${UrlParameters.exchangeId}`,
  Dispute: "/dispute",
  DisputeId: `/dispute/:${UrlParameters.exchangeId}`
} as const;

export const OffersRoutes = {
  Root: "/offers",
  OfferDetail: `/offers/:${UrlParameters.offerId}`
} as const;

export const ExternalRoutes = {
  TermsOfUse: BosonRoutes.TermsOfUse
} as const;

export const SocialRoutes = {
  Discord: "https://discord.com/invite/QSdtKRaap6",
  Github: "https://github.com/bosonprotocol",
  Twitter: "https://twitter.com/BosonProtocol",
  Youtube:
    "https://www.youtube.com/channel/UCcxilOavX03XF2d5Q9LbMwA/featured?view_as=subscriber",
  Medium: "https://medium.com/bosonprotocol"
} as const;
