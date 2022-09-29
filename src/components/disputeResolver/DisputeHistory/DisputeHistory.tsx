import styled from "styled-components";

import { Offer } from "../../../lib/types/offer";
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
  offer: Offer;
}

export const DisputeHistory = ({ offer }: Props) => {
  const disputedExchange = offer?.exchanges?.filter((exchange) => {
    return exchange.disputed === true;
  });

  if (!disputedExchange) {
    return null;
  }

  return (
    <OfferHistoryStatuses>
      {disputedExchange ? (
        <ExchangeTimeline
          exchange={disputedExchange[disputedExchange.length - 1]}
          showDispute={true}
        >
          <h4>History</h4>
        </ExchangeTimeline>
      ) : (
        <Typography tag="p">No history of that item yet</Typography>
      )}
    </OfferHistoryStatuses>
  );
};
