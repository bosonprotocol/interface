import OfferCard, { Action } from "../../components/offer/OfferCard";
import GridContainer from "../../components/ui/GridContainer";
import Loading from "../../components/ui/Loading";
import { Offer } from "../../lib/types/offer";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellerToggle } from "./private/Toogle/SellerToggleContext";

interface Props {
  sellerId: string;
  buyerId: string;
  action: Action;
  isPrivateProfile: boolean;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Exchanges({
  sellerId,
  buyerId,
  action,
  isPrivateProfile
}: Props) {
  const { isTabSellerSelected } = useSellerToggle();
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller
  } = useExchanges(
    { ...orderProps, disputed: null, sellerId },
    { enabled: !!sellerId }
  );

  const {
    data: exchangesBuyer,
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer
  } = useExchanges(
    { ...orderProps, disputed: null, buyerId },
    { enabled: !!buyerId }
  );

  const exchanges = isTabSellerSelected ? exchangesSeller : exchangesBuyer;

  if (isLoadingSeller || isLoadingBuyer) {
    return <Loading />;
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
