import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

export default function useSearchParams() {
  const navigate = useKeepQueryParamsNavigate();
  const location = useLocation();
  const [params, setParams] = useState(qs.parse(location.search));

  const handleChange = useCallback(
    (name: string, value: string) => {
      const oldParams = qs.parse(location.search);

      const newParams = {
        ...oldParams,
        [name]: value
      };
      setParams(newParams);
    },
    [location.search]
  );

  useEffect(() => {
    navigate({
      pathname: location.pathname,
      search: qs.stringify(params)
    });
  }, [params]); // eslint-disable-line

  useEffect(() => {
    setParams(qs.parse(location.search));
  }, [location.search]); // eslint-disable-line

  return {
    params,
    handleChange
  };
}
