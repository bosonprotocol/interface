import { ProductTypeTypeValues } from "components/product/utils";
import React from "react";
import styled from "styled-components";

import { LayoutRoot } from "../../../components/layout/Layout";
import { VariableStep } from "../../../components/modal/components/createProduct/const";
import { useModal } from "../../../components/modal/useModal";
import BosonButton from "../../../components/ui/BosonButton";
import { Grid } from "../../../components/ui/Grid";
import { GridContainer } from "../../../components/ui/GridContainer";
import { Typography } from "../../../components/ui/Typography";
import { SellerLandingPageParameters } from "../../../lib/routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useCurrentSellers } from "../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
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

const StyledGrid = styled(Grid)`
  width: 100%;
  align-items: center;
  padding-bottom: 5rem;
  ${breakpoint.s} {
    width: 12.75rem;
    padding-bottom: unset;
  }
`;

type CommonProps = {
  showModal: ReturnType<typeof useModal>["showModal"];
  hasSeller: boolean;
};

const SetupAWeb3CommerceStore = ({ showModal, hasSeller }: CommonProps) => (
  <Card
    image={<img src={decentralizedImg} width="104" height="128" />}
    title="Set-up a Web3 commerce store"
    subtitle="Build and customise your own bespoke store "
    onClick={() => {
      showModal("VARIABLE_STEPS_EXPLAINER", {
        title: "Set-up a Web3 commerce store",
        order: [
          VariableStep.CreateYourProfile,
          VariableStep.SetupYourWeb3Store,
          VariableStep.CreateYourProducts
        ],
        to: {
          pathname: BosonRoutes.CreateStorefront
        },
        firstActiveStep: hasSeller ? 1 : 0,
        doSetQueryParams: true
      });
    }}
  />
);

const LaunchMetaverseCommerceExperience = ({
  showModal,
  hasSeller
}: CommonProps) => (
  <Card
    image={<img src={visualImg} width="128" height="128" />}
    title="Launch a Metaverse commerce store"
    subtitle="Sell physical products as NFTs in the metaverse"
    onClick={() => {
      showModal("VARIABLE_STEPS_EXPLAINER", {
        title: "Launch a Metaverse commerce store",
        order: [
          VariableStep.CreateYourProfile,
          VariableStep.SetupYourWeb3Store,
          VariableStep.CreateYourProducts,
          VariableStep.SetupYourDCLStore
        ],
        to: {
          pathname: BosonRoutes.CreateStorefront
        },
        firstActiveStep: hasSeller ? 1 : 0,
        doSetQueryParams: true
      });
    }}
  />
);

const CreateTokenGatedOffers = ({ showModal, hasSeller }: CommonProps) => (
  <Card
    image={<img src={tokenGatedImg} width="128" height="128" />}
    title="Create token-gated offers"
    subtitle="Token-gate your collection and enable exclusive access"
    onClick={() => {
      showModal("VARIABLE_STEPS_EXPLAINER", {
        title: "Create token-gated offers",
        order: [
          VariableStep.CreateYourProfile,
          VariableStep.CreateYourTokenGatedProduct,
          VariableStep.AddSalesChannels
        ],
        to: {
          pathname: SellerCenterRoutes.CreateProduct,
          search: [[SellerLandingPageParameters.sltokenGated, "1"]]
        },
        firstActiveStep: hasSeller ? 1 : 0,
        doSetQueryParams: true
      });
    }}
  />
);

export const SellerLandingPage: React.FC = () => {
  const { sellers } = useCurrentSellers();
  const hasSeller = !!sellers.length;
  const navigate = useKeepQueryParamsNavigate();
  const { showModal } = useModal();
  return (
    <Grid flexDirection="column" padding="5rem 0">
      <Background>
        <LayoutRoot>
          <GridContainer
            columnGap="5rem"
            itemsPerRow={{ xs: 1, s: 2, m: 2, l: 2, xl: 2 }}
            defaultSize="minmax(0, max-content)"
          >
            <Title tag="h1" fontWeight="600" fontSize="3.5rem">
              Sell physical products as NFTs everywhere
            </Title>
            <StyledGrid
              flexDirection="column"
              alignItems="flex-end"
              justifyContent="center"
            >
              <BosonButton
                onClick={() =>
                  navigate({ pathname: SellerCenterRoutes.CreateProduct })
                }
              >
                <span style={{ whiteSpace: "pre", fontSize: "1rem" }}>
                  Start from scratch
                </span>
              </BosonButton>
              <Typography fontWeight="600" fontSize="20px" textAlign="center">
                or select a template
              </Typography>
            </StyledGrid>
          </GridContainer>
        </LayoutRoot>
      </Background>
      <LayoutRoot>
        <Grid gap="5rem" flexDirection="column">
          <RowWithCards
            title="Quick start templates"
            subtitle="Get up and running in minutes using our popular templates"
          >
            <LaunchMetaverseCommerceExperience
              hasSeller={hasSeller}
              showModal={showModal}
            />
            <SetupAWeb3CommerceStore
              hasSeller={hasSeller}
              showModal={showModal}
            />
            <CreateTokenGatedOffers
              hasSeller={hasSeller}
              showModal={showModal}
            />
          </RowWithCards>
          <RowWithCards
            title="Create NFTs"
            subtitle="Create physical, phygital, or token gated NFT collections"
          >
            <Card
              image={<img src={sneakerImg} width="128" height="128" />}
              title="Create Physicals"
              subtitle="Tokenise physical products as an NFT, drop them everywhere"
              onClick={() => {
                showModal("VARIABLE_STEPS_EXPLAINER", {
                  title: "Create Physicals",
                  order: [
                    VariableStep.CreateYourProfile,
                    VariableStep.CreateYourProducts,
                    VariableStep.AddSalesChannels
                  ],
                  to: {
                    pathname: SellerCenterRoutes.CreateProduct,
                    search: [
                      [
                        SellerLandingPageParameters.slproductType,
                        ProductTypeTypeValues.physical
                      ]
                    ]
                  },
                  firstActiveStep: hasSeller ? 1 : 0,
                  doSetQueryParams: true
                });
              }}
            />
            <Card
              image={<img src={sneakerNftImg} width="128" height="128" />}
              title="Create Phygitals"
              subtitle="Bundle physical products with a digital twin all in one offer"
              onClick={() => {
                showModal("VARIABLE_STEPS_EXPLAINER", {
                  title: "Create Phygitals",
                  order: [
                    VariableStep.CreateYourProfile,
                    VariableStep.CreateYourProducts,
                    VariableStep.AddSalesChannels
                  ],
                  to: {
                    pathname: SellerCenterRoutes.CreateProduct,
                    search: [
                      [
                        SellerLandingPageParameters.slproductType,
                        ProductTypeTypeValues.phygital
                      ]
                    ]
                  },
                  firstActiveStep: hasSeller ? 1 : 0,
                  doSetQueryParams: true
                });
              }}
            />
            <CreateTokenGatedOffers
              hasSeller={hasSeller}
              showModal={showModal}
            />
          </RowWithCards>
          <RowWithCards
            title="Launch in new sales channels"
            subtitle="Sell physical, phygital, or token gates NFTs across  sales channels"
          >
            <SetupAWeb3CommerceStore
              hasSeller={hasSeller}
              showModal={showModal}
            />
            <LaunchMetaverseCommerceExperience
              hasSeller={hasSeller}
              showModal={showModal}
            />
            <Card
              image={<img src={glassesMonkeyImg} width="128" height="128" />}
              title="Sell on NFT Marketplaces"
              subtitle="Tokenize physical products and drop on NFT marketplaces"
              as="a"
              href="https://form.typeform.com/to/yMuFfFwd"
              target="_blank"
              rel="noopener noreferrer"
            />
          </RowWithCards>
        </Grid>
      </LayoutRoot>
    </Grid>
  );
};

export default SellerLandingPage;
