import { useSearchParams } from "react-router-dom";

export function useQueryParameter(
  key: string
): [string, (value: string) => void] {
  const [searchParameter, setSearchParameter] = useSearchParams();

  const setSearchParameterForKey = (value: string) => {
    searchParameter.set(key, value);
    setSearchParameter(searchParameter);
  };

  return [searchParameter.get(key) || "", setSearchParameterForKey];
}
