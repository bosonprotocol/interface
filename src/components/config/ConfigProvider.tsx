import {
  ConfigProvider as BosonConfigProvider,
  ProtocolConfig
} from "@bosonprotocol/react-kit";
import { MagicProvider } from "components/magicLink/MagicContext";
import {
  CONFIG,
  defaultEnvConfig,
  envConfigsFilteredByEnv,
  getDappConfig
} from "lib/config";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { ReactNode, useEffect, useState } from "react";

import { Context, useConfigContext } from "./ConfigContext";

type ConfigProviderProps = {
  children: ReactNode;
};

function SyncCurrentConfigId({
  children
}: Pick<ConfigProviderProps, "children">) {
  const chainId = useChainId();
  const { setEnvConfig } = useConfigContext();
  useEffect(() => {
    const newEnvConfig = envConfigsFilteredByEnv.find(
      (envConfig) => envConfig.chainId === chainId
    );
    if (newEnvConfig) {
      setEnvConfig(newEnvConfig);
    }
  }, [chainId, setEnvConfig]);
  return <>{children}</>;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [envConfig, setEnvConfig] = useState<ProtocolConfig>(defaultEnvConfig);
  const dappConfig = getDappConfig(envConfig || defaultEnvConfig);
  return (
    <Context.Provider value={{ config: dappConfig, setEnvConfig }}>
      <BosonConfigProvider
        dateFormat={CONFIG.dateFormat}
        {...{
          configId: dappConfig.envConfig.configId,
          envName: dappConfig.envName,
          shortDateFormat: CONFIG.shortDateFormat,
          infuraKey: CONFIG.infuraKey,
          walletConnectProjectId: CONFIG.walletConnect.projectId,
          defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
          defaultCurrencyTicker: CONFIG.defaultCurrency.ticker,
          licenseTemplate: CONFIG.rNFTLicenseTemplate,
          minimumDisputeResolutionPeriodDays: CONFIG.minimumDisputePeriodInDays,
          contactSellerForExchangeUrl: "",
          withExternalConnectionProps: true,
          withReduxProvider: false,
          withWeb3React: false,
          withCustomReduxContext: false
        }}
      >
        <MagicProvider>
          <SyncCurrentConfigId>{children}</SyncCurrentConfigId>
        </MagicProvider>
      </BosonConfigProvider>
    </Context.Provider>
  );
}
