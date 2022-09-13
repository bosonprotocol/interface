import styled from "styled-components";

import { Offer } from "../../lib/types/offer";
import ExchangeTimeline from "../../pages/chat/components/ExchangeTimeline";
import Typography from "../ui/Typography";

export const OfferHistoryStatuses = styled.div`
  padding: 0.5rem 0;
  min-width: 10rem;
  > div {
    height: initial;
    margin-bottom: 3rem;
  }
`;

interface Props {
  offer: Offer;
}
export default function OfferHistory({ offer }: Props) {
  const allExchanges =
    offer?.exchanges && offer?.exchanges.length ? offer?.exchanges[0] : false;

  return (
    <OfferHistoryStatuses>
      {allExchanges !== false ? (
        <ExchangeTimeline exchange={allExchanges} showDispute={false}>
          <h4>History</h4>
        </ExchangeTimeline>
      ) : (
        <Typography tag="p">No history of that item yet</Typography>
      )}
    </OfferHistoryStatuses>
  );
}
