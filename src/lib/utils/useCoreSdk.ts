import { hooks } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { providers } from "ethers";

import { useEthersSigner } from "./hooks/ethers/useEthersSigner";

export function useCoreSDK() {
  const signer = useEthersSigner();
  const { config } = useConfigContext();
  return hooks.useCoreSdk({
    ...config.envConfig,
    web3Provider: signer?.provider as providers.Web3Provider
  });
}
