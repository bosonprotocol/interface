import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { providers } from "ethers";
import { useMemo, useState } from "react";
import { useSigner } from "wagmi";

import { Config, coreSdkConfig } from "../config";

export function useCoreSDK() {
  const { data: signer } = useSigner();
  const [coreSdk, setCoreSdk] = useState<CoreSDK>();
  const ethersAdapter = useMemo(() => {
    if (!signer || !signer.provider) {
      return;
    }

    const adapter = new EthersAdapter(
      signer.provider as providers.Web3Provider
    );

    return adapter;
  }, [signer]);

  return useMemo(() => {
    if (!ethersAdapter) return null;
    if (coreSdk) return coreSdk;
    const core = initCoreSDK(coreSdkConfig, ethersAdapter);
    setCoreSdk(core);
    return core;
  }, [ethersAdapter, coreSdk]);
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
