import { useConfigContext } from "components/config/ConfigContext";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { SellerLandingPageParameters } from "../../../lib/routing/parameters";
import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { getOptionsCurrencies } from "./const";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

const MAIN_KEY = "create-product";
export function useInitialValues() {
  const { config } = useConfigContext();
  const [searchParams] = useSearchParams();
  const isTokenGated = searchParams.get(
    SellerLandingPageParameters.sltokenGated
  );
  const initialValues = useMemo(
    () => getItemFromStorage<CreateProductForm | null>(MAIN_KEY, null),
    []
  );
  const cloneBaseValues = useMemo(
    () =>
      structuredClone({
        ...baseValues,
        coreTermsOfSale: {
          ...baseValues.coreTermsOfSale,
          currency: getOptionsCurrencies(config.envConfig)[0]
        }
      }),
    [config.envConfig]
  );
  const cloneInitialValues = useMemo(
    () =>
      initialValues
        ? structuredClone(initialValues)
        : ({} as Partial<NonNullable<typeof initialValues>>),
    [initialValues]
  );

  if (isTokenGated) {
    if (cloneBaseValues.productType) {
      cloneBaseValues.productType.tokenGatedOffer = "true";
    }
    if (cloneInitialValues.productType) {
      cloneInitialValues.productType.tokenGatedOffer = "true";
    }
  }

  return {
    shouldDisplayModal: cloneInitialValues !== null,
    base: cloneBaseValues,
    draft: cloneInitialValues,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    clear: clearLocalStorage,
    key: MAIN_KEY
  };
}
