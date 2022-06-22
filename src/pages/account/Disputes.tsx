import { useMemo } from "react";
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
  isPrivateProfile: boolean;
}

export default function Disputes({
  sellerId,
  buyerId,
  isPrivateProfile
}: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges({ disputed: true, sellerId }, { enabled: !!sellerId });

  const {
    data: exchangesBuyer,
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer
  } = useExchanges({ disputed: true, buyerId }, { enabled: !!buyerId });

  const exchanges = useMemo(() => {
    const allExchanges = [
      ...(exchangesSeller || []),
      ...(exchangesBuyer || [])
    ];
    const uniqueIds: string[] = [];

    const uniqueExchanges = allExchanges.filter((exchange) => {
      const isDuplicate = uniqueIds.includes(exchange.id);

      if (!isDuplicate) {
        uniqueIds.push(exchange.id);

        return true;
      }

      return false;
    });
    return uniqueExchanges;
  }, [exchangesSeller, exchangesBuyer]);

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

  if (!exchanges?.length) {
    return <div>There are no disputes</div>;
  }

  return (
    <DisputesContainer>
      {exchanges?.map((exchange) => (
        <OfferCard
          key={exchange.id}
          offer={exchange.offer}
          dataTestId="dispute"
          showSeller={false}
          isPrivateProfile={isPrivateProfile}
        />
      ))}
    </DisputesContainer>
  );
}
