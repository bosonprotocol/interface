import { lazy } from "react";

import { CONFIG } from "../lib/config";
import { ViewMode } from "../lib/viewMode";
import ViewModePage from "../pages/viewmode/ViewModePage";
import dappRoutes from "./dappRoutes";
import drCenterRoutes from "./drCenterRoutes";
import { IRoutes } from "./types";
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));

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

const viewMode = CONFIG.envViewMode.current;

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
    ...drCenterRoutes,
    {
      ...base,
      exact: false,
      path: "*",
      app: {
        ...base.app,
        withBosonStyles: false
      },
      component: NotFoundPage
    }
  ] as IRoutes[]
} as const;

export default viewModeRoutes[viewMode];
