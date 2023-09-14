import { hooks } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { useConfigContext } from "components/config/ConfigContext";
import { createContext, useContext } from "react";

import { ExtendedCoreSDK } from "./types";

export const CoreSDKContext = createContext<ExtendedCoreSDK | null>(null);

export function useProviderCoreSDK() {
  const { provider } = useWeb3React();

  const { config } = useConfigContext();
  return hooks.useCoreSdk({
    ipfsMetadataStorageHeaders: config.ipfsMetadataStorageHeaders,
    configId: config.envConfig.configId,
    envName: config.envName,
    ipfsMetadataStorageUrl: config.ipfsMetadataStorageUrl,
    jsonRpcUrl: config.envConfig.jsonRpcUrl,
    lensContracts: config.lens,
    metaTx: config.metaTx,
    protocolDiamond: config.envConfig.contracts.protocolDiamond,
    subgraphUrl: config.envConfig.subgraphUrl,
    theGraphIpfsStorageHeaders: undefined,
    theGraphIpfsUrl: config.envConfig.theGraphIpfsUrl,
    web3Provider: provider
  });
}

export function useCoreSDKContext() {
  const context = useContext(CoreSDKContext);
  if (!context) {
    throw new Error(
      `useCoreSDKContext can only be used under 'CoreSDKContext'`
    );
  }
  return context;
}
