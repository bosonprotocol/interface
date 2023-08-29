import { hooks } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { providers } from "ethers";

import { useEthersSigner } from "./hooks/ethers/useEthersSigner";

export function useCoreSDK() {
  const signer = useEthersSigner();
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
    web3Provider: signer?.provider as providers.Web3Provider
  });
}
