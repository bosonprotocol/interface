import FeaturedOffers from "lib/components/featured-offers/FeaturedOffers";
import logo from "lib/logo.png";
import styled from "styled-components";

import { colors } from "../colours";

const LandingContainer = styled.div`
  max-width: 1500px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;

  @media (min-width: 578px) {
    padding: 0px 24px;
  }

  @media (min-width: 768px) {
    padding: 0px 28px;
  }

  @media (min-width: 981px) {
    padding: 0px 32px;
  }

  @media (min-width: 1500px) {
    padding: 0px 32px;
  }
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: 64px;

  @media (min-width: 981px) {
    flex-direction: row;
  }
`;

const LogoImg = styled.img`
  width: 227px;
  height: 50px;
  padding-top: 24px;
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
  return (
    <LandingContainer>
      <LogoImg data-testId="logo" src={logo} />
      <Hero>
        <TitleContainer>
          <Title>Boson dApp</Title>
          <InputGo>
            <Input placeholder="Search by Brand" />
            <GoButton>Go</GoButton>
          </InputGo>
          <ExploreContainer>
            <ExploreButton>Explore All Offers</ExploreButton>
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
