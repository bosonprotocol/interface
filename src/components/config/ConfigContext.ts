import { ProtocolConfig } from "@bosonprotocol/react-kit";
import type { DappConfig } from "lib/config";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type ConfigContextProps = {
  config: DappConfig;
  setEnvConfig: Dispatch<SetStateAction<ProtocolConfig>>;
};

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
