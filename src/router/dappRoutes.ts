import { lazy } from "react";

import {
  BosonRoutes,
  BundleRoutes,
  OffersRoutes,
  ProductRoutes,
  SellerCenterRoutes
} from "../lib/routing/routes";
import { IRoutes } from "./types";
const AboutPage = lazy(() => import("../pages/about/AboutPage"));
const ChatPage = lazy(() => import("../pages/chat/Chat"));
const CustomStorePage = lazy(
  () => import("../pages/custom-store/CustomStorePage")
);
const ManageStoreFrontsPage = lazy(
  () => import("../pages/custom-store/manage/ManageStoreFrontsPage")
);
const ExchangePage = lazy(() => import("../pages/exchange/Exchange"));
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));
const OfferDetailPage = lazy(() => import("../pages/offers/OfferDetail"));
const ProductDetailPage = lazy(() => import("../pages/products/ProductDetail"));
const BundleDetailPage = lazy(() => import("../pages/bundles/BundleDetail"));
const PrivateAccountPage = lazy(
  () => import("../pages/account/private/PrivateAccountContainer")
);
const ProfilePagePage = lazy(() => import("../pages/profile/ProfilePage"));
const LicensePage = lazy(() => import("../pages/license/License"));
const LicenseBundlePage = lazy(() => import("../pages/license/LicenseBundle"));
const ContractualAgreementPage = lazy(
  () => import("../pages/contractualAgreement/ContractualAgreement")
);

const DisputeResolverPage = lazy(
  () => import("../pages/dispute-resolver/DisputeResolver")
);
const CreateProductPage = lazy(
  () => import("../pages/create-product/CreateProduct")
);
const BatchCreateOffersPage = lazy(
  () => import("../pages/batch-create-offers/BatchCreateOffers")
);
const PrivacyPolicyPage = lazy(() => import("../pages/common/PrivacyPolicy"));
const TermsAndConditionsPage = lazy(
  () => import("../pages/common/TermsAndConditions")
);
const DCLPage = lazy(() => import("../pages/dcl/DCLPage"));
const ExplorePage = lazy(() => import("../pages/explore/Explore"));
const LandingPage = lazy(() => import("../pages/landing/Landing"));
const OfferUuidReroute = lazy(() => import("../pages/offers/OfferUuidReroute"));
const SellerLandingPage = lazy(
  () => import("../pages/sell/landing/SellerLandingPage")
);
const SellerCenterPage = lazy(() => import("../pages/sell/SellerCenter"));

const SwapPage = lazy(() => import("../pages/swap/index"));
const CommunityRules = lazy(() => import("../pages/common/CommunityRules"));

export const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false,
  withBosonStyles: true,
  withBanner: false
} as const;
const base = {
  component: null,
  index: false,
  app: baseAppProps,
  role: []
} as const;

export const UserRoles = {
  Guest: "Guest",
  Buyer: "Buyer",
  Seller: "Seller",
  DisputeResolver: "DisputeResolver"
} as const;

export default [
  {
    ...base,
    index: true,
    path: BosonRoutes.Root,
    component: LandingPage,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: `${BosonRoutes.Chat}/*`,
    component: ChatPage,
    app: {
      ...base.app,
      fluidHeader: true,
      withLayout: false,
      withFooter: true
    },
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: BosonRoutes.Sell,
    component: SellerLandingPage,
    app: {
      ...base.app,
      withLayout: false,
      withFooter: true,
      fluidHeader: false
    }
  },
  {
    ...base,
    path: `${SellerCenterRoutes.SellerCenter}/*`,
    component: SellerCenterPage,
    app: {
      ...base.app,
      withLayout: false,
      withFooter: true,
      fluidHeader: true
    },
    role: [UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: SellerCenterRoutes.CreateProduct,
    component: CreateProductPage
  },
  {
    ...base,
    path: SellerCenterRoutes.BatchCreateOffers,
    component: BatchCreateOffersPage
  },
  {
    ...base,
    path: SellerCenterRoutes.DCL,
    component: DCLPage,
    app: {
      ...base.app,
      withHeader: false,
      withLayout: true,
      withFullLayout: true,
      withFooter: false,
      fluidHeader: false
    },
    role: [UserRoles.Seller]
  },
  {
    ...base,
    path: BosonRoutes.Explore,
    component: ExplorePage,
    app: {
      ...base.app,
      withLayout: false,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: BosonRoutes.Products,
    component: ExplorePage,
    app: {
      ...base.app,
      withLayout: false,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: OffersRoutes.Root,
    component: ExplorePage,
    app: {
      ...base.app,
      withLayout: false,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: BosonRoutes.Sellers,
    component: ExplorePage,
    app: {
      ...base.app,
      withLayout: false,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: OffersRoutes.OfferDetail,
    component: OfferDetailPage,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: ProductRoutes.ProductDetail,
    component: ProductDetailPage,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: BundleRoutes.BundleDetail,
    component: BundleDetailPage,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: OffersRoutes.OfferUuid,
    component: OfferUuidReroute,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: OffersRoutes.OfferUuidLegacy,
    component: OfferUuidReroute,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    path: BosonRoutes.License,
    component: LicensePage
  },
  {
    ...base,
    path: BosonRoutes.LicenseLegacy,
    component: LicensePage
  },
  {
    ...base,
    path: BosonRoutes.LicenseBundle,
    component: LicenseBundlePage
  },
  {
    ...base,
    path: BosonRoutes.ContractualAgreement,
    component: ContractualAgreementPage
  },
  {
    ...base,
    path: BosonRoutes.Exchange,
    component: ExchangePage,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    role: [
      UserRoles.Guest,
      UserRoles.Buyer,
      UserRoles.Seller,
      UserRoles.DisputeResolver
    ]
  },
  {
    ...base,
    path: BosonRoutes.YourAccount,
    component: PrivateAccountPage,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    role: [UserRoles.Buyer]
  },
  {
    ...base,
    path: BosonRoutes.ManageStorefronts,
    component: ManageStoreFrontsPage
  },
  {
    ...base,
    path: BosonRoutes.CreateStorefront,
    component: CustomStorePage
  },
  {
    ...base,
    path: BosonRoutes.BuyerPage,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: ProfilePagePage,
    componentProps: {
      profileType: "buyer"
    }
  },
  {
    ...base,
    path: BosonRoutes.SellerPage,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: ProfilePagePage,
    componentProps: {
      profileType: "seller"
    }
  },
  {
    ...base,
    path: BosonRoutes.DRAdminPage,
    app: {
      ...base.app,
      withLayout: false,
      withFooter: false,
      fluidHeader: true
    },
    component: DisputeResolverPage
  },
  {
    ...base,
    path: BosonRoutes.DRAdmin,
    app: {
      ...base.app,
      withLayout: false,
      withFooter: false,
      fluidHeader: true
    },
    component: DisputeResolverPage
  },
  {
    ...base,
    path: BosonRoutes.PrivacyPolicy,
    app: {
      ...base.app
    },
    component: PrivacyPolicyPage
  },
  {
    ...base,
    path: BosonRoutes.TermsAndConditions,
    app: {
      ...base.app
    },
    component: TermsAndConditionsPage
  },
  {
    ...base,
    path: BosonRoutes.CommunityRules,
    app: {
      ...base.app
    },
    component: CommunityRules
  },
  {
    ...base,
    path: BosonRoutes.AboutPage,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: AboutPage
  },
  {
    ...base,
    path: BosonRoutes.Swap,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: SwapPage
  },
  {
    ...base,
    exact: false,
    path: BosonRoutes.Error404,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: NotFoundPage
  }
] as IRoutes[];
