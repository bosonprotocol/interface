import { LoadingOpacityContainer } from "components/loader/styled";
import { UniswapXRouterIcon } from "components/routerLabel/UniswapXRouterLabel";
import Tooltip from "components/tooltip/Tooltip";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "lib/constants/chains";
import { formatNumber, NumberType } from "lib/utils/formatNumbers";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { InterfaceTrade } from "state/routing/types";
import { isUniswapXTrade } from "state/routing/utils";
import styled from "styled-components";

import { ReactComponent as GasIcon } from "../../assets/images/gas-icon.svg";
import { GasBreakdownTooltip } from "./GasBreakdownTooltip";

const StyledGasIcon = styled(GasIcon)`
  height: 18px;

  // We apply the following to all children of the SVG in order to override the default color
  & > * {
    stroke: ${({ theme }) => theme.textTertiary};
  }
`;

export default function GasEstimateTooltip({
  trade,
  loading
}: {
  trade?: InterfaceTrade;
  loading: boolean;
}) {
  const chainId = useChainId();
  if (
    !trade ||
    !chainId ||
    !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId)
  ) {
    return null;
  }

  return (
    <Tooltip
      // size={TooltipSize.Small}
      content={<GasBreakdownTooltip trade={trade} />}
      placement="right"
    >
      <LoadingOpacityContainer $loading={loading}>
        <Grid gap="xs">
          {isUniswapXTrade(trade) ? (
            <UniswapXRouterIcon testId="gas-estimate-uniswapx-icon" />
          ) : (
            <StyledGasIcon />
          )}
          <Typography color="textSecondary">
            <Grid gap="xs">
              <div>
                {formatNumber(
                  trade.totalGasUseEstimateUSD,
                  NumberType.FiatGasPrice
                )}
              </div>
              {isUniswapXTrade(trade) && (
                <div>
                  <s>
                    {formatNumber(
                      trade.classicGasUseEstimateUSD,
                      NumberType.FiatGasPrice
                    )}
                  </s>
                </div>
              )}
            </Grid>
          </Typography>
        </Grid>
      </LoadingOpacityContainer>
    </Tooltip>
  );
}
