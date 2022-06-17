import { Link, useLocation } from "react-router-dom";

import { getKeepStoreFieldsQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

interface Props {
  children: string | JSX.Element;
  to: string;
  [x: string]: unknown;
}
export const LinkWithQuery = ({ children, to, ...props }: Props) => {
  const location = useLocation();
  // TODO: doesnt currently support passing query params in the 'to' parameter
  const search = getKeepStoreFieldsQueryParams(location, null);
  return (
    <Link to={`${to}?${search}`} {...props}>
      {children}
    </Link>
  );
};
