import { useSearchParams } from "react-router-dom";

import { StoreFields } from "./store-fields";

export function useCustomStoreQueryParameter(key: keyof StoreFields): string {
  const [searchParameter] = useSearchParams();

  return searchParameter.get(key) || "";
}
