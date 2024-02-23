import { CONFIG } from "../config";
import { addViewModePrefixToPaths, ViewMode } from "../viewMode";
import { UrlParameters } from "./parameters";
const viewMode = CONFIG.envViewMode;

export const BosonRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DAPP,
  {
    Root: "/",
    Explore: `/explore`,
    Products: "/products",
    Sellers: "/sellers",
    Sell: "/sell",
    Exchange: `/exchange/:${UrlParameters.exchangeId}`,
    YourAccount: `/account`,
    CreateStorefront: "/custom-store",
    ManageStorefronts: "/custom-store/manage",
    PrivacyPolicy: "/privacy-policy",
    TermsAndConditions: "/terms-and-conditions",
    CommunityRules: "/community-rules",
    Chat: "/chat",
    ChatMessage: `/chat/:${UrlParameters.exchangeId}`,
    BuyerPage: `/buyer/:${UrlParameters.buyerId}`,
    SellerPage: `/seller/:${UrlParameters.sellerId}`,
    LicenseLegacy: `/license/:${UrlParameters.uuid}`,
    License: `/license/:${UrlParameters.sellerId}/:${UrlParameters.uuid}`,
    ContractualAgreement: `/contractualAgreement/:${UrlParameters.offerId}`,
    DRAdmin: "/dr-admin",
    DRAdminPage: `/dr-admin/:${UrlParameters.disputeResolverPageId}`,
    Error404: "*",
    AboutPage: "/about",
    Swap: "/swap"
  } as const
);

export const BosonProtocolRoutes = {
  LearnMore: "https://www.bosonprotocol.io/technology"
};

export const SellerCenterRoutes = {
  SellerCenter: `${BosonRoutes.Sell}/:${UrlParameters.sellerPage}`,
  CreateProduct: `${BosonRoutes.Sell}/create-product`,
  BatchCreateOffers: `${BosonRoutes.Sell}/batch-create-offers`,
  DCL: `${BosonRoutes.Sell}/dcl`
} as const;

export const SellerCenterSubRoutes = {
  Dashboard: "dashboard",
  Products: "products",
  Exchanges: "exchanges",
  Messages: "messages",
  Finances: "finances",
  "Sales Channels": "salesChannels",
  "Profile Details": "profileDetails"
} as const;

export const DisputeResolverCenterRoutes = {
  DisputeResolverCenter: `${BosonRoutes.DRAdmin}/:${UrlParameters.disputeResolverPageId}`
} as const;

export const ProductRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DAPP,
  {
    Root: "/products",
    ProductDetail: `/products/:${UrlParameters.sellerId}/:${UrlParameters.uuid}`
  } as const
);

export const BundleRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DAPP,
  {
    Root: "/products",
    BundleDetail: `/bundles/:${UrlParameters.sellerId}/:${UrlParameters.uuid}`
  } as const
);

export const OffersRoutes = addViewModePrefixToPaths(
  viewMode.current,
  ViewMode.DAPP,
  {
    Root: "/offers",
    OfferDetail: `/offers/:${UrlParameters.offerId}`,
    OfferUuidLegacy: `/offer-uuid/:${UrlParameters.uuid}`, // keep old route for existing offers
    OfferUuid: `/offer-uuid/:${UrlParameters.sellerId}/:${UrlParameters.uuid}`
  } as const
);

export const SocialRoutes = {
  Discord: "https://discord.com/invite/QSdtKRaap6",
  Github: "https://github.com/bosonprotocol",
  Twitter: "https://twitter.com/BosonProtocol",
  Youtube:
    "https://www.youtube.com/channel/UCcxilOavX03XF2d5Q9LbMwA/featured?view_as=subscriber",
  Medium: "https://medium.com/bosonprotocol"
} as const;
