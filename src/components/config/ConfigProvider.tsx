import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { MagicProvider } from "components/magicLink/MagicContext";
import { UserProvider } from "components/magicLink/UserContext";
import {
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
      <MagicProvider>
        <UserProvider>
          <SyncCurrentConfigId>{children}</SyncCurrentConfigId>
        </UserProvider>
      </MagicProvider>
    </Context.Provider>
  );
}
