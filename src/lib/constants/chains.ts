import {
  ChainId,
  SUPPORTED_CHAINS as _SUPPORTED_CHAINS
} from "@uniswap/sdk-core";
import { envChainIds } from "lib/config";

export const LocalChainId = 31337;
export const ChainId_POLYGON_AMOY = 80002;
export const ChainId_BASE_SEPOLIA = 84532;

export const UniWalletSupportedChains = [
  ChainId.MAINNET,
  // ChainId.ARBITRUM_ONE,
  // ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.BASE
];

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.MAINNET]: "mainnet",
  [ChainId.GOERLI]: "goerli",
  [ChainId.SEPOLIA]: "sepolia",
  [ChainId.POLYGON]: "polygon",
  [ChainId.POLYGON_MUMBAI]: "polygon_mumbai",
  [ChainId_POLYGON_AMOY]: "polygon_amoy",
  [ChainId.CELO]: "celo",
  [ChainId.CELO_ALFAJORES]: "celo_alfajores",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.ARBITRUM_GOERLI]: "arbitrum_goerli",
  [ChainId.OPTIMISM]: "optimism",
  [ChainId.OPTIMISM_GOERLI]: "optimism_goerli",
  [ChainId.BNB]: "bnb",
  [ChainId.AVALANCHE]: "avalanche",
  [ChainId.BASE]: "base",
  [ChainId.BASE_GOERLI]: "base_goerli",
  [ChainId_BASE_SEPOLIA]: "base_sepolia",
  [LocalChainId]: "local"
} as const;

export const CHAIN_IDS_TO_FRIENDLY_NAMES = {
  [ChainId.MAINNET]: "Mainnet",
  [ChainId.GOERLI]: "Goerli",
  [ChainId.SEPOLIA]: "Sepolia",
  [ChainId.POLYGON]: "Polygon",
  [ChainId.POLYGON_MUMBAI]: "Polygon Mumbai",
  [ChainId_POLYGON_AMOY]: "Polygon Amoy",
  [ChainId.CELO]: "Celo",
  [ChainId.CELO_ALFAJORES]: "Celo Alfajores",
  [ChainId.ARBITRUM_ONE]: "Arbitrum",
  [ChainId.ARBITRUM_GOERLI]: "Arbitrum Goerli",
  [ChainId.OPTIMISM]: "Optimism",
  [ChainId.OPTIMISM_GOERLI]: "Optimism Goerli",
  [ChainId.BNB]: "Bnb",
  [ChainId.AVALANCHE]: "Avalanche",
  [ChainId.BASE]: "Base",
  [ChainId.BASE_GOERLI]: "Base Goerli",
  [ChainId_BASE_SEPOLIA]: "Base Sepolia",
  [LocalChainId]: "Local Hardhat"
} as const;

const SUPPORTED_CHAINS = [
  LocalChainId,
  ChainId_POLYGON_AMOY,
  ChainId_BASE_SEPOLIA,
  ..._SUPPORTED_CHAINS
] as const;
export declare type SupportedChainsType = (typeof SUPPORTED_CHAINS)[number];

// Include ChainIds in this array if they are not supported by the UX yet, but are already in the SDK.
const NOT_YET_UX_SUPPORTED_CHAIN_IDS: number[] = [];
const ACTUALLY_SUPPORTED_CHAINS = SUPPORTED_CHAINS.filter((chainId) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return envChainIds.includes(chainId as any);
});

export function isSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>
): chainId is SupportedChainsType {
  if (featureFlags && chainId && chainId in featureFlags) {
    return featureFlags[chainId];
  }
  return (
    !!chainId &&
    ACTUALLY_SUPPORTED_CHAINS.indexOf(chainId) !== -1 &&
    NOT_YET_UX_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1 &&
    !!CHAIN_IDS_TO_NAMES[chainId as keyof typeof CHAIN_IDS_TO_NAMES]
  );
}

export function asSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>
): SupportedChainsType | undefined {
  if (!chainId) return undefined;
  if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
    return undefined;
  }
  return isSupportedChain(chainId) ? chainId : undefined;
}

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  ChainId.MAINNET,
  ChainId.POLYGON,
  // ChainId.CELO,
  // ChainId.OPTIMISM,
  // ChainId.ARBITRUM_ONE
  // ChainId.BNB,
  // ChainId.AVALANCHE,
  ChainId.BASE
] as const;

export const TESTNET_CHAIN_IDS = [
  ChainId.GOERLI,
  ChainId.SEPOLIA,
  ChainId.POLYGON_MUMBAI,
  ChainId_POLYGON_AMOY,
  ChainId_BASE_SEPOLIA,
  LocalChainId
  // ChainId.ARBITRUM_GOERLI,
  // ChainId.OPTIMISM_GOERLI,
  // ChainId.CELO_ALFAJORES
  // ChainId.BASE_GOERLI
] as const;

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  ChainId.MAINNET,
  // ChainId.GOERLI,
  ChainId.SEPOLIA,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
  ChainId_POLYGON_AMOY,
  LocalChainId
  // ChainId.CELO,
  // ChainId.CELO_ALFAJORES
  // ChainId.BNB,
  // ChainId.AVALANCHE
] as const;

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  // ChainId.ARBITRUM_ONE,
  // ChainId.ARBITRUM_GOERLI,
  // ChainId.OPTIMISM,
  // ChainId.OPTIMISM_GOERLI
  ChainId.BASE,
  ChainId_BASE_SEPOLIA
  // ChainId.BASE_GOERLI
] as const;

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];

/**
 * Get the priority of a chainId based on its relevance to the user.
 * @param {ChainId} chainId - The chainId to determine the priority for.
 * @returns {number} The priority of the chainId, the lower the priority, the earlier it should be displayed, with base of MAINNET=0.
 */
export function getChainPriority(chainId: number): number {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.GOERLI:
    case ChainId.SEPOLIA:
      return 0;
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
    case ChainId_POLYGON_AMOY:
    case ChainId.BASE:
    case ChainId_BASE_SEPOLIA:
      return 1;
    // case ChainId.ARBITRUM_ONE:
    // case ChainId.ARBITRUM_GOERLI:
    //   return 2;
    // case ChainId.OPTIMISM:
    // case ChainId.OPTIMISM_GOERLI:
    //   return 3;
    // case ChainId.BNB:
    //   return 4;
    // case ChainId.AVALANCHE:
    //   return 5;
    // case ChainId.CELO:
    // case ChainId.CELO_ALFAJORES:
    //   return 6;
    default:
      return 7;
  }
}

export function isUniswapXSupportedChain(chainId: number) {
  return chainId === ChainId.MAINNET;
}
