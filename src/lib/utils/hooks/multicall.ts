import { ChainId } from "@uniswap/sdk-core";
import multicall from "lib/state/multicall";
import { SkipFirst } from "lib/types/tuple";
import useBlockNumber, {
  useMainnetBlockNumber
} from "lib/utils/hooks/useBlockNumber";

import { useChainId } from "./connection/connection";

export type { CallStateResult } from "@uniswap/redux-multicall"; // re-export for convenience
export { NEVER_RELOAD } from "@uniswap/redux-multicall"; // re-export for convenience

// Create wrappers for hooks so consumers don't need to get latest block themselves

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<
  Parameters<T>,
  2
>;

export function useMultipleContractSingleData(
  ...args: Parameters<typeof multicall.hooks.useMultipleContractSingleData>
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chainId, _, ...rest] = args;
  const { latestBlock } = useCallContext();
  return multicall.hooks.useMultipleContractSingleData(
    chainId,
    latestBlock,
    ...rest
  );
}

export function useSingleCallResult(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args);
}

export function useMainnetSingleCallResult(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const latestMainnetBlock = useMainnetBlockNumber();
  return multicall.hooks.useSingleCallResult(
    ChainId.MAINNET,
    latestMainnetBlock,
    ...args
  );
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useSingleContractMultipleData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleContractMultipleData(
    chainId,
    latestBlock,
    ...args
  );
}

function useCallContext() {
  const chainId = useChainId();
  const latestBlock = useBlockNumber();
  return { chainId, latestBlock };
}
