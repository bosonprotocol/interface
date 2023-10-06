import { ChainId, SOCKS_CONTROLLER_ADDRESSES, Token } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useTokenBalance } from "state/connection/hooks";

import { useAccount, useChainId } from "./connection/connection";

// technically a 721, not an ERC20, but suffices for our purposes
const SOCKS = new Token(
  ChainId.MAINNET,
  SOCKS_CONTROLLER_ADDRESSES[ChainId.MAINNET],
  0
);

export function useHasSocks(): boolean | undefined {
  const chainId = useChainId();
  const { account } = useAccount();

  const balance = useTokenBalance(
    chainId,
    account ?? undefined,
    chainId === ChainId.MAINNET ? SOCKS : undefined
  );

  return useMemo(() => Boolean(balance?.greaterThan(0)), [balance]);
}
