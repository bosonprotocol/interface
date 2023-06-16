import { useCallback, useRef } from "react";
import {
  NavigateOptions,
  Path,
  useLocation,
  useNavigate
} from "react-router-dom";

import { storeFields } from "../../../pages/custom-store/store-fields";
import { SellerLandingPageParameters } from "../../routing/parameters";

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
    if (
      !isStoreField &&
      (!isSellerLandingQueryParam || options.removeSellerLandingQueryParams)
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

export const getKeepStoreFieldsQueryParams = (
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
  search?: Parameters<typeof getKeepStoreFieldsQueryParams>[1];
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
      const search = getKeepStoreFieldsQueryParams(
        locationRef.current,
        to.search,
        {
          removeSellerLandingQueryParams:
            options?.removeSellerLandingQueryParams
        }
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
