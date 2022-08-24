import { Check as CheckComponent } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { ProposalItem } from "../../../../../pages/chat/types";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import Grid from "../../../../ui/Grid";
import { PERCENTAGE_FACTOR } from "../const";

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
  proposal: ProposalItem;
}

export default function ProposalTypeSummary({ proposal, exchange }: Props) {
  const { offer } = exchange;
  const { percentageAmount } = proposal;
  const fixedPercentageAmount =
    Number(proposal.percentageAmount) / PERCENTAGE_FACTOR;

  const refund = Math.round(
    (Number(offer.price) * Number(fixedPercentageAmount)) / 100
  );

  const convertedRefund = useConvertedPrice({
    value: refund.toString(),
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <div>
        <CheckIcon size={16} />
        <span>{proposal.type}</span>
      </div>
      {percentageAmount && percentageAmount !== "0" ? (
        <Grid>
          <CheckIcon size={16} />
          <Grid justifyContent="flex-start">
            <span>
              {convertedRefund.price} {offer.exchangeToken.symbol}
            </span>
            {convertedRefund.converted && (
              <>
                <Line />
                <span>
                  {convertedRefund.currency?.symbol} {convertedRefund.converted}
                </span>
              </>
            )}
            <Line />
            <span>{fixedPercentageAmount}%</span>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}
