import {
  ArrowsLeftRight,
  Bank,
  Chats,
  GridFour,
  Megaphone,
  Storefront,
  User
} from "phosphor-react";

import { BosonRoutes, SellerCenterSubRoutes } from "../../lib/routing/routes";
import Navigate from "../customNavigation/Navigate";
import SellerDashboard from "./dashboard/SellerDashboard";
import SellerExchanges from "./exchanges/SellerExchanges";
import SellerFinances from "./finances/SellerFinances";
import SellerProducts from "./products/SellerProducts";
import { ProfileDetails } from "./profileDetails/ProfileDetails";
import { SalesChannels } from "./salesChannels/SalesChannels";

export const DEFAULT_SELLER_PAGE = SellerCenterSubRoutes.Dashboard;

export const sellerPageTypes = {
  dashboard: {
    url: SellerCenterSubRoutes.Dashboard,
    label: "Dashboard",
    icon: GridFour,
    externalPath: null,
    component: (props: Parameters<typeof SellerDashboard>[0]) => (
      <SellerDashboard {...props} />
    ),
    withoutWrapper: true
  },
  products: {
    url: SellerCenterSubRoutes.Products,
    label: "Products",
    icon: Storefront,
    externalPath: null,
    component: (props: Parameters<typeof SellerProducts>[0]) => (
      <SellerProducts {...props} />
    )
  },
  exchanges: {
    url: SellerCenterSubRoutes.Exchanges,
    label: "Exchanges",
    icon: ArrowsLeftRight,
    externalPath: null,
    component: (props: Parameters<typeof SellerExchanges>[0]) => (
      <SellerExchanges {...props} />
    )
  },
  messages: {
    url: SellerCenterSubRoutes.Messages,
    label: "Messages",
    icon: Chats,
    externalPath: BosonRoutes.Chat,
    component: () => <Navigate replace to={{ pathname: BosonRoutes.Chat }} />
  },
  finances: {
    url: SellerCenterSubRoutes.Finances,
    label: "Finances",
    icon: Bank,
    externalPath: null,
    component: (props: Parameters<typeof SellerFinances>[0]) => (
      <SellerFinances {...props} />
    )
  },
  salesChannels: {
    url: SellerCenterSubRoutes["Sales Channels"],
    label: "Sales Channels",
    icon: Megaphone,
    externalPath: null,
    component: (props: Parameters<typeof SalesChannels>[0]) => (
      <SalesChannels {...props} />
    ),
    withoutWrapper: true
  },
  profileDetails: {
    url: SellerCenterSubRoutes["Profile Details"],
    label: "Profile Details",
    icon: User,
    externalPath: null,
    component: (props: Parameters<typeof ProfileDetails>[0]) => (
      <ProfileDetails {...props} />
    ),
    withoutWrapper: true
  }
};
