import * as Sentry from "@sentry/react";
import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { envChainIds } from "lib/config";
import ms from "ms";

import { AVERAGE_L1_BLOCK_TIME } from "../../lib/constants/chainInfo";
import { nativeOnChain } from "../../lib/constants/tokens";
import { Chain, TokenStandard } from "./__generated__/types-and-hooks";

export enum PollingInterval {
  Slow = ms(`5m`),
  Normal = ms(`1m`),
  Fast = AVERAGE_L1_BLOCK_TIME,
  LightningMcQueen = ms(`3s`) // approx block interval for polygon
}

export const GQL_MAINNET_CHAINS = [
  Chain.Ethereum,
  Chain.Polygon,
  Chain.Celo,
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Bnb,
  Chain.Avalanche,
  Chain.Base
] as const;

const GQL_TESTNET_CHAINS = [
  Chain.EthereumGoerli,
  Chain.EthereumSepolia
] as const;

const UX_SUPPORTED_GQL_CHAINS = [
  ...GQL_MAINNET_CHAINS,
  ...GQL_TESTNET_CHAINS
] as const;
type InterfaceGqlChain = typeof UX_SUPPORTED_GQL_CHAINS[number];

const CHAIN_ID_TO_BACKEND_NAME: { [key: number]: InterfaceGqlChain } = {
  [ChainId.MAINNET]: Chain.Ethereum,
  [ChainId.GOERLI]: Chain.EthereumGoerli,
  [ChainId.SEPOLIA]: Chain.EthereumSepolia,
  [ChainId.POLYGON]: Chain.Polygon,
  [ChainId.POLYGON_MUMBAI]: Chain.Polygon,
  [ChainId.CELO]: Chain.Celo,
  [ChainId.CELO_ALFAJORES]: Chain.Celo,
  [ChainId.ARBITRUM_ONE]: Chain.Arbitrum,
  [ChainId.ARBITRUM_GOERLI]: Chain.Arbitrum,
  [ChainId.OPTIMISM]: Chain.Optimism,
  [ChainId.OPTIMISM_GOERLI]: Chain.Optimism,
  [ChainId.BNB]: Chain.Bnb,
  [ChainId.AVALANCHE]: Chain.Avalanche,
  [ChainId.BASE]: Chain.Base
};
export const GQL_ENV_CHAINS = envChainIds.map(
  (chainId) => CHAIN_ID_TO_BACKEND_NAME[chainId]
);
export function chainIdToBackendName(chainId: number | undefined) {
  return chainId && CHAIN_ID_TO_BACKEND_NAME[chainId]
    ? CHAIN_ID_TO_BACKEND_NAME[chainId]
    : CHAIN_ID_TO_BACKEND_NAME[ChainId.MAINNET];
}

const GQL_CHAINS = [
  ChainId.MAINNET,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.CELO
] as const;
type GqlChainsType = typeof GQL_CHAINS[number];

export function isGqlSupportedChain(
  chainId: number | undefined
): chainId is GqlChainsType {
  return !!chainId && GQL_CHAINS.includes(chainId);
}
export function gqlToCurrency(token: {
  address?: string;
  chain: Chain;
  standard?: TokenStandard;
  decimals?: number;
  name?: string;
  symbol?: string;
}): Currency | undefined {
  const chainId = supportedChainIdFromGQLChain(token.chain);
  if (!chainId) return undefined;
  if (token.standard === TokenStandard.Native || !token.address)
    return nativeOnChain(chainId);
  else
    return new Token(
      chainId,
      token.address,
      token.decimals ?? 18,
      token.name,
      token.symbol
    );
}

const CHAIN_NAME_TO_CHAIN_ID: { [key in InterfaceGqlChain]: ChainId } = {
  [Chain.Ethereum]: ChainId.MAINNET,
  [Chain.EthereumGoerli]: ChainId.GOERLI,
  [Chain.EthereumSepolia]: ChainId.SEPOLIA,
  [Chain.Polygon]: ChainId.POLYGON,
  [Chain.Celo]: ChainId.CELO,
  [Chain.Optimism]: ChainId.OPTIMISM,
  [Chain.Arbitrum]: ChainId.ARBITRUM_ONE,
  [Chain.Bnb]: ChainId.BNB,
  [Chain.Avalanche]: ChainId.AVALANCHE,
  [Chain.Base]: ChainId.BASE
};

function isSupportedGQLChain(chain: Chain): chain is InterfaceGqlChain {
  return (UX_SUPPORTED_GQL_CHAINS as ReadonlyArray<Chain>).includes(chain);
}

export function supportedChainIdFromGQLChain(chain: InterfaceGqlChain): ChainId;
export function supportedChainIdFromGQLChain(chain: Chain): ChainId | undefined;
export function supportedChainIdFromGQLChain(
  chain: Chain
): ChainId | undefined {
  return isSupportedGQLChain(chain) ? CHAIN_NAME_TO_CHAIN_ID[chain] : undefined;
}

export function logSentryErrorForUnsupportedChain({
  extras,
  errorMessage
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extras?: Record<string, any>;
  errorMessage: string;
}) {
  Sentry.withScope((scope) => {
    extras &&
      Object.entries(extras).map(([k, v]) => {
        scope.setExtra(k, v);
      });
    Sentry.captureException(new Error(errorMessage));
  });
}
