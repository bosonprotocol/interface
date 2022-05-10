import { QueryParameters } from "@lib/routing/query-parameters";
import { BosonRoutes } from "@lib/routing/routes";
import { colors } from "@lib/styles/colors";
import FeaturedOffers from "@pages/landing/FeaturedOffers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  background-color: ${colors.green};
  color: ${colors.navy};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ExploreButton = styled.button`
  margin-top: 10px;
  width: 100%;
  background-color: ${colors.green};
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
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const navigateToExplore = () =>
    navigate(`${BosonRoutes.Explore}?${QueryParameters.name}=${name}`);

  return (
    <LandingContainer>
      <Hero>
        <TitleContainer>
          <Title>Boson dApp</Title>
          <InputGo>
            <Input
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigateToExplore();
                }
              }}
              value={name}
              placeholder="Search by Name"
            />
            <GoButton onClick={() => navigateToExplore()}>Go</GoButton>
          </InputGo>
          <ExploreContainer>
            <ExploreButton onClick={() => navigateToExplore()}>
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
