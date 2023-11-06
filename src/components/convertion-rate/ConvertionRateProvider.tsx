import { useConfigContext } from "components/config/ConfigContext";
import { useCallback, useEffect, useMemo, useState } from "react";

import { saveItemInStorage } from "../../lib/utils/hooks/localstorage/useLocalStorage";
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

export default function ConvertionRateProviderWrapper({ children }: Props) {
  const { config } = useConfigContext();
  return (
    <ConvertionRateProvider key={config.envConfig.configId}>
      {children}
    </ConvertionRateProvider>
  );
}

function ConvertionRateProvider({ children }: Props) {
  const { config } = useConfigContext();
  const defaultTokens = useMemo(
    () => config.envConfig.defaultTokens || [],
    [config.envConfig.defaultTokens]
  );
  const [store, setStore] = useState(initalState.store);
  const { data: tokens, isLoading: isTokensLoading } = useTokens({
    enabled: defaultTokens.length > 0
  });
  const appTokens = useMemo(
    () =>
      defaultTokens.length > 0 ? defaultTokens : ((tokens || []) as Token[]),
    [tokens, defaultTokens]
  );

  const { data, isSuccess } = useUniswapPools({
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
    if (isSuccess && store?.isLoading === true) {
      const rates = handleRates(data, appTokens);
      saveItemInStorage("convertionRates", rates);
      updateProps({ ...store, rates, isLoading: false });
    }
  }, [data, isSuccess]); //eslint-disable-line

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
