import { useCallback, useRef } from "react";
import {
  NavigateOptions,
  Path,
  useLocation,
  useNavigate
} from "react-router-dom";

import { storeFields } from "../../../pages/custom-store/store-fields";
import {
  configQueryParameters,
  SellerLandingPageParameters
} from "../../routing/parameters";

const deleteNonEssentialQueryParams = (
  urlParams: URLSearchParams,
  options: { removeSellerLandingQueryParams?: boolean } = {}
) => {
  Array.from(urlParams.keys()).forEach((queryParamKey) => {
    const isStoreField =
      !!storeFields[queryParamKey as keyof typeof storeFields];
    const isSellerLandingQueryParam =
      !!SellerLandingPageParameters[
        queryParamKey as keyof typeof SellerLandingPageParameters
      ];
    const isConfigQueryParam =
      !!configQueryParameters[
        queryParamKey as keyof typeof configQueryParameters
      ];
    if (
      !isStoreField &&
      (!isSellerLandingQueryParam || options.removeSellerLandingQueryParams) &&
      !isConfigQueryParam
    ) {
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

export const getKeptQueryParams = (
  location: ReturnType<typeof useLocation>,
  toSearch: ConstructorParameters<typeof URLSearchParams>[0],
  options: { removeSellerLandingQueryParams?: boolean } = {}
) => {
  const urlParams = new URLSearchParams(location.search);
  deleteNonEssentialQueryParams(urlParams, options);

  const newQueryParams = new URLSearchParams(toSearch || "");
  addNewParams(newQueryParams, urlParams);

  return urlParams.toString();
};

export type To = Omit<Partial<Path>, "search"> & {
  search?: Parameters<typeof getKeptQueryParams>[1];
};
export function useKeepQueryParamsNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  return useCallback(
    (
      to: To,
      options?: NavigateOptions & { removeSellerLandingQueryParams?: boolean }
    ) => {
      const search = getKeptQueryParams(locationRef.current, to.search, {
        removeSellerLandingQueryParams: options?.removeSellerLandingQueryParams
      });
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
