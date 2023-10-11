import { BigNumber } from "@ethersproject/bignumber";
import { Percent } from "@uniswap/sdk-core";
import {
  SwapRouter,
  UNIVERSAL_ROUTER_ADDRESS
} from "@uniswap/universal-router-sdk";
import { FeeOptions, toHex } from "@uniswap/v3-sdk";
import { calculateGasMargin } from "lib/utils/calculateGasMargin";
import { UserRejectedRequestError } from "lib/utils/errors";
import {
  didUserReject,
  swapErrorToUserReadableMessage
} from "lib/utils/swapErrorToUserReadableMessage";
import { useCallback } from "react";
import { ClassicTrade, TradeFillType } from "state/routing/types";

import { isZero } from "../address";
import { useAccount, useChainId, useProvider } from "./connection/connection";
import { PermitSignature } from "./usePermitAllowance";

/** Thrown when gas estimation fails. This class of error usually requires an emulator to determine the root cause. */
class GasEstimationError extends Error {
  constructor() {
    super(`Your swap is expected to fail.`);
  }
}

/**
 * Thrown when the user modifies the transaction in-wallet before submitting it.
 * In-wallet calldata modification nullifies any safeguards (eg slippage) from the interface, so we recommend reverting them immediately.
 */
class ModifiedSwapError extends Error {
  constructor() {
    super(
      `Your swap was modified through your wallet. If this was a mistake, please cancel immediately or risk losing your funds.`
    );
  }
}

interface SwapOptions {
  slippageTolerance: Percent;
  deadline?: BigNumber;
  permit?: PermitSignature;
  feeOptions?: FeeOptions;
}

export function useUniversalRouterSwapCallback(
  trade: ClassicTrade | undefined,
  fiatValues: { amountIn?: number; amountOut?: number },
  options: SwapOptions
) {
  const chainId = useChainId();
  const provider = useProvider();
  const { account } = useAccount();

  return useCallback(async () => {
    try {
      if (!account) throw new Error("missing account");
      if (!chainId) throw new Error("missing chainId");
      if (!provider) throw new Error("missing provider");
      if (!trade) throw new Error("missing trade");
      const connectedChainId = await provider.getSigner().getChainId();
      if (chainId !== connectedChainId)
        throw new Error("signer chainId does not match");

      const { calldata: data, value } = SwapRouter.swapERC20CallParameters(
        trade,
        {
          slippageTolerance: options.slippageTolerance,
          deadlineOrPreviousBlockhash: options.deadline?.toString(),
          inputTokenPermit: options.permit,
          fee: options.feeOptions
        }
      );

      const tx = {
        from: account,
        to: UNIVERSAL_ROUTER_ADDRESS(chainId),
        data,
        // TODO(https://github.com/Uniswap/universal-router-sdk/issues/113): universal-router-sdk returns a non-hexlified value.
        ...(value && !isZero(value) ? { value: toHex(value) } : {})
      };

      let gasEstimate: BigNumber;
      try {
        gasEstimate = await provider.estimateGas(tx);
      } catch (gasError) {
        // TODO: Sentry
        console.warn(gasError);
        throw new GasEstimationError();
      }
      const gasLimit = calculateGasMargin(gasEstimate);

      const response = await provider
        .getSigner()
        .sendTransaction({ ...tx, gasLimit })
        .then((response) => {
          if (tx.data !== response.data) {
            throw new ModifiedSwapError();
          }
          return response;
        });
      return {
        type: TradeFillType.Classic as const,
        response
      };
    } catch (swapError: unknown) {
      if (swapError instanceof ModifiedSwapError) throw swapError;

      // Cancellations are not failures, and must be accounted for as 'cancelled'.
      if (didUserReject(swapError)) {
        // This error type allows us to distinguish between user rejections and other errors later too.
        throw new UserRejectedRequestError(
          swapErrorToUserReadableMessage(swapError)
        );
      }

      throw new Error(swapErrorToUserReadableMessage(swapError));
    }
  }, [
    account,
    chainId,
    options.deadline,
    options.feeOptions,
    options.permit,
    options.slippageTolerance,
    provider,
    trade
  ]);
}
