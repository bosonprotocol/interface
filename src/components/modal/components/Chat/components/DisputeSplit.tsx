import { BigNumber } from "ethers";
import styled from "styled-components";

import { PERCENTAGE_FACTOR } from "../../../../../lib/constants/percentages";
import { colors } from "../../../../../lib/styles/colors";
import { displayFloat } from "../../../../../lib/utils/calcPrice";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { ProposalItem } from "../../../../../pages/chat/types";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import { Grid } from "../../../../ui/Grid";

const StyledTable = styled.table`
  width: 100%;
  color: ${colors.greyDark};
  .receive {
    font-weight: 600;
    color: ${colors.black};
  }
  td {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

function Line() {
  return (
    <tr>
      <td style={{ paddingRight: 0 }}>
        <div style={{ width: "110%", border: `1px solid ${colors.black}` }} />
      </td>
      <td style={{ paddingLeft: 0 }}>
        <div style={{ width: "100%", border: `1px solid ${colors.black}` }} />
      </td>
    </tr>
  );
}

type DisputeSplitProps = {
  exchange: Exchange;
  proposal: Pick<ProposalItem, "percentageAmount" | "type">;
};

export const DisputeSplit: React.FC<DisputeSplitProps> = ({
  exchange,
  proposal
}) => {
  const symbol = exchange.offer.exchangeToken.symbol;

  const price = useConvertedPrice({
    value: exchange.offer.price,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const sellerDeposit = useConvertedPrice({
    value: exchange.offer.sellerDeposit,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const inEscrow: string = BigNumber.from(exchange.offer.price)
    .add(BigNumber.from(exchange.offer.sellerDeposit || "0"))
    .toString();
  const totalEligibleRefund = useConvertedPrice({
    value: inEscrow,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });

  const fixedPercentageAmount: number =
    Number(proposal.percentageAmount) / PERCENTAGE_FACTOR;
  const refundBuyerWillReceive = Math.round(
    (Number(inEscrow) * Number(fixedPercentageAmount)) / 100
  ).toString();

  const refundBuyerWillReceivePrice = useConvertedPrice({
    value: refundBuyerWillReceive,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const sellerWillReceive = BigNumber.from(inEscrow)
    .sub(refundBuyerWillReceive)
    .toString();
  const sellerWillReceivePrice = useConvertedPrice({
    value: sellerWillReceive.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  return (
    <StyledTable>
      <tr>
        <td>Item price</td>
        <td>
          <Grid justifyContent="flex-end">
            {price.price} {symbol} ({price.currency?.symbol}
            {displayFloat(price.converted, { fixed: 2 })})
          </Grid>
        </td>
      </tr>
      <tr>
        <td>Seller deposit</td>
        <td>
          <Grid justifyContent="flex-end">
            {sellerDeposit.price} {symbol} ({sellerDeposit.currency?.symbol}
            {displayFloat(sellerDeposit.converted, { fixed: 2 })})
          </Grid>
        </td>
      </tr>
      <Line />
      <tr>
        <td>Total eligible refund</td>
        <td>
          <Grid justifyContent="flex-end">
            {totalEligibleRefund.price} {symbol} (
            {totalEligibleRefund.currency?.symbol}
            {displayFloat(totalEligibleRefund.converted, { fixed: 2 })})
          </Grid>
        </td>
      </tr>
      <tr>
        <td>Refund proposal</td>
        <td>
          <Grid justifyContent="flex-end">{fixedPercentageAmount}%</Grid>
        </td>
      </tr>
      <Line />
      <tr className="receive">
        <td>Buyer will receive</td>
        <td>
          <Grid justifyContent="flex-end">
            {refundBuyerWillReceivePrice.price} {symbol} (
            {refundBuyerWillReceivePrice.currency?.symbol}
            {displayFloat(refundBuyerWillReceivePrice.converted, {
              fixed: 2
            })}
            )
          </Grid>
        </td>
      </tr>
      <tr className="receive">
        <td>Seller will receive</td>
        <td>
          <Grid justifyContent="flex-end">
            {sellerWillReceivePrice.price} {symbol} (
            {sellerWillReceivePrice.currency?.symbol}
            {displayFloat(sellerWillReceivePrice.converted, { fixed: 2 })})
          </Grid>
        </td>
      </tr>
    </StyledTable>
  );
};
