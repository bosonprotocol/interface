import OfferCard from "../../components/offer/OfferCard";
import GridContainer from "../../components/ui/GridContainer";
import Loading from "../../components/ui/Loading";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellerToggle } from "./private/Toogle/SellerToggleContext";

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
  const { isTabSellerSelected } = useSellerToggle();

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
    return <div>There are no disputes</div>;
  }

  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
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
          action="contact-seller"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exchange={exchange as any}
        />
      ))}
    </GridContainer>
  );
}
