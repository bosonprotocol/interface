import { initialValues, StoreFields } from "./store-fields";
import { useCustomStoreQueryParameter } from "./useCustomStoreQueryParameter";

export const useIsCustomStoreValueChanged = (key: keyof StoreFields) => {
  const value = useCustomStoreQueryParameter(key);
  return !value ? false : value !== initialValues[key];
};
