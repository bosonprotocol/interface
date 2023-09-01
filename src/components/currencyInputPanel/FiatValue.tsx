import { Percent } from "@uniswap/sdk-core";
import { LoadingBubble } from "components/tokens/loading";
import Tooltip from "components/tooltip/Tooltip";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import {
  formatNumber,
  formatPriceImpact,
  NumberType
} from "lib/utils/formatNumbers";
import { warningSeverity } from "lib/utils/prices";
import { useMemo } from "react";
import styled from "styled-components";

const FiatLoadingBubble = styled(LoadingBubble)`
  border-radius: 4px;
  width: 4rem;
  height: 1rem;
`;

export function FiatValue({
  fiatValue,
  priceImpact
}: {
  fiatValue: { data?: number; isLoading: boolean };
  priceImpact?: Percent;
}) {
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return "accentSuccess";
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return "textTertiary";
    if (severity < 3) return "deprecated_yellow1";
    return "accentFailure";
  }, [priceImpact]);

  if (fiatValue.isLoading) {
    return <FiatLoadingBubble />;
  }

  return (
    <Grid gap="1rem">
      <Typography color="textSecondary">
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
