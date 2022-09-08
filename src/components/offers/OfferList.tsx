import { ArrowRight } from "phosphor-react";
import { ReactElement } from "react";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import OfferCard, { Action } from "../offer/OfferCard";
import Grid from "../ui/Grid";
import GridContainer, { ItemsPerRow } from "../ui/GridContainer";
import Typography from "../ui/Typography";

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading?: boolean;
  loadingComponent?: ReactElement;
  showSeller?: boolean;
  action: Action;
  showInvalidOffers: boolean;
  isPrivateProfile?: boolean;
  type?: "gone" | "hot" | "soon" | undefined;
  itemsPerRow?: Partial<ItemsPerRow>;
}

const Container = styled.div`
  background: ${colors.lightGrey};
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 110px;
  font-size: 16px;
  font-weight: 600;
`;

export default function OfferList({
  offers,
  isLoading,
  isError,
  loadingComponent,
  showSeller,
  action,
  showInvalidOffers,
  isPrivateProfile,
  type,
  itemsPerRow
}: Props) {
  const navigate = useKeepQueryParamsNavigate();

  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (isError) {
    return (
      <Grid data-testid="errorOffers">
        <Typography tag="h3">
          There has been an error, please try again later...
        </Typography>
      </Grid>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Grid data-testid="noOffers">
        <Typography tag="h3">No products found</Typography>
      </Grid>
    );
  }

  return (
    <Container>
      <Grid>
        <h1>Products</h1>
        <ViewMoreButton
          onClick={() =>
            navigate({
              pathname: `${BosonRoutes.Products}`
            })
          }
        >
          View more <ArrowRight size={22} />
        </ViewMoreButton>
      </Grid>
      <GridContainer itemsPerRow={itemsPerRow}>
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
      </GridContainer>
    </Container>
  );
}
