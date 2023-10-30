import { DappConfig } from "lib/config";

export const getChatEnvName = (dappConfig: DappConfig) =>
  `${dappConfig.envName}-${dappConfig.envConfig.contracts.protocolDiamond}`;
