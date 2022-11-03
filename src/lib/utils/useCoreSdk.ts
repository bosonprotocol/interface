import { hooks } from "@bosonprotocol/react-kit";

import { CONFIG } from "../config";

export function useCoreSDK() {
  // const { data: signer } = useSigner();
  return hooks.useCoreSdk({
    ...CONFIG
    // web3Provider: signer?.provider as providers.Web3Provider
  });
}
