import { Percent } from "@uniswap/sdk-core";
import { SettingsTab } from "components/settings/index";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { InterfaceTrade } from "state/routing/types";
import styled from "styled-components";

import SwapBuyFiatButton from "./SwapBuyFiatButton";

const StyledSwapHeader = styled(Grid)`
  margin-bottom: 10px;
`;

const HeaderButtonContainer = styled(Grid)`
  padding: 0 12px;
  gap: 16px;
`;

export default function SwapHeader({
  autoSlippage,
  chainId,
  trade
}: {
  autoSlippage: Percent;
  chainId?: number;
  trade?: InterfaceTrade;
}) {
  return (
    <StyledSwapHeader justifyContent="space-between">
      <HeaderButtonContainer justifyContent="flex-start">
        <Typography color={colors.black}>
          <>Swap</>
        </Typography>
        <SwapBuyFiatButton />
      </HeaderButtonContainer>
      <SettingsTab
        autoSlippage={autoSlippage}
        chainId={chainId}
        trade={trade}
      />
    </StyledSwapHeader>
  );
}