import {
  ArrowsLeftRight,
  Bank,
  Chats,
  GridFour,
  Megaphone,
  Storefront,
  User
} from "phosphor-react";
import React from "react";

import { BosonRoutes } from "../../lib/routing/routes";
import Navigate from "../customNavigation/Navigate";
import { WithSellerDataProps } from "./common/WithSellerData";
import SellerDashboard from "./dashboard/SellerDashboard";
import SellerExchanges from "./exchanges/SellerExchanges";
import SellerFinances from "./finances/SellerFinances";
import SellerProducts from "./products/SellerProducts";
import { ProfileDetails } from "./profileDetails/ProfileDetails";
import { SalesChannels } from "./salesChannels/SalesChannels";
import { SellerInsideProps } from "./SellerInside";

export const DEFAULT_SELLER_PAGE = "dashboard";

export const sellerPageTypes = {
  dashboard: {
    url: DEFAULT_SELLER_PAGE,
    label: "Dashboard",
    icon: GridFour,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerDashboard {...props} />
    ),
    withoutWrapper: true
  },
  products: {
    url: "products",
    label: "Products",
    icon: Storefront,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerProducts {...props} />
    )
  },
  exchanges: {
    url: "exchanges",
    label: "Exchanges",
    icon: ArrowsLeftRight,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerExchanges {...props} />
    )
  },
  messages: {
    url: "messages",
    label: "Messages",
    icon: Chats,
    externalPath: BosonRoutes.Chat,
    component: () => <Navigate replace to={{ pathname: BosonRoutes.Chat }} />
  },
  finances: {
    url: "finances",
    label: "Finances",
    icon: Bank,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerFinances {...props} />
    )
  },
  salesChannels: {
    url: "salesChannels",
    label: "Sales Channels",
    icon: Megaphone,
    externalPath: null,
    component: () => <SalesChannels />,
    withoutWrapper: true
  },
  profileDetails: {
    url: "profileDetails",
    label: "Profile Details",
    icon: User,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <ProfileDetails {...props} />
    ),
    withoutWrapper: true
  }
};
