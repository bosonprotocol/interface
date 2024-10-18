import { CollectionsCardSkeleton, isTruthy } from "@bosonprotocol/react-kit";
import CollectionsCard from "components/modal/components/Explore/Collections/CollectionsCard";
import { useSortOffers } from "components/price/useSortOffers";
import Loading from "components/ui/Loading";
import { colors } from "lib/styles/colors";
import { Profile } from "lib/utils/hooks/lens/graphql/generated";
import { useOffersWhitelist } from "lib/utils/hooks/offers/useOffersWhitelist";
import useProducts from "lib/utils/hooks/product/useProducts";
import useProductsByFilteredOffers from "lib/utils/hooks/product/useProductsByFilteredOffers";
import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import extractUniqueRandomProducts from "lib/utils/product/extractUniqueRandomProducts";
import { ExtendedSeller } from "pages/explore/WithAllOffers";
import { ProductGridContainer } from "pages/profile/ProfilePage.styles";
import { Fragment, ReactNode, useMemo, useState } from "react";
import styled, { css } from "styled-components";

import Layout, { LayoutRoot } from "../../components/layout/Layout";
import BosonButton from "../../components/ui/BosonButton";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers, { ViewMore } from "../../pages/landing/FeaturedOffers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import AnimatedImageGrid from "./AnimatedImageGrid";

const LandingPage = styled.div<{ isCustomStoreFront: string }>`
  width: 100%;
  ${({ isCustomStoreFront }) => {
    if (isCustomStoreFront) {
      return;
    }
    return css`
      padding: 2rem 0.5rem 0 0.5rem;
      ${breakpoint.m} {
        padding: 2rem 2rem 0 2rem;
      }
      ${breakpoint.xl} {
        padding: 2rem 5.5rem 0 5.5rem;
      }
    `;
  }}
`;

const GridWithZindex = styled(Grid)`
  z-index: ${zIndex.LandingTitle};
`;

const StyledGridWithZindex = styled(GridWithZindex)`
  pointer-events: none;
`;

const Title = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
`;
const SubTitle = styled(Typography)`
  margin-bottom: 0.5rem;
`;
const ExploreContainer = styled.div`
  margin-top: 2rem;
`;

const DarkerBackground = styled.div.attrs({ id: "darker-background" })`
  background-color: ${colors.white};
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  justify-content: center;
`;

const ExploreProductsButton = styled(BosonButton)`
  background-color: var(--buttonBgColor);
  border-color: var(--buttonBgColor);
  color: var(--buttonTextColor);
`;

const LandingContainer = styled.div`
  border: 2px solid ${colors.lightGrey};
  border-radius: 0.5rem;
  background-color: ${colors.white};
  margin-bottom: 3.813rem;
`;

const AnimatedGridContainer = styled.div`
  width: 96%;
  height: 355px;
  margin-left: 2rem;
  position: relative;
`;

const Div = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const numOffers = 10;

export default function Landing() {
  const { isLteS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const bannerImgPosition = useCustomStoreQueryParameter(
    "bannerImgPosition"
  ) as unknown as "under" | "over" | "";
  const navigationBarPosition = useCustomStoreQueryParameter(
    "navigationBarPosition"
  );
  const isSideNavBar = ["left", "right"].includes(navigationBarPosition);
  const title = useCustomStoreQueryParameter("title");
  const description = useCustomStoreQueryParameter("description");
  const bannerUrl = useCustomStoreQueryParameter("bannerUrl");
  const [name] = useState("");
  const navigateToExplore = () =>
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });
  const realBannerImgPosition = title ? bannerImgPosition : "over";
  const withUnderBanner = bannerUrl && realBannerImgPosition === "under";
  const TitleAndDescriptionWrapper = withUnderBanner ? Layout : Div;
  const LayoutWrapper = isSideNavBar ? Grid : DarkerBackground;
  const { products, isLoading, isError, sellerLensProfilePerSellerId } =
    useProductsByFilteredOffers({
      first: 200,
      voided: false,
      valid: true,
      quantityAvailable_gte: 1
    });

  const shuffledOffers = useMemo(() => {
    try {
      return extractUniqueRandomProducts({
        products,
        quantity: numOffers
      });
    } catch (error) {
      console.error(error);
      return products;
    }
  }, [products]);

  const { data: offersWhitelisted } = useOffersWhitelist();
  const { products: validOffersWhitelisted } = useProductsByFilteredOffers(
    {
      voided: false,
      valid: true,
      quantityAvailable_gte: 1
    },
    {
      enabled: !!offersWhitelisted?.length,
      overrides: {
        enableCurationLists: true,
        offerCurationList: offersWhitelisted
      }
    }
  );
  const offerImages = useMemo(() => {
    function getOffersForAnimatedGrid() {
      const numOffersInAnimatedGrid = 8;
      if (validOffersWhitelisted.length >= numOffersInAnimatedGrid) {
        return validOffersWhitelisted;
      }
      const validOfferWhitelistedIdMap = new Map(
        validOffersWhitelisted.map((offer) => [offer.id, true])
      );

      const offersToAdd = [...validOffersWhitelisted];
      for (const offer of shuffledOffers) {
        if (offersToAdd.length >= numOffersInAnimatedGrid) break;

        if (!validOfferWhitelistedIdMap.has(offer.id)) {
          offersToAdd.push(offer);
        }
      }
      return offersToAdd;
    }
    const offers = getOffersForAnimatedGrid();
    return offers
      .map((offer) => {
        const { mainImage } = getOfferDetails(offer.metadata);
        return mainImage || offer?.metadata?.imageUrl;
      })
      .filter(isTruthy);
  }, [validOffersWhitelisted, shuffledOffers]);

  const allProducts = useProducts(
    {
      onlyNotVoided: true,
      onlyValid: true
    },
    {
      enableCurationList: true,
      withNumExchanges: true,
      refetchOnMount: true
    }
  );
  const collections = useSortOffers({
    type: "sellers",
    data: allProducts?.sellers || []
  });

  const sellerLensProfilePerSellerIdAllProducts = (
    allProducts?.sellers || []
  ).reduce((map, seller) => {
    if (!map.has(seller.id) && !!seller.lensProfile) {
      map.set(seller.id, seller.lensProfile);
    }
    return map;
  }, new Map<string, Profile>());

  return (
    <LandingPage isCustomStoreFront={isCustomStoreFront}>
      {isCustomStoreFront ? (
        <div>
          {bannerUrl && realBannerImgPosition === "over" && (
            <img
              src={bannerUrl}
              style={{
                objectFit: "contain",
                translate: "-50%",
                marginLeft: "50%",
                width: "100vw"
              }}
              alt="banner image"
            />
          )}

          <div
            style={{
              ...(withUnderBanner && {
                backgroundImage: `url(${bannerUrl})`,
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                translate: "-50%",
                marginLeft: "50%",
                width: "100vw"
              })
            }}
          >
            {(title || description) && (
              <TitleAndDescriptionWrapper>
                <StyledGridWithZindex
                  alignItems="flex-start"
                  flexDirection="column"
                >
                  {title && (
                    <Title tag="h1" fontWeight="600">
                      {title}
                    </Title>
                  )}
                  {description && (
                    <SubTitle tag="h4" fontWeight="400">
                      {description}
                    </SubTitle>
                  )}
                </StyledGridWithZindex>
              </TitleAndDescriptionWrapper>
            )}
          </div>
        </div>
      ) : (
        <LandingContainer>
          <Grid
            flexBasis="50%"
            flexDirection={isLteS ? "column-reverse" : "row"}
          >
            <GridWithZindex
              alignItems="flex-start"
              flexDirection="column"
              padding="0.9375rem 2.5rem 2.5rem 2.5rem"
            >
              <Title tag="h1" fontWeight="600" fontSize="2.0625rem">
                Tokenize, transfer and trade any physical asset as an NFT
              </Title>
              <SubTitle tag="h4" fontWeight="400" fontSize="1.25rem">
                The first decentralized marketplace built on Boson Protocol
              </SubTitle>
              <ExploreContainer>
                <ExploreProductsButton
                  data-testid="explore-all-offers"
                  onClick={() => navigateToExplore()}
                  variant="primaryFill"
                >
                  Explore products
                </ExploreProductsButton>
              </ExploreContainer>
            </GridWithZindex>
            <AnimatedGridContainer>
              {offerImages.length > 0 ? (
                <AnimatedImageGrid images={offerImages} />
              ) : (
                <Loading wrapperStyle={{ height: "100%" }} />
              )}
            </AnimatedGridContainer>
          </Grid>
        </LandingContainer>
      )}

      <LayoutWrapper>
        <LayoutRoot style={{ ...(isSideNavBar && { padding: "initial" }) }}>
          <LandingPage
            isCustomStoreFront={isCustomStoreFront}
            style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
          >
            <Grid
              justifyContent="flex-start"
              alignItems="flex-end"
              margin="1rem 0 2rem 0"
            >
              <Title tag="h3" margin="0">
                Brands & Sellers
              </Title>
              <ViewMore to={BosonRoutes.Explore}>View all</ViewMore>
            </Grid>
            <ProductGridContainer
              itemsPerRow={{
                xs: 1,
                s: 2,
                m: 3,
                l: 4,
                xl: 4
              }}
            >
              {isLoading
                ? new Array(4)
                    .fill(0)
                    .map((_, index) => <CollectionsCardSkeleton key={index} />)
                : collections?.slice(0, 4)?.map((collection) => (
                    <Fragment
                      key={`CollectionsCard_${
                        collection?.brandName || collection?.id
                      }`}
                    >
                      <CollectionsCard
                        collection={collection as ExtendedSeller}
                        lensProfile={sellerLensProfilePerSellerIdAllProducts.get(
                          collection.id
                        )}
                      />
                    </Fragment>
                  ))}
            </ProductGridContainer>
            <Grid marginTop="2.5rem">
              <FeaturedOffers
                title="Products"
                offers={shuffledOffers}
                isLoading={isLoading}
                isError={isError}
                numOffers={numOffers}
                sellerLensProfilePerSellerId={sellerLensProfilePerSellerId}
              />
            </Grid>
          </LandingPage>
        </LayoutRoot>
      </LayoutWrapper>
    </LandingPage>
  );
}
