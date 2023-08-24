import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { envConfigs, getDappConfig } from "lib/config";
import { ReactNode, useState } from "react";

import { Context } from "./ConfigContext";

export type ConfigProviderProps = {
  children: ReactNode;
};

const [defaultEnvConfig] = envConfigs;
export function ConfigProvider({ children }: ConfigProviderProps) {
  const [envConfig, setEnvConfig] = useState<ProtocolConfig>(defaultEnvConfig);
  const dappConfig = getDappConfig(envConfig || defaultEnvConfig);
  console.log(envConfig.configId); // TODO: remove
  return (
    <Context.Provider value={{ config: dappConfig, setEnvConfig }}>
      {children}
    </Context.Provider>
  );
}
