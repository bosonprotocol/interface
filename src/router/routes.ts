import React, { lazy } from "react";
import { RouteProps } from "react-router";

import {
  BosonRoutes,
  OffersRoutes,
  SellerCenterRoutes
} from "../lib/routing/routes";

const ChatPage = lazy(() => import("../pages/chat/Chat"));
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
const ProfilePagePage = lazy(() => import("../pages/profile/ProfilePage"));
const PublicOrPrivateAccountPage = lazy(
  () => import("../pages/account/public/PublicOrPrivateAccount")
);
const SellerCenterPage = lazy(() => import("../pages/sell/SellerCenter"));

export const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false,
  withBosonStyles: true
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
      withLayout: false
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
    exact: false,
    path: BosonRoutes.Error404,
    component: NotFoundPage
  }
];
