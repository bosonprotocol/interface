import { getEnvConfigs } from "@bosonprotocol/react-kit";
import { envName, getDappConfig } from "lib/config";
import { ReactNode } from "react";

import { Context } from "./ConfigContext";

export type ConfigProviderProps = {
  children: ReactNode;
};
export function ConfigProvider({ children }: ConfigProviderProps) {
  const envConfigs = getEnvConfigs(envName);
  const [defaultEnvConfig] = envConfigs;
  const config = getDappConfig(defaultEnvConfig);
  return <Context.Provider value={config}>{children}</Context.Provider>;
}
