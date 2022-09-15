import { useCallback, useEffect, useState } from "react";

import { getDefaultTokens } from "../../lib/config";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useTokens } from "../../lib/utils/hooks/useTokens";
import { useUniswapPools } from "../../lib/utils/hooks/useUniswapPools";
import ConvertionRateContext, {
  ConvertionRateContextType,
  initalState,
  Store
} from "./ConvertionRateContext";
import { handleRates } from "./utils";

interface Props {
  children: React.ReactNode;
}
const REFETCH_INTERVAL = 1000 * 60 * 3;
export default function ConvertionRateProvider({ children }: Props) {
  const defaultTokens = getDefaultTokens();
  const [store, setStore] = useState(initalState.store);
  const { data: tokens, isLoading: isTokensLoading } = useTokens();
  const { data, isLoading, refetch } = useUniswapPools({
    tokens: !isTokensLoading && (defaultTokens || tokens || [])
  });

  const updateProps = useCallback((store: Store) => {
    setStore({
      ...store
    });
  }, []);

  useEffect(() => {
    if (!isTokensLoading) {
      const appTokens = defaultTokens || tokens || [];
      updateProps({ ...store, tokens: appTokens });
    }
  }, [isTokensLoading]); //eslint-disable-line

  useEffect(() => {
    if (data) {
      const rates = handleRates(data);
      saveItemInStorage("convertionRates", rates);
      updateProps({ ...store, rates, isLoading });
    } else {
      updateProps({ ...store, isLoading });
    }
  }, [data, isLoading]); //eslint-disable-line

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [refetch]);

  const value: ConvertionRateContextType = {
    store,
    updateProps
  };

  return (
    <ConvertionRateContext.Provider value={value}>
      {children}
    </ConvertionRateContext.Provider>
  );
}
