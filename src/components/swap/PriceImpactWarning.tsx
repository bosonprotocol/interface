import { Percent } from "@uniswap/sdk-core";
import { OutlineCard } from "components/card";
import Tooltip from "components/tooltip/Tooltip";
import { AutoColumn } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import formatPriceImpact from "lib/utils/formatPriceImpact";
import styled from "styled-components";

const StyledCard = styled(OutlineCard)`
  padding: 12px;
  /* TODO: border: 1px solid {({ theme }) =>
    opacify(24, theme.accentFailure)}; */
`;

interface PriceImpactWarningProps {
  priceImpact: Percent;
}

export default function PriceImpactWarning({
  priceImpact
}: PriceImpactWarningProps) {
  return (
    <StyledCard>
      <AutoColumn $gap="sm">
        <Tooltip
          content={
            <>
              A swap of this size may have a high price impact, given the
              current liquidity in the pool. There may be a large difference
              between the amount of your input token and what you will receive
              in the output token
            </>
          }
        >
          <Grid>
            <Grid>
              <Typography //color={theme.accentFailure}
              >
                <>Price impact warning</>
              </Typography>
            </Grid>
            <Typography textAlign="right" fontSize={14} color="accentFailure">
              {formatPriceImpact(priceImpact)}
            </Typography>
          </Grid>
        </Tooltip>
      </AutoColumn>
    </StyledCard>
  );
}
