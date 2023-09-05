import { Percent, TradeType } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { Separator } from "components/icons";
import { LoadingRows } from "components/loader/styled";
import Tooltip from "components/tooltip/Tooltip";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "lib/constants/chains";
import {
  formatCurrencyAmount,
  formatNumber,
  formatPriceImpact,
  NumberType
} from "lib/utils/formatNumbers";
import useNativeCurrency from "lib/utils/hooks/useNativeCurrency";
import { InterfaceTrade } from "state/routing/types";
import { isClassicTrade } from "state/routing/utils";

import RouterLabel from "../routerLabel";
import { GasBreakdownTooltip } from "./GasBreakdownTooltip";
import SwapRoute from "./SwapRoute";

interface AdvancedSwapDetailsProps {
  trade: InterfaceTrade;
  allowedSlippage: Percent;
  syncing?: boolean;
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children
}: {
  syncing: boolean;
  width: number;
  children: JSX.Element;
}) {
  return syncing ? (
    <LoadingRows data-testid="loading-rows">
      <div style={{ height: "15px", width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  );
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false
}: AdvancedSwapDetailsProps) {
  const { chainId } = useWeb3React();
  const nativeCurrency = useNativeCurrency(chainId);
  // const txCount = getTransactionCount(trade);

  const supportsGasEstimate =
    chainId && SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId);

  return (
    <Column gap="md">
      <Separator />
      {supportsGasEstimate && (
        <Grid>
          <Tooltip
            content={
              <>
                The fee paid to miners who process your transaction. This must
                be paid in {nativeCurrency.symbol}.
              </>
            }
          >
            <Typography color="textSecondary">Network fee/s</Typography>
          </Tooltip>
          <Tooltip
            placement="right"
            // size={TooltipSize.Small}
            content={
              <GasBreakdownTooltip trade={trade} hideUniswapXDescription />
            }
          >
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <Typography>
                {`${trade.totalGasUseEstimateUSD ? "~" : ""}${formatNumber(
                  trade.totalGasUseEstimateUSD,
                  NumberType.FiatGasPrice
                )}`}
              </Typography>
            </TextWithLoadingPlaceholder>
          </Tooltip>
        </Grid>
      )}
      {isClassicTrade(trade) && (
        <Grid>
          <Tooltip
            content={
              <>The impact your trade has on the market price of this pool.</>
            }
          >
            <Typography color="textSecondary">
              <>Price Impact</>
            </Typography>
          </Tooltip>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <Typography>{formatPriceImpact(trade.priceImpact)}</Typography>
          </TextWithLoadingPlaceholder>
        </Grid>
      )}
      <Grid>
        <Grid $width="fit-content">
          <Tooltip
            content={
              <>
                The minimum amount you are guaranteed to receive. If the price
                slips any further, your transaction will revert.
              </>
            }
          >
            <Typography color="textSecondary">
              {trade.tradeType === TradeType.EXACT_INPUT ? (
                <>Minimum output</>
              ) : (
                <>Maximum input</>
              )}
            </Typography>
          </Tooltip>
        </Grid>
        <TextWithLoadingPlaceholder syncing={syncing} width={70}>
          <Typography fontWeight={400} $fontSize={`14px`}>
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `${formatCurrencyAmount(
                  trade.minimumAmountOut(allowedSlippage),
                  NumberType.SwapTradeAmount
                )} ${trade.outputAmount.currency.symbol}`
              : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${
                  trade.inputAmount.currency.symbol
                }`}
          </Typography>
        </TextWithLoadingPlaceholder>
      </Grid>
      <Grid>
        <Grid $width="fit-content">
          <Tooltip
            content={
              <>
                The amount you expect to receive at the current market price.
                You may receive less or more if the market price changes while
                your transaction is pending.
              </>
            }
          >
            <Typography color="textSecondary">
              <>Expected output</>
            </Typography>
          </Tooltip>
        </Grid>
        <TextWithLoadingPlaceholder syncing={syncing} width={65}>
          <Typography>
            {`${formatCurrencyAmount(
              trade.outputAmount,
              NumberType.SwapTradeAmount
            )} ${trade.outputAmount.currency.symbol}`}
          </Typography>
        </TextWithLoadingPlaceholder>
      </Grid>
      <Separator />
      <Grid>
        <Typography color="textSecondary">
          <>Order routing</>
        </Typography>
        {isClassicTrade(trade) ? (
          <Tooltip
            // size={TooltipSize.Large}
            content={
              <SwapRoute
                data-testid="swap-route-info"
                trade={trade}
                syncing={syncing}
              />
            }
          >
            <RouterLabel trade={trade} />
          </Tooltip>
        ) : (
          <Tooltip
            // size={TooltipSize.Small}
            content={<GasBreakdownTooltip trade={trade} hideFees />}
            placement="right"
          >
            <RouterLabel trade={trade} />
          </Tooltip>
        )}
      </Grid>
    </Column>
  );
}
