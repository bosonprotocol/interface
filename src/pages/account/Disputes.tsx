import styled from "styled-components";

import OfferCard from "../../components/offer/OfferCard";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

const DisputesContainer = styled.div`
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
}

export default function Disputes({ sellerId, buyerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges({ disputed: true, sellerId });

  const {
    data: exchangesBuyer,
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer
  } = useExchanges({ disputed: true, buyerId });

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
    return <div>There are no disputes</div>;
  }

  const exchanges = [...(exchangesSeller || []), ...(exchangesBuyer || [])];
  return (
    <DisputesContainer>
      {exchanges?.map((exchange) => (
        <OfferCard
          key={exchange.id}
          offer={exchange.offer}
          dataTestId="dispute"
          showSeller={false}
        />
      ))}
    </DisputesContainer>
  );
}
