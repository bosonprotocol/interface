import { hooks } from "@bosonprotocol/react-kit";
import { providers } from "ethers";

import { CONFIG } from "../config";
import { useEthersSigner } from "./hooks/ethers/useEthersSigner";

export function useCoreSDK() {
  const signer = useEthersSigner();
  return hooks.useCoreSdk({
    ...CONFIG,
    web3Provider: signer?.provider as providers.Web3Provider
  });
}
