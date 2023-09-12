import { getChainInfo, NetworkType } from "lib/constants/chainInfo";
import { SupportedL2ChainId } from "lib/constants/chains";

export function isL2ChainId(
  chainId: number | undefined
): chainId is SupportedL2ChainId {
  const chainInfo = getChainInfo(chainId);
  return chainInfo?.networkType === NetworkType.L2;
}
