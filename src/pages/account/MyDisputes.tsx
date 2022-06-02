import styled from "styled-components";

import { useExchanges } from "../../lib/utils/hooks/useExchanges";

const DisputesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
  padding-bottom: 24px;
`;

const Card = styled.div`
  border-radius: 12px;
  box-shadow: inset -3px -3px 3px #0e0f17, inset 3px 3px 3px #363b5b;
  display: inline-block;
  position: relative;
  width: 250px;
  padding: 0 16px;
`;

export default function MyDisputes() {
  const {
    data: exchanges,
    isLoading,
    isError
  } = useExchanges({ disputed: true });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchanges?.length) {
    return <div>There are no disputes</div>;
  }

  return (
    <DisputesContainer>
      {exchanges?.map((exchange) => (
        <Card key={exchange.id}>
          <p>CommittedDate: {exchange.committedDate}</p>
          <p>Expired: {exchange.expired + ""}</p>
          <p>Offer id: {exchange.offer.id}</p>
          <p>Buyer id: {exchange.buyer.id}</p>
        </Card>
      ))}
    </DisputesContainer>
  );
}
