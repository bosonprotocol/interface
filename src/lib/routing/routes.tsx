import { UrlParameters } from "./parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: `/explore`,
  Products: "/products",
  Sellers: "/sellers",
  Sell: "/sell",
  Exchange: `/exchange/:${UrlParameters.exchangeId}`,
  YourAccount: `/account`,
  Account: `/account/:${UrlParameters.accountId}`,
  CreateStorefront: "/custom-store",
  TermsOfUse: "/terms-of-use", // TODO: add page to handle this route
  LearnMore: "/learn-more", // TODO: add page to handle this route
  Chat: "/chat",
  ChatMessage: `/chat/:${UrlParameters.exchangeId}`,
  DisputeCenter: "/dispute-center",
  DisputeId: `/exchange/:${UrlParameters.exchangeId}/raise-dispute`,
  BuyerPage: `/buyer/:${UrlParameters.buyerId}`,
  SellerPage: `/seller/:${UrlParameters.sellerId}`,
  License: `/license/:${UrlParameters.tokenId}`,
  ContractualAgreement: `/contractualAgreement/:${UrlParameters.offerId}`,
  DRAdmin: "/dr-admin",
  DRAdminPage: `/dr-admin/:${UrlParameters.disputeResolverPageId}`,
  Error404: "*"
} as const;

export const SellerCenterRoutes = {
  SellerCenter: `${BosonRoutes.Sell}/:${UrlParameters.sellerPage}`,
  CreateProduct: `${BosonRoutes.Sell}/create-product`
};

export const DisputeResolverCenterRoutes = {
  DisputeResolverCenter: `${BosonRoutes.DRAdmin}/:${UrlParameters.disputeResolverPageId}`
};

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
