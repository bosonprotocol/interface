import { LoadingBubble } from "@bosonprotocol/react-kit";
import { Percent } from "@uniswap/sdk-core";
import Tooltip from "components/tooltip/Tooltip";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import {
  formatNumber,
  formatPriceImpact,
  NumberType
} from "lib/utils/formatNumbers";
import { warningSeverity } from "lib/utils/prices";
import { useMemo } from "react";

export function FiatValue({
  fiatValue,
  priceImpact
}: {
  fiatValue: { data?: number; isLoading: boolean };
  priceImpact?: Percent;
}) {
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return colors.green;
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return colors.violet;
    if (severity < 3) return "yellow";
    return colors.redDark;
  }, [priceImpact]);

  if (fiatValue.isLoading) {
    return <LoadingBubble $width="4rem" $height="1rem" $borderRadius="4px" />;
  }

  return (
    <Grid gap="1rem">
      <Typography color={colors.violet}>
        {fiatValue.data ? (
          formatNumber(fiatValue.data, NumberType.FiatTokenPrice)
        ) : (
          <Tooltip
            content={<>Not enough liquidity to show accurate USD value.</>}
          >
            -
          </Tooltip>
        )}
      </Typography>
      {priceImpact && (
        <Typography color={priceImpactColor}>
          <Tooltip
            content={
              <>
                The estimated difference between the USD values of input and
                output amounts.
              </>
            }
          >
            (<>{formatPriceImpact(priceImpact)}</>)
          </Tooltip>
        </Typography>
      )}
    </Grid>
  );
}
