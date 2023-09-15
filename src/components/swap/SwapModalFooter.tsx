import { Percent, TradeType } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import Tooltip from "components/tooltip/Tooltip";
import Button from "components/ui/Button";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import {
  formatNumber,
  formatPriceImpact,
  NumberType
} from "lib/utils/formatNumbers";
import {
  formatTransactionAmount,
  priceToPreciseFloat
} from "lib/utils/formatNumbers";
import useNativeCurrency from "lib/utils/hooks/useNativeCurrency";
import { getPriceImpactWarning } from "lib/utils/prices";
import { Warning as AlertTriangle } from "phosphor-react";
import { ReactNode } from "react";
import { InterfaceTrade } from "state/routing/types";
import { isClassicTrade } from "state/routing/utils";
import styled from "styled-components";

import { GasBreakdownTooltip } from "./GasBreakdownTooltip";
import { SwapCallbackError, SwapShowAcceptChanges } from "./styled";
import { Label } from "./SwapModalHeaderAmount";

const DetailsContainer = styled(Column)`
  padding: 0 8px;
`;

const StyledAlertTriangle = styled(AlertTriangle)`
  margin-right: 8px;
  min-width: 24px;
`;

const ConfirmButton = styled(Button)`
  height: 56px;
  margin-top: 10px;
`;

const DetailRowValue = styled(Typography)`
  text-align: right;
  overflow-wrap: break-word;
`;

export default function SwapModalFooter({
  trade,
  allowedSlippage,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
  showAcceptChanges,
  onAcceptChanges
}: {
  trade: InterfaceTrade;
  allowedSlippage: Percent;
  onConfirm: () => void;
  swapErrorMessage?: ReactNode;
  disabledConfirm: boolean;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const { chainId } = useWeb3React();
  const nativeCurrency = useNativeCurrency(chainId);

  const label = `${trade.executionPrice.baseCurrency?.symbol} `;
  const labelInverted = `${trade.executionPrice.quoteCurrency?.symbol}`;
  const formattedPrice = formatTransactionAmount(
    priceToPreciseFloat(trade.executionPrice)
  );

  return (
    <>
      <DetailsContainer gap="md">
        <Typography>
          <Grid alignItems="flex-start" justifyContent="space-between" gap="sm">
            <Label>
              <>Exchange rate</>
            </Label>
            <DetailRowValue>{`1 ${labelInverted} = ${
              formattedPrice ?? "-"
            } ${label}`}</DetailRowValue>
          </Grid>
        </Typography>
        <Typography>
          <Grid alignItems="flex-start" justifyContent="space-between" gap="sm">
            <Tooltip
              content={
                <>
                  The fee paid to miners who process your transaction. This must
                  be paid in ${nativeCurrency.symbol}.
                </>
              }
            >
              <Label cursor="help">Network fee/s</Label>
            </Tooltip>
            <Tooltip
              placement="right"
              // size={TooltipSize.Small}
              content={<GasBreakdownTooltip trade={trade} />}
            >
              <DetailRowValue>
                {formatNumber(
                  trade.totalGasUseEstimateUSD,
                  NumberType.FiatGasPrice
                )}
              </DetailRowValue>
            </Tooltip>
          </Grid>
        </Typography>
        {isClassicTrade(trade) && (
          <Typography>
            <Grid
              alignItems="flex-start"
              justifyContent="space-between"
              gap="sm"
            >
              <Tooltip
                content={
                  <>
                    The impact your trade has on the market price of this pool.
                  </>
                }
              >
                <Label cursor="help">
                  <>Price impact</>
                </Label>
              </Tooltip>
              <DetailRowValue color={getPriceImpactWarning(trade.priceImpact)}>
                {trade.priceImpact ? formatPriceImpact(trade.priceImpact) : "-"}
              </DetailRowValue>
            </Grid>
          </Typography>
        )}
        <Typography>
          <Grid alignItems="flex-start" justifyContent="space-between" gap="sm">
            <Tooltip
              content={
                trade.tradeType === TradeType.EXACT_INPUT ? (
                  <>
                    The minimum amount you are guaranteed to receive. If the
                    price slips any further, your transaction will revert.
                  </>
                ) : (
                  <>
                    The maximum amount you are guaranteed to spend. If the price
                    slips any further, your transaction will revert.
                  </>
                )
              }
            >
              <Label cursor="help">
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                  <>Minimum received</>
                ) : (
                  <>Maximum sent</>
                )}
              </Label>
            </Tooltip>
            <DetailRowValue>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade
                    .minimumAmountOut(allowedSlippage)
                    .toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${
                    trade.inputAmount.currency.symbol
                  }`}
            </DetailRowValue>
          </Grid>
        </Typography>
      </DetailsContainer>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges data-testid="show-accept-changes">
          <Grid>
            <Grid>
              <StyledAlertTriangle size={20} />
              <Typography //color={colors.secondary}
              >
                <>Price updated</>
              </Typography>
            </Grid>
            <Button onClick={onAcceptChanges}>
              <>Accept</>
            </Button>
          </Grid>
        </SwapShowAcceptChanges>
      ) : (
        <Grid>
          <ConfirmButton
            data-testid="confirm-swap-button"
            onClick={onConfirm}
            disabled={disabledConfirm}
            // $borderRadius="12px"
            id={"CONFIRM_SWAP_BUTTON"}
          >
            <Typography color="accentTextLightPrimary">
              <>Confirm swap</>
            </Typography>
          </ConfirmButton>

          {swapErrorMessage ? (
            <SwapCallbackError error={swapErrorMessage} />
          ) : null}
        </Grid>
      )}
    </>
  );
}
