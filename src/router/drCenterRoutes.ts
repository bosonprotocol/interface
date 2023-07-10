import React, { lazy } from "react";
import { RouteProps } from "react-router";

import { DrCenterRoutes } from "../lib/routing/drCenterRoutes";

const ChatPage = lazy(() => import("../pages/chat/Chat"));
const DisputeCenterPage = lazy(
  () => import("../pages/dispute-centre/DisputeCenterPage")
);
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));
const RaiseDisputePage = lazy(
  () => import("../pages/dispute-centre/RaiseDisputePage")
);

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
    component: DisputeCenterPage,
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: `${DrCenterRoutes.DisputeId}/*`,
    component: RaiseDisputePage,
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: `${DrCenterRoutes.Chat}/*`,
    component: ChatPage,
    app: {
      ...base.app,
      withLayout: false,
      withFooter: false
    },
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
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
