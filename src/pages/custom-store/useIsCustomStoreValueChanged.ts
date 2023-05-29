import { initialValues } from "./store-fields";
import { StoreFields } from "./store-fields-types";
import { useCustomStoreQueryParameter } from "./useCustomStoreQueryParameter";

export const useIsCustomStoreValueChanged = (key: keyof StoreFields) => {
  const value = useCustomStoreQueryParameter(key);
  return !value
    ? false
    : value !== initialValues[key as keyof typeof initialValues];
};
