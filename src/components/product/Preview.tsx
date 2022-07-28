import { useFormikContext } from "formik";
import styled from "styled-components";

import DetailChart from "../../components/detail/DetailChart";
import DetailShare from "../../components/detail/DetailShare";
import DetailWidget from "../../components/detail/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getOfferImage } from "../../lib/utils/hooks/offers/placeholders";
import { MOCK } from "../../pages/offers/mock/mock";
import {
  DarkerBackground,
  DetailGrid,
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid
} from "../detail/Detail.style";
import DetailSlider from "../detail/DetailSlider";
import DetailTable from "../detail/DetailTable";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./utils";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewWrapper = styled.div`
  margin: 2rem auto;
  max-width: 90%;
`;
const PreviewWrapperContent = styled.div`
  overflow: hidden;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);
`;

export default function Preview({ togglePreview }: Props) {
  const { values } = useFormikContext<CreateProductForm>();
  console.log(values, "values");

  const handleClosePreview = () => {
    togglePreview(false);
  };

  // TODO: ADD CORRECT VALUES; FOR NOW HARDCODED
  const offerImg = getOfferImage("35", "boson neon sign");
  console.log(values, "values");
  const name = values.productInformation.productTitle || "Untitled";
  // const price = values.coreTermsOfSale.price;
  // const validFromDate = values.coreTermsOfSale.redemptionPeriod; // transform to timestamp;
  // const sellerDeposit = values.termsOfExchange.sellerDeposit; // Should be calc with values.termsOfExchange.sellerDepositPercent or not ?
  // const buyerCancelPenalty = values.termsOfExchange.buyerCancellationPenalty; // Should be calc with values.termsOfExchange.buyerCancelPenalty or not ?
  // const fairExchangePolicy = values.termsOfExchange.fairExchangePolicy;
  // const disputeResolver = values.termsOfExchange.disputeResolver;
  // const seller.operator = values.creteYourProfile.logo
  // const seller.id = ?
  // const exchangeToken.symbol = values.coreTermsOfSale.symbol
  // const validFromDate = values.coreTermsOfSale.redemptionPeriod

  const offer = {
    id: "35",
    createdAt: "1657198698",
    price: "200000000000",
    metadataHash: "Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    sellerDeposit: "20000000000000",
    fulfillmentPeriodDuration: "86400",
    resolutionPeriodDuration: "86400",
    metadataUri: "ipfs://Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    buyerCancelPenalty: "10000000000000",
    quantityAvailable: "994",
    quantityInitial: "1000",
    validFromDate: "1657198839",
    validUntilDate: "1677285059",
    voidedAt: null,
    voucherValidDuration: "21727820",
    exchanges: [
      {
        committedDate: "1657730973",
        redeemedDate: "1657789278"
      }
    ],
    seller: {
      id: "4",
      admin: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      clerk: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      treasury: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      operator: "0xe16955e95d088bd30746c7fb7d76cda436b86f63",
      active: true
    },
    exchangeToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      name: "Ether",
      symbol: "ETH"
    },
    // metadata: {
    //   name: "Long-lived Test Item",
    //   description: "Lore ipsum",
    //   externalUrl: "https://interface-test.on.fleek.co",
    //   schemaUrl: "https://schema.org/schema",
    //   type: "BASE",
    //   imageUrl: ""
    // },
    isValid: true
  } as Offer;

  return (
    <PreviewWrapper>
      <PreviewWrapperContent>
        <DetailWrapper>
          <LightBackground>
            <MainDetailGrid>
              <ImageWrapper>
                <Image src={offerImg} dataTestId="offerImage" />
              </ImageWrapper>
              <div>
                <SellerID
                  seller={offer?.seller}
                  offerName={name}
                  justifyContent="flex-start"
                  withProfileImage
                />
                <Typography
                  tag="h1"
                  data-testid="name"
                  style={{ fontSize: "2rem", marginBottom: "2rem" }}
                >
                  {name}
                </Typography>
                <DetailWidget
                  isPreview={true}
                  pageType="offer"
                  offer={offer}
                  name={name}
                  image={offerImg}
                  hasSellerEnoughFunds={true}
                />
              </div>
              <DetailShare />
            </MainDetailGrid>
          </LightBackground>
          <DarkerBackground>
            <DetailGrid>
              <div>
                <Typography tag="h3">Product data</Typography>
                <Typography
                  tag="p"
                  style={{ color: colors.darkGrey }}
                  data-testid="description"
                >
                  {values.productInformation.description}
                </Typography>
                <DetailTable
                  // TODO: ADD DATA FROM values.productInformation.productAttribute
                  data={[
                    {
                      name: "Outer / Inner Material",
                      value: "N/A"
                    },
                    {
                      name: "Sole Material",
                      value: "N/A"
                    }
                  ]}
                />
              </div>
              <div>
                <Typography tag="h3">About the artist</Typography>
                <Typography tag="p" style={{ color: colors.darkGrey }}>
                  {values.creteYourProfile.description}
                </Typography>
              </div>
            </DetailGrid>
            {/* // TODO: ADD CORRECT VAL Product Images */}
            <DetailSlider images={MOCK.images} />
            <DetailGrid>
              <DetailChart
                // TODO: ADD CORRECT VALUES FOR NOW HARDCODED
                offer={offer}
                title="Inventory graph"
              />
              <div>
                <Typography tag="h3">Shipping information</Typography>
                <Typography tag="p" style={{ color: colors.darkGrey }}>
                  {/* TODO: ADD CORRECT VALUES */}
                  {/* NO REPRESENTATION IN FORM AND UI's */}
                  NEED TO ADD
                </Typography>
                <DetailTable
                  // TODO: ADD DATA values.sippingInfo.supportedJurisdictions
                  data={[
                    {
                      name: "1",
                      value: "N/A"
                    },
                    {
                      name: "2",
                      value: "N/A"
                    },
                    {
                      name: "3",
                      value: "N/A"
                    },
                    {
                      name: "4",
                      value: "N/A"
                    }
                  ]}
                />
              </div>
            </DetailGrid>
          </DarkerBackground>
        </DetailWrapper>
      </PreviewWrapperContent>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit">
          Confirm
        </Button>
        <Button theme="primary" type="button" onClick={handleClosePreview}>
          Back to overview
        </Button>
      </ProductButtonGroup>
    </PreviewWrapper>
  );
}
