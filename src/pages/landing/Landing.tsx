import { useState } from "react";
import styled from "styled-components";

import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import FeaturedOffers from "../../pages/landing/FeaturedOffers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";

const LandingContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: 64px;

  @media (min-width: 981px) {
    flex-direction: row;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-basis: 30%;
`;

const Title = styled.h1`
  font-size: 48px;
`;

const InputGo = styled.div`
  display: flex;
  justify-content: center;
`;

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 8px;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 16px;
`;

const GoButton = styled.button`
  width: 100px;
  background-color: var(--secondary);
  color: ${colors.navy};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ExploreButton = styled.button`
  margin-top: 10px;
  width: 100%;
  background-color: var(--secondary);
  color: ${colors.navy};
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const MainImgContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 70%;

  @media (min-width: 981px) {
    justify-content: flex-end;
  }
`;

const MainImg = styled.img`
  width: 600px;
  max-width: 100%;
`;

export default function Landing() {
  const navigate = useKeepQueryParamsNavigate();
  const [name, setName] = useState("");
  const storeName = useCustomStoreQueryParameter("storeName");

  const navigateToExplore = () =>
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });

  return (
    <LandingContainer>
      <Hero>
        <TitleContainer>
          <Title>{storeName || "Boson dApp"} </Title>
          <InputGo>
            <Input
              data-testid="search-by-name-input"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigateToExplore();
                }
              }}
              value={name}
              placeholder="Search by Name"
            />
            <GoButton
              onClick={() => navigateToExplore()}
              data-testid="go-button"
            >
              Go
            </GoButton>
          </InputGo>
          <ExploreContainer>
            <ExploreButton
              onClick={() => navigateToExplore()}
              data-testid="explore-all-offers"
            >
              Explore All Offers
            </ExploreButton>
          </ExploreContainer>
        </TitleContainer>
        <MainImgContainer>
          <MainImg src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/619622087290b57d6707693d_items-min.png" />
        </MainImgContainer>
      </Hero>

      <FeaturedOffers />
    </LandingContainer>
  );
}
