import { ReactElement } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { Offer } from "../../lib/types/offer";
import OfferCard, { Action } from "../offer/OfferCard";
import Typography from "../ui/Typography";

const OfferContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;

  ${breakpoint.xxs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${breakpoint.xs} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading?: boolean;
  loadingComponent?: ReactElement;
  showSeller?: boolean;
  action: Action;
  showInvalidOffers: boolean;
  isPrivateProfile?: boolean;
  type?: "featured" | "hot" | "soon" | undefined;
}

export default function OfferList({
  offers,
  isLoading,
  isError,
  loadingComponent,
  showSeller,
  action,
  showInvalidOffers,
  isPrivateProfile,
  type
}: Props) {
  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (isError) {
    return (
      <OfferContainer data-testid="errorOffers">
        <Typography tag="h3">
          There has been an error, please try again later...
        </Typography>
      </OfferContainer>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <OfferContainer data-testid="noOffers">
        <Typography tag="h3">No offers found</Typography>
      </OfferContainer>
    );
  }

  return (
    <OfferContainer>
      {offers.map((offer: Offer) => {
        return (
          (offer.isValid || (showInvalidOffers && !offer.isValid)) && (
            <OfferCard
              key={offer.id}
              offer={offer}
              showSeller={showSeller}
              action={action}
              dataTestId="offer"
              isPrivateProfile={isPrivateProfile}
              type={type}
            />
          )
        );
      })}
    </OfferContainer>
  );
}
