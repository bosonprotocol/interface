import {
  ArrowsLeftRight,
  Bank,
  Chats,
  GridFour,
  Megaphone,
  Storefront
} from "phosphor-react";
import React from "react";

import { BosonRoutes } from "../../lib/routing/routes";
import Navigate from "../customNavigation/Navigate";
import { WithSellerDataProps } from "./common/WithSellerData";
import SellerDashboard from "./dashboard/SellerDashboard";
import SellerExchanges from "./exchanges/SellerExchanges";
import SellerFinances from "./finances/SellerFinances";
import SellerProducts from "./products/SellerProducts";
import { SellerInsideProps } from "./SellerInside";

export const DEFAULT_SELLER_PAGE = "dashboard";

export const sellerPageTypes = {
  dashboard: {
    url: "dashboard",
    label: "Dashboard",
    icon: GridFour,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerDashboard {...props} />
    ),
    withoutWrapper: true
  },
  products: {
    url: "products",
    label: "Products",
    icon: Storefront,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerProducts {...props} />
    )
  },
  exchanges: {
    url: "exchanges",
    label: "Exchanges",
    icon: ArrowsLeftRight,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerExchanges {...props} />
    )
  },
  messages: {
    url: "messages",
    label: "Messages",
    icon: Chats,
    component: () => <Navigate replace to={{ pathname: BosonRoutes.Chat }} />
  },
  finances: {
    url: "finances",
    label: "Finances",
    icon: Bank,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerFinances {...props} />
    )
  },
  salesChannels: {
    url: "salesChannels",
    label: "Sales Channels",
    icon: Megaphone,
    component: () => (
      <Navigate replace to={{ pathname: BosonRoutes.CreateStorefront }} />
    )
  }
};

export type SellerPageTypes = keyof typeof sellerPageTypes;

export type SellerPage = {
  url: string;
  label: string;
  icon: React.ReactNode | JSX.Element;
  component: React.ReactNode | JSX.Element;
  withoutWrapper?: boolean;
};

export type SellerPages = {
  [x in keyof SellerPageTypes]: SellerPage;
};

export const SellerPages = (type: string | undefined) => {
  return () =>
    sellerPageTypes[
      (type || DEFAULT_SELLER_PAGE) as keyof typeof sellerPageTypes
    ];
};
