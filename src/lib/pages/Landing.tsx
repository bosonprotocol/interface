import FeaturedOffers from "lib/components/offer-list/OfferList";
import logo from "lib/logo.png";
import { CenteredRow, Row } from "lib/styles/layout";
import styled from "styled-components";

import { colors } from "../colours";

const LandingContainer = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 0px 16px;

  @media (min-width: 578px) {
    padding: 0px 24px;
  }

  @media (min-width: 768px) {
    padding: 0px 28px;
  }

  @media (min-width: 981px) {
    padding: 0px 32px;
  }
`;

const Hero = styled.div`
  display: flex;
  margin-bottom: 64px;
`;

const LogoImg = styled.img`
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
  justify-content: flex-end;
  flex-basis: 70%;
`;

const MainImg = styled.img`
  width: 600px;
`;

export default function Landing() {
  return (
    <LandingContainer>
      <LogoImg src={logo} />
      <Hero>
        <TitleContainer>
          <Title>Boson dApp</Title>
          <CenteredRow>
            <Input placeholder="Search by Brand" />
            <GoButton>Go</GoButton>
          </CenteredRow>
          <CenteredRow>
            <ExploreButton>Explore All Offers</ExploreButton>
          </CenteredRow>
        </TitleContainer>
        <MainImgContainer>
          <MainImg src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/619622087290b57d6707693d_items-min.png" />
        </MainImgContainer>
      </Hero>

      <FeaturedOffers />
    </LandingContainer>
  );
}
