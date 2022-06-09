import { ReactElement } from "react";
import styled from "styled-components";

import { Offer } from "../../lib/types/offer";
import OfferCard, { Action } from "../offer/OfferCard";

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
  padding-bottom: 24px;
`;

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading?: boolean;
  loadingComponent?: ReactElement;
  showSeller?: boolean;
  action: Action;
}

export default function OfferList({
  offers,
  isLoading,
  isError,
  loadingComponent,
  showSeller,
  action
}: Props) {
  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="errorOffers">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <OfferContainer data-testid="noOffers">No offers found</OfferContainer>
    );
  }

  return (
    <OfferContainer>
      {offers.map((offer: Offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          showSeller={showSeller}
          action={action}
          showCTA
          dataTestId="offer"
        />
      ))}
    </OfferContainer>
  );
}
