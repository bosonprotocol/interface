import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { useMemo } from "react";

import { useEthersAdapterFromContext } from "../../components/EthersAdapterContext";
import { Config, coreSdkConfig } from "../config";

export function useCoreSDK() {
  const ethersAdapter = useEthersAdapterFromContext();
  return useMemo(() => {
    if (!ethersAdapter) return null;
    const core = initCoreSDK(coreSdkConfig, ethersAdapter);
    return core;
  }, [ethersAdapter]);
}

function initCoreSDK(config: Config, ethersAdapter: EthersAdapter) {
  return new CoreSDK({
    web3Lib: ethersAdapter,
    protocolDiamond: config.protocolDiamond,
    subgraphUrl: config.subgraphUrl,
    theGraphStorage: IpfsMetadataStorage.fromTheGraphIpfsUrl(
      config.theGraphIpfsUrl
    ),
    metadataStorage: new IpfsMetadataStorage({
      url: config.ipfsMetadataUrl
    })
  });
}
