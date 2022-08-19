import { Gear } from "phosphor-react";
import React from "react";

import SellerProducts from "./products/SellerProducts";

export const DEFAULT_SELLER_PAGE = "Dashboard";

export const sellerPageTypes = {
  dashboard: {
    url: "dashboard",
    label: "Dashboard",
    icon: <Gear size={16} />,
    component: () => <div>Dashboard</div>
  },
  products: {
    url: "products",
    label: "Products",
    icon: <Gear size={16} />,
    component: () => <SellerProducts />
  },
  exchanges: {
    url: "exchanges",
    label: "Exchanges",
    icon: <Gear size={16} />,
    component: () => <div>Exchanges</div>
  },
  // TODO: remove this thing after Product page is done
  "create-product": {
    url: "create-product",
    label: "Create product",
    icon: <Gear size={16} />,
    component: () => null
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

export const SellerPages = (type: string | undefined): any => {
  return () =>
    sellerPageTypes[
      (type || DEFAULT_SELLER_PAGE) as keyof typeof sellerPageTypes
    ];
};
