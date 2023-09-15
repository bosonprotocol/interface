import { ChainId } from "@uniswap/sdk-core";
import EthereumLogo from "assets/images/ethereum-logo.png";
import AvaxLogo from "assets/svg/avax_logo.svg";
import BnbLogo from "assets/svg/bnb-logo.svg";
import CeloLogo from "assets/svg/celo_logo.svg";
import MaticLogo from "assets/svg/matic-token-icon.svg";

type Network =
  | "ethereum"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "smartchain"
  | "celo"
  | "avalanchec";

export function chainIdToNetworkName(networkId: ChainId): Network {
  switch (networkId) {
    case ChainId.MAINNET:
      return "ethereum";
    case ChainId.ARBITRUM_ONE:
      return "arbitrum";
    case ChainId.OPTIMISM:
      return "optimism";
    case ChainId.POLYGON:
      return "polygon";
    case ChainId.BNB:
      return "smartchain";
    case ChainId.CELO:
      return "celo";
    case ChainId.AVALANCHE:
      return "avalanchec";
    default:
      return "ethereum";
  }
}

export function getNativeLogoURI(chainId: ChainId = ChainId.MAINNET): string {
  switch (chainId) {
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return MaticLogo;
    case ChainId.BNB:
      return BnbLogo;
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return CeloLogo;
    case ChainId.AVALANCHE:
      return AvaxLogo;
    default:
      return EthereumLogo;
  }
}
