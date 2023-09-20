import { Percent, TradeType } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { currencyId } from "lib/utils/currencyId";
import { PermitSignature } from "lib/utils/hooks/usePermitAllowance";
import useTransactionDeadline from "lib/utils/hooks/useTransactionDeadline";
import { useUniswapXSwapCallback } from "lib/utils/hooks/useUniswapXSwapCallback";
import { useUniversalRouterSwapCallback } from "lib/utils/hooks/useUniversalRouter";
import { useCallback } from "react";
import { InterfaceTrade, TradeFillType } from "state/routing/types";
import { isClassicTrade, isUniswapXTrade } from "state/routing/utils";
import { useAddOrder } from "state/signatures/hooks";
import { UniswapXOrderDetails } from "state/signatures/types";
import { useTransactionAdder } from "state/transactions/hooks";
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType
} from "state/transactions/types";

import { useAccount } from "./ethers/connection";

export type SwapResult = Awaited<
  ReturnType<ReturnType<typeof useSwapCallback>>
>;

// Returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: InterfaceTrade | undefined, // trade to execute, required
  fiatValues: { amountIn?: number; amountOut?: number }, // usd values for amount in and out, logged for analytics
  allowedSlippage: Percent, // in bips
  permitSignature: PermitSignature | undefined
) {
  const deadline = useTransactionDeadline();

  const addTransaction = useTransactionAdder();
  const addOrder = useAddOrder();
  const { chainId } = useWeb3React();
  const { account } = useAccount();

  const uniswapXSwapCallback = useUniswapXSwapCallback({
    trade: isUniswapXTrade(trade) ? trade : undefined
  });

  const universalRouterSwapCallback = useUniversalRouterSwapCallback(
    isClassicTrade(trade) ? trade : undefined,
    fiatValues,
    {
      slippageTolerance: allowedSlippage,
      deadline,
      permit: permitSignature
    }
  );

  const swapCallback = isUniswapXTrade(trade)
    ? uniswapXSwapCallback
    : universalRouterSwapCallback;

  return useCallback(async () => {
    if (!trade) throw new Error("missing trade");
    if (!account || !chainId)
      throw new Error("wallet must be connected to swap");

    const result = await swapCallback();

    const swapInfo:
      | ExactInputSwapTransactionInfo
      | ExactOutputSwapTransactionInfo = {
      type: TransactionType.SWAP,
      inputCurrencyId: currencyId(trade.inputAmount.currency),
      outputCurrencyId: currencyId(trade.outputAmount.currency),
      isUniswapXOrder: result.type === TradeFillType.UniswapX,
      ...(trade.tradeType === TradeType.EXACT_INPUT
        ? {
            tradeType: TradeType.EXACT_INPUT,
            inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            expectedOutputCurrencyAmountRaw:
              trade.outputAmount.quotient.toString(),
            minimumOutputCurrencyAmountRaw: trade
              .minimumAmountOut(allowedSlippage)
              .quotient.toString()
          }
        : {
            tradeType: TradeType.EXACT_OUTPUT,
            maximumInputCurrencyAmountRaw: trade
              .maximumAmountIn(allowedSlippage)
              .quotient.toString(),
            outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            expectedInputCurrencyAmountRaw:
              trade.inputAmount.quotient.toString()
          })
    };

    if (result.type === TradeFillType.UniswapX) {
      addOrder(
        account,
        result.response.orderHash,
        chainId,
        result.response.deadline,
        swapInfo as UniswapXOrderDetails["swapInfo"]
      );
    } else {
      addTransaction(result.response, swapInfo, deadline?.toNumber());
    }

    return result;
  }, [
    account,
    addOrder,
    addTransaction,
    allowedSlippage,
    chainId,
    deadline,
    swapCallback,
    trade
  ]);
}
