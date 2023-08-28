import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { defaultEnvConfig, getDappConfig } from "lib/config";
import { ReactNode, useState } from "react";

import { Context } from "./ConfigContext";

export type ConfigProviderProps = {
  children: ReactNode;
};

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [envConfig, setEnvConfig] = useState<ProtocolConfig>(defaultEnvConfig);
  const dappConfig = getDappConfig(envConfig || defaultEnvConfig);
  console.log("configId", envConfig.configId); // TODO: remove
  return (
    <Context.Provider value={{ config: dappConfig, setEnvConfig }}>
      {children}
    </Context.Provider>
  );
}
