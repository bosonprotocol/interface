import { CoreSDK, hooks } from "@bosonprotocol/react-kit";
import { providers } from "ethers";
import { createContext } from "react";
import { useSigner } from "wagmi";

import { CONFIG } from "../lib/config";

export const CoreSDKContext = createContext<CoreSDK>(
  null as unknown as CoreSDK
);

interface Props {
  children: JSX.Element;
}
let core: CoreSDK = null as unknown as CoreSDK;
export default function CoreSDKProvider({ children }: Props) {
  const { data: signer } = useSigner();
  if (!core) {
    core = hooks.useCoreSdk({
      ...CONFIG,
      web3Provider: signer?.provider as providers.Web3Provider
    });
  }
  return (
    <CoreSDKContext.Provider value={core}>{children}</CoreSDKContext.Provider>
  );
}
