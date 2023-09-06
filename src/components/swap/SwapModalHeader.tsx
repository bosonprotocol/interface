import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
import { Divider } from "components/icons";
import Column, { AutoColumn } from "components/ui/column";
import Typography from "components/ui/Typography";
import { useUSDPrice } from "lib/utils/hooks/useUSDPrice";
import { InterfaceTrade } from "state/routing/types";
import { Field } from "state/swap/actions";
import styled from "styled-components";

import { SwapModalHeaderAmount } from "./SwapModalHeaderAmount";

const Rule = styled(Divider)`
  margin: 16px 2px 24px 2px;
`;

const HeaderContainer = styled(AutoColumn)`
  margin-top: 16px;
`;

export default function SwapModalHeader({
  trade,
  inputCurrency,
  allowedSlippage
}: {
  trade: InterfaceTrade;
  inputCurrency?: Currency;
  allowedSlippage: Percent;
}) {
  const fiatValueInput = useUSDPrice(trade.inputAmount);
  const fiatValueOutput = useUSDPrice(trade.outputAmount);

  return (
    <HeaderContainer gap="sm">
      <Column gap="lg">
        <SwapModalHeaderAmount
          field={Field.INPUT}
          label={<>You pay</>}
          amount={trade.inputAmount}
          currency={inputCurrency ?? trade.inputAmount.currency}
          usdAmount={fiatValueInput.data}
        />
        <SwapModalHeaderAmount
          field={Field.OUTPUT}
          label={<>You receive</>}
          amount={trade.outputAmount}
          currency={trade.outputAmount.currency}
          usdAmount={fiatValueOutput.data}
          tooltipText={
            trade.tradeType === TradeType.EXACT_INPUT ? (
              <Typography>
                <>
                  Output is estimated. You will receive at least{" "}
                  <b>
                    {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{" "}
                    {trade.outputAmount.currency.symbol}
                  </b>{" "}
                  or the transaction will revert.
                </>
              </Typography>
            ) : (
              <Typography>
                <>
                  Input is estimated. You will sell at most{" "}
                  <b>
                    {trade.maximumAmountIn(allowedSlippage).toSignificant(6)}{" "}
                    {trade.inputAmount.currency.symbol}
                  </b>{" "}
                  or the transaction will revert.
                </>
              </Typography>
            )
          }
        />
      </Column>
      <Rule />
    </HeaderContainer>
  );
}
