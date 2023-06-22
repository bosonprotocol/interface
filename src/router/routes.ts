import React, { lazy } from "react";
import { RouteProps } from "react-router";

import {
  BosonRoutes,
  OffersRoutes,
  ProductRoutes,
  SellerCenterRoutes
} from "../lib/routing/routes";
import BatchCreateOffersPage from "../pages/batch-create-offers/BatchCreateOffers";
import PrivacyPolicyPage from "../pages/common/PrivacyPolicy";
import TermsAndConditionsPage from "../pages/common/TermsAndConditions";
import CreateProductPage from "../pages/create-product/CreateProduct";
import { DCLPage } from "../pages/dcl/DCLPage";
import ExplorePage from "../pages/explore/Explore";
import LandingPage from "../pages/landing/Landing";
import OfferUuidReroute from "../pages/offers/OfferUuidReroute";
import SellerLandingPage from "../pages/sell/landing/SellerLandingPage";
import SellerCenterPage from "../pages/sell/SellerCenter";

const AboutPage = lazy(() => import("../pages/about/AboutPage"));
const ChatPage = lazy(() => import("../pages/chat/Chat"));
const CustomStorePage = lazy(() => import("../pages/custom-store/CustomStore"));
const DisputeCentrePage = lazy(
  () => import("../pages/dispute-centre/DisputeCentre")
);
const DisputeListPage = lazy(
  () => import("../pages/dispute-centre/DisputeList")
);
const ExchangePage = lazy(() => import("../pages/exchange/Exchange"));
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));
const OfferDetailPage = lazy(() => import("../pages/offers/OfferDetail"));
const ProductDetailPage = lazy(() => import("../pages/products/ProductDetail"));
const PrivateAccountPage = lazy(
  () => import("../pages/account/private/PrivateAccountContainer")
);
const ProfilePagePage = lazy(() => import("../pages/profile/ProfilePage"));
const PublicOrPrivateAccountPage = lazy(
  () => import("../pages/account/public/PublicOrPrivateAccount")
);
const LicensePage = lazy(() => import("../pages/license/License"));
const ContractualAgreementPage = lazy(
  () => import("../pages/contractualAgreement/ContractualAgreement")
);

const DisputeResolverPage = lazy(
  () => import("../pages/dispute-resolver/DisputeResolver")
);

export const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false,
  withBosonStyles: true,
  withBanner: false
};
const base = {
  component: null,
  index: false,
  app: baseAppProps,
  role: []
};

export const UserRoles = {
  Guest: "Guest",
  Buyer: "Buyer",
  Seller: "Seller",
  DisputeResolver: "DisputeResolver"
} as const;
export interface IRoutes extends RouteProps {
  component:
    | React.ComponentType<any> // eslint-disable-line
    | React.LazyExoticComponent<React.ComponentType<any>>; // eslint-disable-line
  role: Array<string | null>;
  componentProps?: {
    [key: string]: string;
  };
  app?: {
    withLayout?: boolean;
    withFullLayout?: boolean;
    withFooter?: boolean;
    fluidHeader?: boolean;
  };
}
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
      withLayout: false,
      withFooter: false
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
      withFooter: false,
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
      withLayout: false
    }
  },
  {
    ...base,
    path: BosonRoutes.Sellers,
    component: ExplorePage,
    app: {
      ...base.app,
      withLayout: false
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
    path: OffersRoutes.OfferUuid,
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
    path: `${BosonRoutes.DisputeId}/*`,
    component: DisputeCentrePage,
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: BosonRoutes.DisputeCenter,
    component: DisputeListPage,
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: BosonRoutes.Account,
    component: PublicOrPrivateAccountPage
  },
  {
    ...base,
    path: BosonRoutes.CreateStorefront,
    component: CustomStorePage
  },
  {
    ...base,
    path: BosonRoutes.BuyerPage,
    component: ProfilePagePage,
    componentProps: {
      profileType: "buyer"
    }
  },
  {
    ...base,
    path: BosonRoutes.SellerPage,
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
    path: BosonRoutes.AboutPage,
    app: {
      ...base.app
    },
    component: AboutPage
  },
  {
    ...base,
    exact: false,
    path: BosonRoutes.Error404,
    component: NotFoundPage
  }
] as IRoutes[];
