import styled from "styled-components";

import OfferCard, { Action } from "../../components/offer/OfferCard";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

const ExchangesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
  padding-bottom: 24px;
`;

interface Props {
  sellerId: string;
  buyerId: string;
  action: Action;
}

export default function Exchanges({ sellerId, buyerId, action }: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges({ disputed: null, sellerId });

  const {
    data: exchangesBuyer,
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer
  } = useExchanges({ disputed: null, buyerId });

  if (isLoadingSeller || isLoadingBuyer) {
    return <div>Loading...</div>;
  }

  if (isErrorSeller || isErrorBuyer) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchangesSeller?.length && !exchangesBuyer?.length) {
    return <div>There are no exchanges</div>;
  }

  const exchanges = [...(exchangesSeller || []), ...(exchangesBuyer || [])];
  return (
    <ExchangesContainer>
      {exchanges?.map((exchange) => (
        <OfferCard
          key={exchange.id}
          offer={exchange.offer}
          action={action}
          dataTestId="exchange"
          showSeller={false}
        />
      ))}
    </ExchangesContainer>
  );
}
