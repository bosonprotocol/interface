import type { DappConfig } from "lib/config";
import { createContext, useContext } from "react";

export type ConfigContextProps = DappConfig;

export const Context = createContext<ConfigContextProps | null>(null);

export const useConfigContext = () => {
  const contextValue = useContext(Context);
  if (!contextValue) {
    throw new Error(
      "You need to use ConfigProvider before using useConfigContext"
    );
  }
  return contextValue;
};
