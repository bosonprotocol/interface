import OfferCard, { Action } from "../../../components/offer/OfferCard";
import GridContainer from "../../../components/ui/GridContainer";
import { Offer } from "../../../lib/types/offer";
import { useExchanges } from "../../../lib/utils/hooks/useExchanges";

interface Props {
  buyerId: string;
  action: Action;
  isPrivateProfile: boolean;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Exchanges({
  buyerId,
  action,
  isPrivateProfile
}: Props) {
  const {
    data: exchangesSeller,
    isLoading,
    isError
  } = useExchanges(
    { ...orderProps, disputed: null, buyerId },
    { enabled: !!buyerId }
  );

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

  if (!exchangesSeller?.length) {
    return <div>There are no exchanges</div>;
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
