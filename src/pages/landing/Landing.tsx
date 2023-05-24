import { useState } from "react";
import styled, { css } from "styled-components";
import useResizeObserver from "use-resize-observer";

import { LayoutPadding } from "../../components/Layout";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import Carousel from "./Carousel";
import Step from "./Step";

const LandingPage = styled.div<{ isCustomStoreFront: string }>`
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
  position: relative;
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  ${LayoutPadding};
`;

const Title = styled(Typography)`
  margin-bottom: 1rem;
  margin-top: 1rem;

  font-size: 2.5rem;
  line-height: 1.3;
  ${breakpoint.s} {
    font-size: 3.15rem;
    line-height: 1.2;
  }
`;
const SubTitle = styled(Typography)`
  margin-bottom: 0.5rem;
`;
const ExploreContainer = styled.div`
  margin-top: 2rem;
`;

const DarkerBackground = styled.div`
  background-color: var(--secondary);
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

export default function Landing() {
  const { isLteS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const title = useCustomStoreQueryParameter("title");
  const description = useCustomStoreQueryParameter("description");
  const bannerUrl = useCustomStoreQueryParameter("bannerUrl");
  const [name] = useState("");
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const navigateToExplore = () =>
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });

  return (
    <LandingPage ref={ref} isCustomStoreFront={isCustomStoreFront}>
      {isCustomStoreFront ? (
        <StyledGridWithZindex
          alignItems="flex-start"
          flexDirection="column"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        >
          <Title tag="h1" fontWeight="600">
            {title ? (
              title
            ) : (
              <>
                Tokenize, transfer and trade any physical asset
                as&nbsp;an&nbsp;NFT
              </>
            )}
          </Title>
          <SubTitle tag="h4" fontWeight="400">
            {description ||
              "The first decentralized marketplace built on Boson Protocol"}
          </SubTitle>
        </StyledGridWithZindex>
      ) : (
        <>
          <Grid
            flexBasis="50%"
            flexDirection={isLteS ? "column-reverse" : "row"}
            gap="2.5rem"
            data-hero-wrapper
          >
            <GridWithZindex alignItems="flex-start" flexDirection="column">
              <Title tag="h1" fontWeight="600">
                {title ? (
                  title
                ) : (
                  <>
                    Tokenize, transfer and trade any physical asset
                    as&nbsp;an&nbsp;NFT
                  </>
                )}
              </Title>
              <SubTitle tag="h4" fontWeight="400">
                {description ||
                  "The first decentralized marketplace built on Boson Protocol"}
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
            <Carousel />
          </Grid>
          <Grid
            alignItems="flex-start"
            flexDirection={isLteS ? "column" : "row"}
            gap="50px"
            margin="5rem 0"
          >
            <Step number={1} title="Commit">
              Commit to an Offer to receive a Redeemable NFT (rNFT) that can be
              exchanged for the real-world item it represents
            </Step>
            <Step number={2} title="Hold, Trade or Transfer ">
              You can hold, transfer or easily trade your rNFT on the secondary
              market
            </Step>
            <Step number={3} title="Redeem">
              Redeem your rNFT to receive the underlying item. The rNFT will be
              destroyed in the process.
            </Step>
          </Grid>
        </>
      )}
      <DarkerBackground>
        <div
          style={{
            width,
            padding: "2rem 0"
          }}
        >
          <FeaturedOffers title="Products" />
        </div>
      </DarkerBackground>
    </LandingPage>
  );
}
