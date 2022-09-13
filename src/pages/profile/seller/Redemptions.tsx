import { subgraph } from "@bosonprotocol/react-kit";

import OfferCard, { Action } from "../../../components/offer/OfferCard";
import GridContainer from "../../../components/ui/GridContainer";
import { Offer } from "../../../lib/types/offer";
import { useExchanges } from "../../../lib/utils/hooks/useExchanges";

interface Props {
  sellerId: string;
  action: Action;
  isPrivateProfile: boolean;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Redemptions({
  sellerId,
  action,
  isPrivateProfile
}: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges(
    {
      ...orderProps,
      disputed: null,
      sellerId,
      state: subgraph.ExchangeState.Redeemed
    },
    { enabled: !!sellerId }
  );

  if (isLoadingSeller) {
    return <div>Loading...</div>;
  }

  if (isErrorSeller) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchangesSeller?.length) {
    return <div>There are no redemptions</div>;
  }

  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    >
      {exchangesSeller?.map((exchange) => (
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
