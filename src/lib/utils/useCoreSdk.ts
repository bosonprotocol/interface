import { CoreSDK, hooks } from "@bosonprotocol/react-kit";
import { providers } from "ethers";
import { useSigner } from "wagmi";

import { CONFIG } from "../config";
let core: CoreSDK = null as unknown as CoreSDK;
export function useCoreSDK() {
  const { data: signer } = useSigner();
  if (!core) {
    core = hooks.useCoreSdk({
      ...CONFIG,
      web3Provider: signer?.provider as providers.Web3Provider
    });
  }
  return core;
}
