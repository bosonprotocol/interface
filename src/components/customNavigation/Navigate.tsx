import {
  Navigate as ReactRouterDomNavigate,
  Path,
  useLocation
} from "react-router-dom";

import { getKeptQueryParams } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

type NavigateProps = Omit<Parameters<typeof ReactRouterDomNavigate>[0], "to"> &
  Required<{ to: Partial<Path> }> & {
    search?: Parameters<typeof getKeptQueryParams>[1];
  };

export default function Navigate({ search, ...props }: NavigateProps) {
  const location = useLocation();
  const searchWithKeptQueryParams = getKeptQueryParams(location, search);
  return (
    <ReactRouterDomNavigate
      {...props}
      to={{
        ...props.to,
        search: searchWithKeptQueryParams
      }}
      state={{ ...props.state, prevPath: location.pathname }}
    />
  );
}
