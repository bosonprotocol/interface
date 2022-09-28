import React, { lazy } from "react";
import { RouteProps } from "react-router";

import {
  BosonRoutes,
  OffersRoutes,
  SellerCenterRoutes
} from "../lib/routing/routes";

const ChatPage = lazy(() => import("../pages/chat/Chat"));
const CollectionsPage = lazy(() => import("../pages/explore/Collections"));
const CreateProductPage = lazy(
  () => import("../pages/create-product/CreateProduct")
);
const CustomStorePage = lazy(() => import("../pages/custom-store/CustomStore"));
const DisputeCentrePage = lazy(
  () => import("../pages/dispute-centre/DisputeCentre")
);
const DisputeListPage = lazy(
  () => import("../pages/dispute-centre/DisputeList")
);
const ExchangePage = lazy(() => import("../pages/exchange/Exchange"));
const ExplorePage = lazy(() => import("../pages/explore/Explore"));
const LandingPage = lazy(() => import("../pages/landing/Landing"));
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));
const OfferDetailPage = lazy(() => import("../pages/offers/OfferDetail"));
const PrivateAccountPage = lazy(
  () => import("../pages/account/private/PrivateAccountContainer")
);
const ProductsPage = lazy(() => import("../pages/explore/Products"));
const ProfilePagePage = lazy(() => import("../pages/profile/ProfilePage"));
const PublicOrPrivateAccountPage = lazy(
  () => import("../pages/account/public/PublicOrPrivateAccount")
);
const SellerCenterPage = lazy(() => import("../pages/sell/SellerCenter"));
const LicensePage = lazy(() => import("../pages/license/License"));
const ContractualAgreementPage = lazy(
  () => import("../pages/contractualAgreement/ContractualAgreement")
);

export const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false
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
};
export interface IRoutes extends RouteProps {
  // eslint-disable-next-line
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  role: Array<string | null>;
  componentProps?: {
    [key: string]: string;
  };
  app?: {
    withLayout?: boolean;
    withFooter?: boolean;
    fluidHeader?: boolean;
  };
}
export default [
  {
    ...base,
    index: true,
    path: BosonRoutes.Root,
    component: LandingPage
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
    path: BosonRoutes.Products,
    component: ProductsPage
  },
  {
    ...base,
    path: BosonRoutes.Explore,
    component: ExplorePage
  },
  {
    ...base,
    path: OffersRoutes.Root,
    component: ExplorePage
  },
  {
    ...base,
    path: BosonRoutes.ExplorePage,
    component: ProductsPage
  },
  {
    ...base,
    path: BosonRoutes.ExplorePageByIndex,
    component: ProductsPage
  },
  {
    ...base,
    path: OffersRoutes.OfferDetail,
    component: OfferDetailPage
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
    path: BosonRoutes.Sellers,
    component: CollectionsPage
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
    exact: false,
    path: BosonRoutes.Error404,
    component: NotFoundPage
  }
];
