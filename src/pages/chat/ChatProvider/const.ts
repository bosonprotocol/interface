import { DappConfig } from "lib/config";

export const getChatEnvName = (dappConfig: DappConfig) =>
  `bosonprotocol-${dappConfig.envName}-${dappConfig.envConfig.contracts.protocolDiamond}`.toLowerCase();
