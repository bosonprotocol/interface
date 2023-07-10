import React, { lazy } from "react";
import { RouteProps } from "react-router";

import { DrCenterRoutes } from "../lib/routing/drCenterRoutes";
import DrCenterPage from "../pages/drcenter/DrCenterPage";

const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));

const baseAppProps = {
  withLayout: true,
  withFooter: true,
  fluidHeader: false,
  withBosonStyles: true,
  withBanner: false
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
    withFooter?: boolean;
    fluidHeader?: boolean;
    withBosonStyles?: boolean;
    withBanner?: boolean;
  };
}

export default [
  {
    ...base,
    index: true,
    path: DrCenterRoutes.Root,
    component: DrCenterPage,
    app: {
      ...base.app,
      withBosonStyles: false
    }
  },
  {
    ...base,
    exact: false,
    path: DrCenterRoutes.Error404,
    app: {
      ...base.app,
      withBosonStyles: false
    },
    component: NotFoundPage
  }
] as IRoutes[];
