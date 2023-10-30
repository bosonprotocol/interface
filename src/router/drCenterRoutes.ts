import { lazy } from "react";

import { DrCenterRoutes } from "../lib/routing/drCenterRoutes";
import { IRoutes } from "./types";

const ChatPage = lazy(() => import("../pages/chat/Chat"));
const DisputeCenterPage = lazy(
  () => import("../pages/dispute-centre/DisputeCenterPage")
);
const NotFoundPage = lazy(() => import("../pages/not-found/NotFound"));
const RaiseDisputePage = lazy(
  () => import("../pages/dispute-centre/RaiseDisputePage")
);
const PrivacyPolicyPage = lazy(
  () => import("../pages/common/PrivacyPolicyDrCenter")
);
const TermsAndConditionsPage = lazy(
  () => import("../pages/common/TermsAndConditionsDrCenter")
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
      fluidHeader: true,
      withLayout: false,
      withFooter: false
    },
    role: [UserRoles.Buyer, UserRoles.Seller, UserRoles.DisputeResolver]
  },
  {
    ...base,
    path: DrCenterRoutes.PrivacyPolicy,
    app: {
      ...base.app
    },
    component: PrivacyPolicyPage
  },
  {
    ...base,
    path: DrCenterRoutes.TermsAndConditions,
    app: {
      ...base.app
    },
    component: TermsAndConditionsPage
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
