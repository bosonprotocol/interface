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
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import Carousel from "./Carousel";
import Step from "./Step";

const LandingPage = styled.div`
  padding: 1rem 0.5rem 0 0.5rem;
  ${breakpoint.m} {
    padding: 2rem 1rem 0 1rem;
  }
  ${breakpoint.xl} {
    padding: 4rem 2rem 0 2rem;
  }
`;

const ExploreContainer = styled.div`
  margin-top: 2rem;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-basis: 90%;

  /* ${breakpoint.m} {
    justify-content: flex-end;
  } */
`;

const StepWrapper = styled(Grid)`
  gap: 50px;
  margin: 5rem 0;
`;

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
  const [name] = useState("");

  const navigateToExplore = () =>
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });

  return (
    <LandingPage>
      <Grid
        flexBasis="50%"
        flexDirection={isLteS ? "column-reverse" : "row"}
        gap="2.5rem"
      >
        <Grid alignItems="flex-start" flexDirection="column">
          <Typography tag="h1">
            Tokenize, transfer and trade&nbsp;any physical asset
            as&nbsp;an&nbsp;NFT
          </Typography>
          <Typography tag="h4">
            The first decentralized marketplace built on Boson Protocol
          </Typography>
          <ExploreContainer>
            <Button
              data-testid="explore-all-offers"
              onClick={() => navigateToExplore()}
              theme="secondary"
            >
              Explore products
            </Button>
          </ExploreContainer>
        </Grid>
        <CarouselContainer>
          <Carousel />
        </CarouselContainer>
      </Grid>
      <StepWrapper
        alignItems="flex-start"
        flexDirection={isLteS ? "column" : "row"}
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
      </StepWrapper>

      <DarkerBackground>
        <Layout>
          <FeaturedOffers type="featured" title="Featured Offers" />
          <FeaturedOffers type="hot" title="Hot Offers" />
        </Layout>
      </DarkerBackground>
    </LandingPage>
  );
}
