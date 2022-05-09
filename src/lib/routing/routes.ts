import { UrlParameters } from "./query-parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: "/explore",
  ExplorePage: "/explore/page",
  ExplorePagePage: `/explore/page/:${UrlParameters.page}`,
  CreateOffer: "/create-offer",
  ManageOffers: "/manage-offers"
};

export const OffersRoutes = {
  Root: "/offers",
  OfferDetail: `/offers/:${UrlParameters.offerId}`
};
