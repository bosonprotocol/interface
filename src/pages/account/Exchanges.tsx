import { useMemo } from "react";

import OfferCard, { Action } from "../../components/offer/OfferCard";
import GridContainer from "../../components/ui/GridContainer";
import { Offer } from "../../lib/types/offer";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";

interface Props {
  sellerId: string;
  buyerId: string;
  action: Action;
  isPrivateProfile: boolean;
}

export default function Exchanges({
  sellerId,
  buyerId,
  action,
  isPrivateProfile
}: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges({ disputed: null, sellerId }, { enabled: !!sellerId });

  const {
    data: exchangesBuyer,
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer
  } = useExchanges({ disputed: null, buyerId }, { enabled: !!buyerId });

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
    return <div>There are no exchanges</div>;
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
          exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
          action={action}
          dataTestId="exchange"
          showSeller={false}
          isPrivateProfile={isPrivateProfile}
        />
      ))}
    </GridContainer>
  );
}
