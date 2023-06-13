import React from "react";
import styled from "styled-components";

import { LayoutRoot } from "../../../components/layout/Layout";
import BosonButton from "../../../components/ui/BosonButton";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";
import decentralizedImg from "./assets/decentralized.webp";
import glassesMonkeyImg from "./assets/glassesMonkey.webp";
import sneakerImg from "./assets/sneaker.webp";
import sneakerNftImg from "./assets/sneakerNft.webp";
import tokenGatedImg from "./assets/tokenGated.webp";
import visualImg from "./assets/visual.webp";
import { Card } from "./Card";
import { RowWithCards } from "./RowWithCards";

const Title = styled(Typography)`
  margin-top: 5rem;
  margin-bottom: 5rem;
`;

const Background = styled.div`
  background: ${colors.lightGrey};
  width: 100%;
  margin-bottom: 5rem;
`;

export const SellerLandingPage: React.FC = () => {
  return (
    <Grid flexDirection="column" padding="5rem 0">
      <Background>
        <LayoutRoot>
          <Grid gap="5rem">
            <Title tag="h1" fontWeight="600" $fontSize="3.5rem">
              Sell physical products as NFTs everywhere
            </Title>
            <Grid flexDirection="column" $width="12.75rem">
              <BosonButton>
                <span style={{ whiteSpace: "pre", fontSize: "1rem" }}>
                  Start from scratch
                </span>
              </BosonButton>
              <Typography fontWeight="600" $fontSize="20px" textAlign="center">
                or select a template below
              </Typography>
            </Grid>
          </Grid>
        </LayoutRoot>
      </Background>
      <LayoutRoot>
        <Grid gap="5rem" flexDirection="column">
          <RowWithCards
            title="Quick start templates"
            subtitle="Get up and running in minutes using our popular templates"
          >
            <Card
              image={<img src={visualImg} width="128" height="128" />}
              title="Launch a Metaverse commerce experience"
              subtitle="Sell physical products as NFTs in the metaverse"
            />
            <Card
              image={<img src={decentralizedImg} width="104" height="128" />}
              title="Set-up a decentralized Web3 Commerce store"
              subtitle="Build  and customise your own bespoke store"
            />
            <Card
              image={<img src={tokenGatedImg} width="128" height="128" />}
              title="Enable token-gated dCommerce"
              subtitle="Token-gate your collection and enable exclusive access"
            />
          </RowWithCards>
          <RowWithCards
            title="Create NFTs"
            subtitle="Drop physical, phygital, or token gated NFT collections"
          >
            <Card
              image={<img src={sneakerImg} width="128" height="128" />}
              title="Create Physicals"
              subtitle="Tokenise physical products as an NFT, drop them everywhere"
            />
            <Card
              image={<img src={sneakerNftImg} width="128" height="128" />}
              title="Create Phygitals"
              subtitle="Bundle physical products with a digital twin"
            />
            <Card
              image={<img src={tokenGatedImg} width="128" height="128" />}
              title="Create token-gated offers"
              subtitle="Token-gate your collection and enable exclusive access"
            />
          </RowWithCards>
          <RowWithCards
            title="Launch in new sales channels"
            subtitle="Sell physical, phygital, or token gates NFTs across  sales channels"
          >
            <Card
              image={<img src={decentralizedImg} width="104" height="128" />}
              title="Set-up a decentralized Web3 Commerce store"
              subtitle="Build  and customise your own bespoke store"
            />
            <Card
              image={<img src={visualImg} width="128" height="128" />}
              title="Launch a Metaverse commerce experience"
              subtitle="Sell physical products as NFTs in the metaverse"
            />
            <Card
              image={<img src={glassesMonkeyImg} width="128" height="128" />}
              title="Sell on NFT Marketplaces"
              subtitle="Tokenize physical products and drop on NFT marketplaces"
            />
          </RowWithCards>
        </Grid>
      </LayoutRoot>
    </Grid>
  );
};

export default SellerLandingPage;
