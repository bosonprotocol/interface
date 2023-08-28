import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import {
  defaultEnvConfig,
  envConfigsFilteredByEnv,
  getDappConfig
} from "lib/config";
import { ReactNode, useEffect, useState } from "react";

import { Context, useConfigContext } from "./ConfigContext";

export type ConfigProviderProps = {
  children: ReactNode;
};

function SyncCurrentConfigId({
  children
}: Pick<ConfigProviderProps, "children">) {
  const { chainId } = useWeb3React();
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
  console.log("configId", envConfig.configId); // TODO: remove
  return (
    <Context.Provider value={{ config: dappConfig, setEnvConfig }}>
      <SyncCurrentConfigId>{children}</SyncCurrentConfigId>
    </Context.Provider>
  );
}
