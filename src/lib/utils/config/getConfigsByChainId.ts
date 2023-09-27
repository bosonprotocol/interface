import { ProtocolConfig } from "@bosonprotocol/react-kit";
import { envConfigsFilteredByEnv } from "lib/config";

export const getConfigsByChainId = (
  chainId: number | undefined | null
): ProtocolConfig[] | null => {
  if (!chainId) {
    return null;
  }
  return envConfigsFilteredByEnv.filter((config) => config.chainId === chainId);
};
