import { EnvironmentType } from "@bosonprotocol/react-kit";
import { DappConfig } from "lib/config";

export const getChatEnvName = (dappConfig: DappConfig) =>
  `${dappConfig.envName}-${dappConfig.envConfig.contracts.protocolDiamond}`.toLowerCase() as `${EnvironmentType}-0x123`;
