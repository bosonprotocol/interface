import {
  Navigate as ReactRouterDomNavigate,
  Path,
  useLocation
} from "react-router-dom";

import { getKeepStoreFieldsQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

type NavigateProps = Omit<Parameters<typeof ReactRouterDomNavigate>[0], "to"> &
  Required<{ to: Partial<Path> }> & {
    search?: Parameters<typeof getKeepStoreFieldsQueryParams>[1];
  };

export default function Navigate({ search, ...props }: NavigateProps) {
  const location = useLocation();
  const searchWithStoreFields = getKeepStoreFieldsQueryParams(location, search);
  return (
    <ReactRouterDomNavigate
      {...props}
      to={{
        ...props.to,
        search: searchWithStoreFields
      }}
      state={{ ...props.state, prevPath: location.pathname }}
    />
  );
}
