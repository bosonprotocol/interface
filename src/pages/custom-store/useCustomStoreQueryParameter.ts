import { useSearchParams } from "react-router-dom";

import { StoreFields } from "./store-fields";

interface Options {
  parseJson: boolean;
}

export function useCustomStoreQueryParameter<T = string>(
  key: keyof StoreFields,
  { parseJson }: Options = {} as Options
): T | string {
  const [searchParameter] = useSearchParams(window.location.search);
  if (parseJson) {
    try {
      const jsonValue = searchParameter.get(key);
      if (!jsonValue) {
        return "";
      }
      return JSON.parse(jsonValue);
    } catch (error) {
      console.error(error);
      return "";
    }
  }
  return searchParameter.get(key) || "";
}
