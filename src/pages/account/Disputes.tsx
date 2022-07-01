import { useMemo } from "react";

import OfferCard from "../../components/offer/OfferCard";
import GridContainer from "../../components/ui/GridContainer";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

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
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 4,
        l: 4,
        xl: 4
      }}
    >
      {exchanges?.map((exchange) => (
        <OfferCard
          key={exchange.id}
          offer={exchange.offer}
          dataTestId="dispute"
          showSeller={false}
          isPrivateProfile={isPrivateProfile}
        />
      ))}
    </GridContainer>
  );
}
