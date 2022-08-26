import { ArrowsLeftRight, Chats, GridFour, Storefront } from "phosphor-react";
import React from "react";
import { Navigate } from "react-router-dom";

import { BosonRoutes } from "../../lib/routing/routes";
import SellerExchanges from "./exchanges/SellerExchanges";
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
    component: () => <div>Dashboard</div>
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
    component: () => <Navigate replace to={BosonRoutes.Chat} />
  }
};

export type SellerPageTypes = keyof typeof sellerPageTypes;

export type SellerPage = {
  url: string;
  label: string;
  icon: React.ReactNode | JSX.Element;
  component: React.ReactNode | JSX.Element;
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
