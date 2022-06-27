import { useState } from "react";
import styled from "styled-components";

import placeholder from "../../assets/placeholder/product-carousel-2x.png";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import Step from "./Step";

const LandingPage = styled.div`
  padding: 1rem 0.5rem;
  ${breakpoint.m} {
    padding: 2rem 1rem;
  }
  ${breakpoint.xl} {
    padding: 4rem 2rem;
  }
`;

const ExploreContainer = styled.div`
  margin-top: 2rem;
`;

const MainImgContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 70%;

  ${breakpoint.m} {
    justify-content: flex-end;
  }
`;

const MainImg = styled.img`
  width: 600px;
  max-width: 100%;
`;

const StepWrapper = styled(Grid)`
  gap: 50px;
  margin: 5rem 0;
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
        <MainImgContainer>
          <MainImg src={placeholder} />
        </MainImgContainer>
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

      <FeaturedOffers />
    </LandingPage>
  );
}
