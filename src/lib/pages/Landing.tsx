import CardList from "lib/components/offer-list/OfferList";
import { CenteredRow, Row } from "lib/styles/layout";
import styled from "styled-components";

const LandingContainer = styled.div`
  padding: 16px;
`;

const LogoImg = styled.img`
  width: 60px;
  padding: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-basis: 40%;
`;

const Title = styled.h1``;

const Input = styled.input`
  width: 100%;
`;

const GoButton = styled.button`
  width: 100px;
`;

const MainImgContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 60%;
`;

const MainImg = styled.img`
  width: 500px;
`;

export default function Landing() {
  return (
    <LandingContainer>
      <LogoImg src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/6058b6a3587b6e13c296ec58_logo.png" />
      <Row>
        <TitleContainer>
          <Title>Boson dapp</Title>
          <CenteredRow>
            <Input placeholder="Search by Brand" />
            <GoButton>Go</GoButton>
          </CenteredRow>
          <CenteredRow>
            <button>or Explore</button>
          </CenteredRow>
        </TitleContainer>
        <MainImgContainer>
          <MainImg src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/619622087290b57d6707693d_items-min.png" />
        </MainImgContainer>
      </Row>
      <CardList />
    </LandingContainer>
  );
}
