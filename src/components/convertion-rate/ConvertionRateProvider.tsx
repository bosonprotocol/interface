import { useCallback, useEffect, useMemo, useState } from "react";

import { getDefaultTokens } from "../../lib/config";
import { saveItemInStorage } from "../../lib/utils/hooks/useLocalStorage";
import { useTokens } from "../../lib/utils/hooks/useTokens";
import { useUniswapPools } from "../../lib/utils/hooks/useUniswapPools";
import ConvertionRateContext, {
  ConvertionRateContextType,
  initalState,
  Store,
  Token
} from "./ConvertionRateContext";
import { handleRates } from "./utils";

interface Props {
  children: React.ReactNode;
}
export default function ConvertionRateProvider({ children }: Props) {
  const defaultTokens = getDefaultTokens();
  const [store, setStore] = useState(initalState.store);
  const { data: tokens, isLoading: isTokensLoading } = useTokens({
    enabled: defaultTokens.length > 0
  });
  const appTokens = useMemo(
    () =>
      defaultTokens.length > 0 ? defaultTokens : ((tokens || []) as Token[]),
    [tokens, defaultTokens]
  );

  const { data } = useUniswapPools({
    tokens: !isTokensLoading && appTokens?.length > 0 ? appTokens : []
  });

  const updateProps = useCallback((store: Store) => {
    setStore({
      ...store
    });
  }, []);

  useEffect(() => {
    if (appTokens && store?.tokens === null) {
      updateProps({
        ...store,
        tokens: appTokens
      });
    }
  }, [isTokensLoading, store?.tokens]); //eslint-disable-line

  useEffect(() => {
    if (data && store?.isLoading === true) {
      const rates = handleRates(data);
      saveItemInStorage("convertionRates", rates);
      updateProps({ ...store, rates, isLoading: false });
    }
  }, [data]); //eslint-disable-line

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
