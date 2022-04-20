import FeaturedOffers from "components/featured-offers/FeaturedOffers";
import { BosonRoutes } from "lib/routes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { colours } from "../lib/colours";

const LandingContainer = styled(Layout)`
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
  background-color: ${colours.green};
  color: ${colours.navy};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ExploreButton = styled.button`
  margin-top: 10px;
  width: 100%;
  background-color: ${colours.green};
  color: ${colours.navy};
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
  const [brand, setBrand] = useState("");
  return (
    <LandingContainer>
      <Hero>
        <TitleContainer>
          <Title>Boson dApp</Title>
          <InputGo>
            <Input
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
              placeholder="Search by Brand"
            />
            <GoButton onClick={() => navigate(BosonRoutes.Search)}>Go</GoButton>
          </InputGo>
          <ExploreContainer>
            <ExploreButton>Explore All Offers</ExploreButton>
          </ExploreContainer>
        </TitleContainer>
        <MainImgContainer>
          <MainImg src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/619622087290b57d6707693d_items-min.png" />
        </MainImgContainer>
      </Hero>

      <FeaturedOffers brand={brand} />
    </LandingContainer>
  );
}
