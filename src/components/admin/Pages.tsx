import { ArrowsLeftRight, GridFour } from "phosphor-react";
import React from "react";

import Typography from "../ui/Typography";
import ManageDisputes from "./disputes/ManageDisputes";

export const DEFAULT_SELLER_PAGE = "dashboard";

interface SellerProps {
  sellerId: string;
}

export const pageTypes = {
  dashboard: {
    url: "dashboard",
    label: "Manage Whitelist",
    icon: GridFour,
    component: () => <Typography tag="h2">Cooming soon</Typography>
  },
  disputes: {
    url: "disputes",
    label: "Manage Disputes",
    icon: ArrowsLeftRight,
    component: ({ sellerId }: SellerProps) => (
      <ManageDisputes sellerId={sellerId} />
    )
  }
};

export type PageTypes = keyof typeof pageTypes;

export type Page = {
  url: string;
  label: string;
  icon: React.ReactNode | JSX.Element;
  component: React.ReactNode | JSX.Element;
  withoutWrapper?: boolean;
};

export type PagesProps = {
  [x in keyof PageTypes]: Page;
};

export const Pages = (type: string | undefined) => {
  return () =>
    pageTypes[(type || DEFAULT_SELLER_PAGE) as keyof typeof pageTypes];
};
