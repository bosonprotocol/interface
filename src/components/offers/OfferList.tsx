import { ArrowRight } from "phosphor-react";
import { ReactElement, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { ProductGridContainer } from "../../pages/profile/ProfilePage.styles";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { Action } from "../offer/OfferCard";
import ProductCard from "../productCard/ProductCard";
import Grid from "../ui/Grid";
import { ItemsPerRow } from "../ui/GridContainer";
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
  font-size: 1rem;
  font-weight: 600;
  width: auto;
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
  showInvalidOffers,
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
                label: "Explore",
                url: `${BosonRoutes.Explore}`,
                hightlighted: true
              },
              {
                id: 1,
                label: "All products",
                url: `${BosonRoutes.Products}`,
                hightlighted: false
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
        <ProductGridContainer itemsPerRow={itemsPerRow}>
          {offers.map((offer: Offer) => {
            return (
              (offer.isValid || (showInvalidOffers && !offer.isValid)) && (
                <ProductCard key={offer.id} offer={offer} dataTestId="offer" />
              )
            );
          })}
        </ProductGridContainer>
      </Container>
    </>
  );
}
