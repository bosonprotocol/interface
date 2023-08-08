import { AnchorHTMLAttributes, forwardRef, ReactNode } from "react";

import {
  getCurrentViewMode,
  getViewModeUrl,
  ViewMode
} from "../../lib/viewMode";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";

type ViewModeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  destinationViewMode: ViewMode.DAPP | ViewMode.DR_CENTER;
  children?: ReactNode;
  href: `/${string}`;
};
export const ViewModeLink = forwardRef<HTMLAnchorElement, ViewModeLinkProps>(
  ({ destinationViewMode, children, href, ...rest }, ref) => {
    const isDestinationSameAsCurrentViewMode =
      destinationViewMode === getCurrentViewMode();
    if (isDestinationSameAsCurrentViewMode) {
      return (
        <LinkWithQuery to={href} {...rest} ref={ref}>
          {children}
        </LinkWithQuery>
      );
    }
    return (
      <a href={getViewModeUrl(ViewMode.DAPP, href)} {...rest} ref={ref}>
        {children}
      </a>
    );
  }
);
