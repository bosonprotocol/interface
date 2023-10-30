import { isSupportedChain } from "lib/constants/chains";

import { useChainId } from "./connection/connection";

export default function useAutoRouterSupported(): boolean {
  const chainId = useChainId();
  return isSupportedChain(chainId);
}
