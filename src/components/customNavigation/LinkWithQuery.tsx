import { Link, useLocation } from "react-router-dom";

import { getKeepStoreFieldsQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

type Props = {
  children: string | JSX.Element;
  to: string;
  state?: Record<string, unknown>;
  [x: string]: unknown;
} & Parameters<typeof Link>[0];
export const LinkWithQuery = ({ children, to, state, ...props }: Props) => {
  const location = useLocation();
  // TODO: doesnt currently support passing query params in the 'to' parameter
  const search = getKeepStoreFieldsQueryParams(location, null);
  return (
    <Link
      to={{
        pathname: to,
        search
      }}
      state={{ ...state, prevPath: location.pathname }}
      {...props}
    >
      {children}
    </Link>
  );
};
