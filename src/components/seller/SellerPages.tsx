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
import { WithSellerDataProps } from "./common/WithSellerData";
import SellerDashboard from "./dashboard/SellerDashboard";
import SellerExchanges from "./exchanges/SellerExchanges";
import SellerFinances from "./finances/SellerFinances";
import SellerProducts from "./products/SellerProducts";
import { ProfileDetails } from "./profileDetails/ProfileDetails";
import { SalesChannels } from "./salesChannels/SalesChannels";
import { SellerInsideProps } from "./SellerInside";

export const DEFAULT_SELLER_PAGE = SellerCenterSubRoutes.Dashboard;

// type Label = keyof typeof SellerCenterSubRoutes;
// type Url = typeof SellerCenterSubRoutes[Label];
// type SellerPageTypes = Record<
//   Url,
//   {
//     url: Url;
//     label: Label;
//     icon: React.ForwardRefExoticComponent<
//       IconProps & React.RefAttributes<SVGSVGElement>
//     >;
//     externalPath: string | null;
//     component: (props: SellerInsideProps & WithSellerDataProps) => JSX.Element;
//     withoutWrapper?: boolean;
//   }
// >;

export const sellerPageTypes = {
  dashboard: {
    url: SellerCenterSubRoutes.Dashboard,
    label: "Dashboard",
    icon: GridFour,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerDashboard {...props} />
    ),
    withoutWrapper: true
  },
  products: {
    url: SellerCenterSubRoutes.Products,
    label: "Products",
    icon: Storefront,
    externalPath: null,
    component: SellerProducts
  },
  exchanges: {
    url: SellerCenterSubRoutes.Exchanges,
    label: "Exchanges",
    icon: ArrowsLeftRight,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
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
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <SellerFinances {...props} />
    )
  },
  salesChannels: {
    url: SellerCenterSubRoutes["Sales Channels"],
    label: "Sales Channels",
    icon: Megaphone,
    externalPath: null,
    component: () => <SalesChannels />,
    withoutWrapper: true
  },
  profileDetails: {
    url: SellerCenterSubRoutes["Profile Details"],
    label: "Profile Details",
    icon: User,
    externalPath: null,
    component: (props: SellerInsideProps & WithSellerDataProps) => (
      <ProfileDetails {...props} />
    ),
    withoutWrapper: true
  }
};
