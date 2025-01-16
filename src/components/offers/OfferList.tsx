import { ProductCardSkeleton } from "@bosonprotocol/react-kit";
import { ArrowRight } from "phosphor-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useIsCustomStoreValueChanged } from "../../pages/custom-store/useIsCustomStoreValueChanged";
import { ExtendedOffer } from "../../pages/explore/WithAllOffers";
import { ProductGridContainer } from "../../pages/profile/ProfilePage.styles";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import ProductCard from "../productCard/ProductCard";
import { Grid } from "../ui/Grid";
import { ItemsPerRow } from "../ui/GridContainer";
import { Typography } from "../ui/Typography";

interface Props {
  offers?: Offer[] | ExtendedOffer[];
  isError: boolean;
  isLoading?: boolean;
  showSeller?: boolean;
  showInvalidOffers: boolean;
  isPrivateProfile?: boolean;
  type?: "gone" | "hot" | "soon" | undefined;
  itemsPerRow?: Partial<ItemsPerRow>;
  breadcrumbs?: boolean;
  numOffers: number;
  seller?: {
    sellerId: string;
    lensProfile?: Profile;
  };
  sellerLensProfilePerSellerId?: Map<string, Profile> | undefined;
}

const Container = styled.div<{ $isPrimaryBgChanged: boolean }>`
  background: ${({ $isPrimaryBgChanged }) =>
    $isPrimaryBgChanged ? "var(--secondaryBgColor)" : colors.white};
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--accent);
  font-size: 1rem;
  font-weight: 600;
  width: auto;
`;

const StyledGrid = styled(Grid)`
  background-color: ${colors.white};
  margin-left: -50px;
  width: calc(100% + 100px);
  padding-right: 50px;
`;

export default function OfferList({
  offers,
  isLoading,
  isError,
  numOffers,
  showInvalidOffers,
  itemsPerRow,
  breadcrumbs,
  seller,
  sellerLensProfilePerSellerId
}: Props) {
  const isPrimaryBgChanged = useIsCustomStoreValueChanged("primaryBgColor");
  const navigate = useKeepQueryParamsNavigate();
  const location = useLocation();

  const isProductPage = useMemo(
    () => location.pathname.includes(BosonRoutes.Products),
    [location]
  );
  const isExplorePage = useMemo(
    () => location.pathname.includes(BosonRoutes.Explore),
    [location]
  );

  if (isError) {
    return (
      <Grid data-testid="errorOffers">
        <Typography tag="h3">
          There has been an error, please try again later...
        </Typography>
      </Grid>
    );
  }

  if (!isLoading && (!offers || offers.length === 0)) {
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
            fontSize="2.25rem"
            fontWeight="600"
            margin="1.375rem 0 0.67em 0"
          >
            Products
          </Typography>
        </StyledGrid>
      )}
      <Container $isPrimaryBgChanged={isPrimaryBgChanged}>
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
            isExplorePage ? "1.5625rem 3.125rem 1.5625rem 3.125rem" : "unset"
          }
        >
          {isExplorePage && (
            <>
              <Typography
                fontSize="32px"
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
          {isLoading
            ? new Array(numOffers).fill(0).map((_, index) => {
                return <ProductCardSkeleton withBottomText key={index} />;
              })
            : offers?.map((offer: Offer | ExtendedOffer) => {
                return (
                  (offer.isValid || (showInvalidOffers && !offer.isValid)) && (
                    <>
                      <ProductCard
                        key={offer.id}
                        offer={offer}
                        dataTestId="offer"
                        lensProfile={
                          seller?.lensProfile ||
                          sellerLensProfilePerSellerId?.get(offer.seller.id)
                        }
                      />
                    </>
                  )
                );
              })}
        </ProductGridContainer>
      </Container>
    </>
  );
}
