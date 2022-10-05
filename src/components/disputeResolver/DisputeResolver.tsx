import { GridFour, Storefront } from "phosphor-react";
import React from "react";

import { DisputeResolverProps } from "./DisputeResolverInside";
import { DisputesManage } from "./pages/DisputesManage";
import { DisputeWhiteList } from "./pages/DisputeWhiteList";

export const DEFAULT_DR_PAGE = "disputes";

export const drPageTypes = {
  whitelist: {
    url: "whitelist",
    label: "Manage Whitelist",
    icon: GridFour,
    component: (props: DisputeResolverProps) => <DisputeWhiteList {...props} />
  },
  disputes: {
    url: "disputes",
    label: "Manage Disputes",
    icon: Storefront,
    component: (props: DisputeResolverProps) => <DisputesManage {...props} />
  }
};

export type DrPageTypes = keyof typeof drPageTypes;

export type DisputeResolverPage = {
  url: string;
  label: string;
  icon: React.ReactNode | JSX.Element;
  component: React.ReactNode | JSX.Element;
  withoutWrapper?: boolean;
};

export type DisputeResolverPages = {
  [x in keyof DrPageTypes]: DisputeResolverPage;
};

export const DisputeResolverPages = (type: string | undefined) => {
  return () =>
    drPageTypes[(type || DEFAULT_DR_PAGE) as keyof typeof drPageTypes];
};
