import { Percent } from "@uniswap/sdk-core";
import AnimatedDropdown from "components/animatedDropdown";
import { LoadingOpacityContainer } from "components/loader/styled";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { CaretDown } from "phosphor-react";
import { useState } from "react";
import { InterfaceTrade } from "state/routing/types";
import styled, { keyframes } from "styled-components";

import { AdvancedSwapDetails } from "./AdvancedSwapDetails";
import GasEstimateTooltip from "./GasEstimateTooltip";
import TradePrice from "./TradePrice";

const StyledHeaderRow = styled(Grid)<{
  disabled: boolean;
  open: boolean;
}>`
  padding: 0;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "initial" : "pointer")};
`;

const RotatingArrow = styled(CaretDown)<{ open?: boolean }>`
  transform: ${({ open }) => (open ? "rotate(180deg)" : "none")};
  transition: transform 0.1s linear;
`;

const StyledPolling = styled.div`
  display: flex;
  height: 16px;
  width: 16px;
  margin-right: 2px;
  margin-left: 10px;
  align-items: center;
  /* color: ${({ theme }) => theme.textPrimary}; */
  transition: 250ms ease color;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    display: none;
  `}
`;

const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  border-radius: 50%;
  position: relative;
  /* background-color: ${colors.lightGrey}; */
  transition: 250ms ease background-color;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  /* border-left: 2px solid ${({ theme }) => theme.textPrimary}; */
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
  left: -3px;
  top: -3px;
`;

const SwapDetailsWrapper = styled.div`
  padding-top: 12px;
`;

const Wrapper = styled(Column)`
  border: 1px solid ${colors.lightGrey};
  border-radius: 16px;
  padding: 12px 16px;
`;

interface SwapDetailsInlineProps {
  trade?: InterfaceTrade;
  syncing: boolean;
  loading: boolean;
  allowedSlippage: Percent;
}

export default function SwapDetailsDropdown({
  trade,
  syncing,
  loading,
  allowedSlippage
}: SwapDetailsInlineProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Wrapper>
      <StyledHeaderRow
        data-testid="swap-details-header-row"
        onClick={() => setShowDetails(!showDetails)}
        disabled={!trade}
        open={showDetails}
      >
        <Grid>
          {Boolean(loading || syncing) && (
            <StyledPolling>
              <StyledPollingDot>
                <Spinner />
              </StyledPollingDot>
            </StyledPolling>
          )}
          {trade ? (
            <LoadingOpacityContainer
              $loading={syncing}
              data-testid="trade-price-container"
            >
              <TradePrice price={trade.executionPrice} />
            </LoadingOpacityContainer>
          ) : loading || syncing ? (
            <Typography $fontSize={14}>
              <>Fetching best price...</>
            </Typography>
          ) : null}
        </Grid>
        <Grid>
          {!showDetails && (
            <GasEstimateTooltip trade={trade} loading={syncing || loading} />
          )}
          <RotatingArrow
            // TODO: stroke={trade ? theme.textTertiary : theme.deprecated_bg3}
            open={Boolean(trade && showDetails)}
          />
        </Grid>
      </StyledHeaderRow>
      {trade && (
        <AnimatedDropdown open={showDetails}>
          <SwapDetailsWrapper data-testid="advanced-swap-details">
            <AdvancedSwapDetails
              trade={trade}
              allowedSlippage={allowedSlippage}
              syncing={syncing}
            />
          </SwapDetailsWrapper>
        </AnimatedDropdown>
      )}
    </Wrapper>
  );
}
