import styled from "styled-components";

import OfferCard from "../../components/offer/OfferCard";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

const ExchangesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
  padding-bottom: 24px;
`;

export default function MyExchanges() {
  const {
    data: exchanges,
    isLoading,
    isError
  } = useExchanges({ disputed: null, sellerId: "4" });

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
    return <div>There are no exchanges</div>;
  }
  return (
    <ExchangesContainer>
      {exchanges?.map((exchange) => (
        <OfferCard
          key={exchange.id}
          offer={exchange.offer}
          action="exchange"
          dataTestId="exchange"
        />
      ))}
    </ExchangesContainer>
  );
}
