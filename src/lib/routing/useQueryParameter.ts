import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useQueryParameter(
  key: string
): [string, (value: string) => void] {
  const [searchParameter, setSearchParameter] = useSearchParams();

  const setSearchParameterForKey = useCallback(
    (value: string) => {
      const queryObj = Object.fromEntries(searchParameter.entries());
      setSearchParameter({ ...queryObj, [key]: value });
    },
    [key]
  );

  return [searchParameter.get(key) || "", setSearchParameterForKey];
}
