import { UrlParameters } from "./query-parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: "/explore",
  ExplorePage: "/explore/page",
  ExplorePageByIndex: `/explore/page/:${UrlParameters.page}`,
  CreateOffer: "/create-offer",
  Exchange: `/exchange/:${UrlParameters.exchangeId}`,
  YourAccount: `/account`,
  Account: `/account/:${UrlParameters.accountId}`
};

export const OffersRoutes = {
  Root: "/offers",
  OfferDetail: `/offers/:${UrlParameters.offerId}`
};
