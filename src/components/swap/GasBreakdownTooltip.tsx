import { Divider } from "components/icons";
import UniswapXRouterLabel, {
  UniswapXGradient
} from "components/routerLabel/UniswapXRouterLabel";
import { AutoColumn } from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { formatNumber, NumberType } from "lib/utils/formatNumbers";
import { ReactNode } from "react";
import { InterfaceTrade } from "state/routing/types";
import { isClassicTrade, isUniswapXTrade } from "state/routing/utils";
import styled from "styled-components";

const Container = styled(AutoColumn)`
  padding: 4px;
`;

const InlineLink = styled(Typography)`
  /* color: ${({ theme }) => theme.accentAction}; */
  display: inline;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const InlineUniswapXGradient = styled(UniswapXGradient)`
  display: inline;
`;

const GasCostItem = ({
  title,
  amount,
  itemValue
}: {
  title: ReactNode;
  itemValue?: React.ReactNode;
  amount?: number;
}) => {
  return (
    <Grid justifyContent="space-between">
      <Typography>{title}</Typography>
      <Typography color="textPrimary">
        {itemValue ?? formatNumber(amount, NumberType.FiatGasPrice)}
      </Typography>
    </Grid>
  );
};

export function GasBreakdownTooltip({
  trade,
  hideFees = false,
  hideUniswapXDescription = false
}: {
  trade: InterfaceTrade;
  hideFees?: boolean;
  hideUniswapXDescription?: boolean;
}) {
  const swapEstimate = isClassicTrade(trade)
    ? trade.gasUseEstimateUSD
    : undefined;
  const approvalEstimate = trade.approveInfo.needsApprove
    ? trade.approveInfo.approveGasEstimateUSD
    : undefined;
  const wrapEstimate =
    isUniswapXTrade(trade) && trade.wrapInfo.needsWrap
      ? trade.wrapInfo.wrapGasEstimateUSD
      : undefined;
  return (
    <Container gap="md">
      {(wrapEstimate || approvalEstimate) && !hideFees && (
        <>
          <AutoColumn gap="sm">
            {wrapEstimate && (
              <GasCostItem title={<>Wrap ETH</>} amount={wrapEstimate} />
            )}
            {approvalEstimate && (
              <GasCostItem
                title={
                  <>Allow {trade.inputAmount.currency.symbol} (one time)</>
                }
                amount={approvalEstimate}
              />
            )}
            {swapEstimate && (
              <GasCostItem title={<>Swap</>} amount={swapEstimate} />
            )}
            {isUniswapXTrade(trade) && (
              <GasCostItem
                title={<>Swap</>}
                itemValue={<UniswapXRouterLabel>$0</UniswapXRouterLabel>}
              />
            )}
          </AutoColumn>
          <Divider />
        </>
      )}
      {isUniswapXTrade(trade) && !hideUniswapXDescription ? (
        <Typography color="textSecondary">
          <>
            <InlineUniswapXGradient>UniswapX</InlineUniswapXGradient> aggregates
            liquidity sources for better prices and gas free swaps.
          </>{" "}
          <a href="https://support.uniswap.org/hc/en-us/articles/17515415311501">
            <InlineLink>
              <>Learn more</>
            </InlineLink>
          </a>
        </Typography>
      ) : (
        <Typography color="textSecondary">
          <>
            Network Fees are paid to the Ethereum network to secure
            transactions.
          </>{" "}
          <a href="https://support.uniswap.org/hc/en-us/articles/8370337377805-What-is-a-network-fee-">
            <InlineLink>
              <>Learn more</>
            </InlineLink>
          </a>
        </Typography>
      )}
    </Container>
  );
}
