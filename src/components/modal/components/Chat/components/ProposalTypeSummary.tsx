import { BigNumber } from "ethers";
import { Check as CheckComponent } from "phosphor-react";
import styled from "styled-components";

import { PERCENTAGE_FACTOR } from "../../../../../lib/constants/percentages";
import { colors } from "../../../../../lib/styles/colors";
import { displayFloat } from "../../../../../lib/utils/calcPrice";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { ProposalItem } from "../../../../../pages/chat/types";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import Grid from "../../../../ui/Grid";

const Line = styled.div`
  border-right: 2px solid ${colors.border};
  height: 0.75rem;
  width: 0.001rem;
  margin: 0 0.5rem;
`;

const CheckIcon = styled(CheckComponent)`
  margin-right: 0.5rem;
`;
interface Props {
  exchange: Exchange;
  proposal: Pick<ProposalItem, "percentageAmount" | "type">;
}

export default function ProposalTypeSummary({ proposal, exchange }: Props) {
  const { offer } = exchange;
  const { percentageAmount } = proposal;
  const fixedPercentageAmount =
    Number(proposal.percentageAmount) / PERCENTAGE_FACTOR;

  const inEscrow: string = BigNumber.from(offer.price)
    .add(BigNumber.from(offer.sellerDeposit || "0"))
    .toString();

  const refund = Math.round(
    (Number(inEscrow) * Number(fixedPercentageAmount)) / 100
  ).toString();
  const convertedRefund = useConvertedPrice({
    value: refund,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  const sellerPercentage = 100 - fixedPercentageAmount;
  const sellerWillReceive = BigNumber.from(inEscrow).sub(refund).toString();
  const sellerWillReceivePrice = useConvertedPrice({
    value: sellerWillReceive.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <div>
        <CheckIcon size={16} />
        <span>{proposal.type}</span>
      </div>
      {percentageAmount && percentageAmount !== "0" ? (
        <>
          <Grid>
            <CheckIcon size={16} />
            <Grid justifyContent="flex-start">
              <span>
                Buyer will receive: {convertedRefund.price}{" "}
                {offer.exchangeToken.symbol}
              </span>
              {convertedRefund.converted && (
                <>
                  <Line />
                  <span>
                    {convertedRefund.currency?.symbol}{" "}
                    {displayFloat(convertedRefund.converted, { fixed: 2 })}
                  </span>
                </>
              )}
              <Line />
              <span>{fixedPercentageAmount}%</span>
            </Grid>
          </Grid>
          <Grid>
            <CheckIcon size={16} />
            <Grid justifyContent="flex-start">
              <span>
                Seller will receive: {sellerWillReceivePrice.price}{" "}
                {offer.exchangeToken.symbol}
              </span>
              {sellerWillReceivePrice.converted && (
                <>
                  <Line />
                  <span>
                    {sellerWillReceivePrice.currency?.symbol}{" "}
                    {displayFloat(sellerWillReceivePrice.converted, {
                      fixed: 2
                    })}
                  </span>
                </>
              )}
              <Line />
              <span>{sellerPercentage}%</span>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}
