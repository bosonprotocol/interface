import CurrencyLogo from "components/logo/CurrencyLogo";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { formatReviewSwapCurrencyAmount } from "lib/utils/formatNumbers";
import { ArrowRight } from "phosphor-react";
import { InterfaceTrade } from "state/routing/types";

export function TradeSummary({
  trade
}: {
  trade: Pick<InterfaceTrade, "inputAmount" | "outputAmount">;
}) {
  return (
    <Grid gap="8px" justifyContent="center" alignItems="center">
      <CurrencyLogo currency={trade.inputAmount.currency} size="16px" />
      <Typography color="textPrimary">
        {formatReviewSwapCurrencyAmount(trade.inputAmount)}{" "}
        {trade.inputAmount.currency.symbol}
      </Typography>
      <ArrowRight size="12px" />
      <CurrencyLogo currency={trade.outputAmount.currency} size="16px" />
      <Typography color="textPrimary">
        {formatReviewSwapCurrencyAmount(trade.outputAmount)}{" "}
        {trade.outputAmount.currency.symbol}
      </Typography>
    </Grid>
  );
}
