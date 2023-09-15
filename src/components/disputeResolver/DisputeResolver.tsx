import { GridFour, Storefront } from "phosphor-react";

import { DisputeResolverProps } from "./DisputeResolverInside";
import { DisputesManage } from "./pages/DisputesManage";
import { DisputeWhiteList } from "./pages/DisputeWhiteList";

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
