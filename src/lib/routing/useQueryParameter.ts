import { NavigateOptions, useSearchParams } from "react-router-dom";

export function useQueryParameter(
  key: string
): [
  string | null,
  (value: string | null, options?: NavigateOptions | undefined) => void
] {
  const [searchParameter, setSearchParameter] = useSearchParams();

  const setSearchParameterForKey = (
    value: string | null,
    options?: Parameters<typeof setSearchParameter>[1]
  ) => {
    if (value === null) {
      searchParameter.delete(key);
    } else {
      searchParameter.set(key, value);
    }
    setSearchParameter(searchParameter, options);
  };

  return [searchParameter.get(key) || "", setSearchParameterForKey];
}
