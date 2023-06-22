import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { getKeepStoreFieldsQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

export type LinkWithQueryProps = {
  children: ReactNode;
  to: string;
  state?: Record<string, unknown>;
  search?: Parameters<typeof getKeepStoreFieldsQueryParams>[1];
} & Parameters<typeof Link>[0];
export const LinkWithQuery = ({
  children,
  to,
  state,
  search,
  ...props
}: LinkWithQueryProps) => {
  const location = useLocation();
  const searchWithStoreFields = getKeepStoreFieldsQueryParams(location, search);
  return (
    <Link
      to={{
        pathname: to,
        search: searchWithStoreFields
      }}
      state={{ ...state, prevPath: location.pathname }}
      {...props}
    >
      {children}
    </Link>
  );
};
