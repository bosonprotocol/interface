import { Chain } from "../../graphqlData/__generated__/types-and-hooks";
import { supportedChainIdFromGQLChain } from "../../graphqlData/util";
import { nativeOnChain } from "../constants/tokens";

export function getNativeTokenDBAddress(chain: Chain): string | undefined {
  const pageChainId = supportedChainIdFromGQLChain(chain);
  if (pageChainId === undefined) {
    return undefined;
  }
  switch (chain) {
    case Chain.Celo:
    case Chain.Polygon:
      return nativeOnChain(pageChainId).wrapped.address;
    case Chain.Ethereum:
    case Chain.Arbitrum:
    case Chain.EthereumGoerli:
    case Chain.Optimism:
    default:
      return undefined;
  }
}
