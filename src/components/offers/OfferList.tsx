import { ArrowRight } from "phosphor-react";
import { ReactElement, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
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
  breadcrumbs?: boolean;
}

const Container = styled.div`
  background: ${colors.lightGrey};
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 6.875rem;
  font-size: 1rem;
  font-weight: 600;
`;

const StyledGrid = styled(Grid)`
  background-color: ${colors.white};
  margin-left: -3.125rem;
  width: calc(100% + 6.25rem);
  padding-right: 3.125rem;
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
  itemsPerRow,
  breadcrumbs
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const location = useLocation();

  const isProductPage = useMemo(
    () => location.pathname.includes(BosonRoutes.Products),
    [location]
  );

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
    <>
      {isProductPage && (
        <StyledGrid>
          <Typography
            $fontSize="32px"
            fontWeight="600"
            margin="0.67em 0 0.67em 0"
          >
            Products
          </Typography>
        </StyledGrid>
      )}
      <Container>
        {breadcrumbs && (
          <Breadcrumbs
            steps={[
              {
                id: 0,
                label: "Explore products",
                url: `${BosonRoutes.Explore}`,
                hightlighted: false
              },
              {
                id: 1,
                label: "All products",
                url: `${BosonRoutes.Products}`,
                hightlighted: true
              }
            ]}
            margin="2.5rem 0 -1rem 0"
          />
        )}
        <Grid
          padding={
            isProductPage ? "1.5625rem 3.125rem 1.5625rem 3.125rem" : "unset"
          }
        >
          {!isProductPage && (
            <>
              <Typography
                $fontSize="32px"
                fontWeight="600"
                margin="0.67em 0 0.67em 0"
              >
                Products
              </Typography>
              <ViewMoreButton
                onClick={() =>
                  navigate({
                    pathname: `${BosonRoutes.Products}`
                  })
                }
              >
                View more <ArrowRight size={22} />
              </ViewMoreButton>
            </>
          )}
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
    </>
  );
}
