import { ReactElement } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { Offer } from "../../lib/types/offer";
import OfferCard, { Action } from "../offer/OfferCard";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";

const OfferContainer = styled(Grid)`
  gap: 2rem;
  flex-wrap: wrap;
  > div {
    flex: 1 0 46%;
    max-width: 100%;
    ${breakpoint.xs} {
      flex: 1 0 21%;
      max-width: 30%;
    }
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
}

export default function OfferList({
  offers,
  isLoading,
  isError,
  loadingComponent,
  showSeller,
  action,
  showInvalidOffers,
  isPrivateProfile
}: Props) {
  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (isError) {
    return (
      <OfferContainer data-testid="errorOffers" justifyContent="center">
        <Typography tag="h3">
          There has been an error, please try again later...
        </Typography>
      </OfferContainer>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <OfferContainer data-testid="noOffers" justifyContent="center">
        <Typography tag="h3">No offers found</Typography>
      </OfferContainer>
    );
  }

  return (
    <OfferContainer justifyContent="flex-start">
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
            />
          )
        );
      })}
    </OfferContainer>
  );
}
