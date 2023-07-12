import React from "react";
import { RouteProps } from "react-router";

import { CONFIG } from "../lib/config";
import { ViewMode } from "../lib/viewMode";
import ViewModePage from "../pages/viewmode/ViewModePage";
import dappRoutes from "./dappRoutes";
import drCenterRoutes from "./drCenterRoutes";

export const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false,
  withBosonStyles: true,
  withBanner: false
} as const;
const base = {
  component: null,
  index: false,
  app: baseAppProps,
  role: []
} as const;

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
const viewMode = CONFIG.viewMode.current;

const viewModeRoutes = {
  [ViewMode.DAPP]: dappRoutes,
  [ViewMode.DR_CENTER]: drCenterRoutes,
  [ViewMode.BOTH]: [
    {
      ...base,
      app: {
        withLayout: true,
        withFooter: false,
        fluidHeader: false,
        withBosonStyles: true,
        withBanner: false
      },
      index: true,
      path: "/",
      component: ViewModePage
    },
    ...dappRoutes,
    ...drCenterRoutes
  ]
} as const;

export default viewModeRoutes[viewMode];
