import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { providers } from "ethers";

import { Config, coreSdkConfig } from "../config";

export function useCoreSDK() {
  const defaultProvider = getDefaultProvider(coreSdkConfig.jsonRpcUrl);
  return initCoreSDK(defaultProvider, coreSdkConfig);
}

function getDefaultProvider(jsonRpcUrl: string) {
  return new providers.JsonRpcProvider(jsonRpcUrl);
}

function initCoreSDK(provider: providers.JsonRpcProvider, config: Config) {
  return new CoreSDK({
    web3Lib: new EthersAdapter(provider),
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
