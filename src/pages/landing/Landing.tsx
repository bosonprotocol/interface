import { useState } from "react";
import styled from "styled-components";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import Carousel from "./Carousel";
import Step from "./Step";

const LandingPage = styled.div`
  padding: 0 0.5rem 0 0.5rem;
  ${breakpoint.m} {
    padding: 0 2rem 0 2rem;
  }
  ${breakpoint.xl} {
    padding: 0 4rem 0 4rem;
  }
`;

const GridWithZindex = styled(Grid)`
  z-index: ${zIndex.LandingTitle};
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

const HeroWrapper = styled(Grid)``;

const DarkerBackground = styled.div`
  background-color: ${colors.lightGrey};
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 4rem 0;
`;

export default function Landing() {
  const { isLteS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const title = useCustomStoreQueryParameter("title");
  const description = useCustomStoreQueryParameter("description");
  const [name] = useState("");

  const navigateToExplore = () =>
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });

  return (
    <LandingPage>
      <HeroWrapper
        flexBasis="50%"
        flexDirection={isLteS ? "column-reverse" : "row"}
        gap="2.5rem"
      >
        <GridWithZindex alignItems="flex-start" flexDirection="column">
          <Title tag="h1">
            {title ? (
              title
            ) : (
              <>
                Tokenize, transfer and trade any physical asset
                as&nbsp;an&nbsp;NFT
              </>
            )}
          </Title>
          <SubTitle tag="h4">
            {description ||
              "The first decentralized marketplace built on Boson Protocol"}
          </SubTitle>
          <ExploreContainer>
            <Button
              data-testid="explore-all-offers"
              onClick={() => navigateToExplore()}
              theme="secondary"
            >
              Explore products
            </Button>
          </ExploreContainer>
        </GridWithZindex>
        <Carousel />
      </HeroWrapper>
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

      <DarkerBackground>
        <Layout>
          <FeaturedOffers type="hot" title="Hot products" />
          <FeaturedOffers type="gone" title="Almost gone" />
          <FeaturedOffers type="soon" title="Coming soon..." />
        </Layout>
      </DarkerBackground>
    </LandingPage>
  );
}
