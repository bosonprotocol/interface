import {
  ArrowsLeftRight,
  Bank,
  Chats,
  GridFour,
  Storefront
} from "phosphor-react";
import React from "react";

import { BosonRoutes } from "../../lib/routing/routes";
import Navigate from "../customNavigation/Navigate";
import SellerDashboard from "./dashboard/SellerDashboard";
import SellerExchanges from "./exchanges/SellerExchanges";
import SellerFinances from "./finances/SellerFinances";
import SellerProducts from "./products/SellerProducts";

export const DEFAULT_SELLER_PAGE = "dashboard";
interface SellerProps {
  sellerId: string;
}

export const sellerPageTypes = {
  dashboard: {
    url: "dashboard",
    label: "Dashboard",
    icon: GridFour,
    component: ({ sellerId }: SellerProps) => (
      <SellerDashboard sellerId={sellerId} />
    ),
    withoutWrapper: true
  },
  products: {
    url: "products",
    label: "Products",
    icon: Storefront,
    component: ({ sellerId }: SellerProps) => (
      <SellerProducts sellerId={sellerId} />
    )
  },
  exchanges: {
    url: "exchanges",
    label: "Exchanges",
    icon: ArrowsLeftRight,
    component: ({ sellerId }: SellerProps) => (
      <SellerExchanges sellerId={sellerId} />
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
    component: () => <SellerFinances />
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
