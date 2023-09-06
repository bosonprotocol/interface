import { useWeb3React } from "@web3-react/core";
import { isSupportedChain } from "lib/constants/chains";

export default function useAutoRouterSupported(): boolean {
  const { chainId } = useWeb3React();
  return isSupportedChain(chainId);
}
