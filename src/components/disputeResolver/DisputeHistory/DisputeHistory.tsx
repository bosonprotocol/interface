import styled from "styled-components";

import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import ExchangeTimeline from "../../../pages/chat/components/ExchangeTimeline";
import Typography from "../../ui/Typography";

export const OfferHistoryStatuses = styled.div`
  padding: 0.5rem 0;
  min-width: 13rem;
  > div {
    height: initial;
    margin-bottom: 3rem;
  }
`;

interface Props {
  exchange: Exchange;
}

export const DisputeHistory = ({ exchange }: Props) => {
  if (!exchange) {
    return null;
  }

  return (
    <OfferHistoryStatuses>
      {exchange ? (
        <ExchangeTimeline exchange={exchange} showDispute={true}>
          <h4>History</h4>
        </ExchangeTimeline>
      ) : (
        <Typography tag="p">No history of that item yet</Typography>
      )}
    </OfferHistoryStatuses>
  );
};
