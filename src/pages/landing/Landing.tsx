import { useConfigContext } from "components/config/ConfigContext";
import { ReactNode, useState } from "react";
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
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import Carousel from "./Carousel";
import Step from "./Step";

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

const DarkerBackground = styled.div.attrs({ id: "darker-background" })`
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

const Div = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};
export default function Landing() {
  const { config } = useConfigContext();
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
        <>
          <Grid
            flexBasis="50%"
            flexDirection={isLteS ? "column-reverse" : "row"}
            gap="2.5rem"
          >
            <GridWithZindex alignItems="flex-start" flexDirection="column">
              <Title tag="h1" fontWeight="600">
                Tokenize, transfer and trade any physical asset
                as&nbsp;an&nbsp;NFT
              </Title>
              <SubTitle tag="h4" fontWeight="400">
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
            <Carousel key={config.envConfig.configId} />
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
      <LayoutWrapper>
        <LayoutRoot style={{ ...(isSideNavBar && { padding: "initial" }) }}>
          <LandingPage
            isCustomStoreFront={isCustomStoreFront}
            style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
          >
            <FeaturedOffers title="Products" />
          </LandingPage>
        </LayoutRoot>
      </LayoutWrapper>
    </LandingPage>
  );
}
