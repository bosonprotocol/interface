import {
  Navigate as ReactRouterDomNavigate,
  Path,
  useLocation
} from "react-router-dom";

import { getKeepStoreFieldsQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

type NavigateProps = Parameters<typeof ReactRouterDomNavigate>[0];

export default function Navigate(
  props: Omit<NavigateProps, "to"> & Required<{ to: Partial<Path> }>
) {
  const location = useLocation();
  // TODO: doesnt currently support passing query params in the 'to' parameter
  const search = getKeepStoreFieldsQueryParams(location, null);
  return (
    <ReactRouterDomNavigate
      {...props}
      to={{
        ...props.to,
        search
      }}
      state={{ ...props.state, prevPath: location.pathname }}
    />
  );
}
