import { useCallback, useRef } from "react";
import {
  NavigateOptions,
  Path,
  useLocation,
  useNavigate
} from "react-router-dom";

import { storeFields } from "../../../pages/custom-store/store-fields";

const deleteQueryParamsThatAreNotStoreFields = (urlParams: URLSearchParams) => {
  Array.from(urlParams.keys()).forEach((queryParamKey) => {
    const isStoreField =
      !!storeFields[queryParamKey as keyof typeof storeFields];
    if (!isStoreField) {
      urlParams.delete(queryParamKey);
    }
  });
};

const addNewParams = (
  newQueryParams: URLSearchParams,
  urlParams: URLSearchParams
) => {
  Array.from(newQueryParams.entries()).forEach(
    ([queryParamKey, queryParamValue]) => {
      const isStoreField =
        !!storeFields[queryParamKey as keyof typeof storeFields];
      if (!isStoreField) {
        urlParams.set(queryParamKey, queryParamValue);
      }
    }
  );
};

export const getKeepStoreFieldsQueryParams = (
  location: ReturnType<typeof useLocation>,
  toSearch: string | undefined | null
) => {
  const urlParams = new URLSearchParams(location.search);
  deleteQueryParamsThatAreNotStoreFields(urlParams);

  const newQueryParams = new URLSearchParams(toSearch || "");
  addNewParams(newQueryParams, urlParams);

  return urlParams.toString();
};

export function useKeepQueryParamsNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  return useCallback(
    (to: Partial<Path>, options?: NavigateOptions) => {
      const search = getKeepStoreFieldsQueryParams(
        locationRef.current,
        to.search
      );
      navigate(
        {
          ...to,
          search
        },
        {
          ...options,
          state: { ...options?.state, prevPath: location.pathname }
        }
      );
    },
    [locationRef, navigate, location]
  );
}
