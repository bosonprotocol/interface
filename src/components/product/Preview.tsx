import { useFormikContext } from "formik";
import styled from "styled-components";

import DetailChart from "../../components/detail/DetailChart";
import DetailShare from "../../components/detail/DetailShare";
import DetailWidget from "../../components/detail/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import {
  getOfferImage,
  getOfferShippingInformation
} from "../../lib/utils/hooks/offers/placeholders";
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
import type { CreateProductForm } from "./validation/createProductValidationSchema";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewWrapper = styled.div`
  margin: 2rem auto;
  max-width: 65.75rem;
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
  const name = values.productInformation.productTitle || "Untitled";
  const offerImg = getOfferImage("35", "boson neon sign");
  const shippingInfo = getOfferShippingInformation("boson neon sign");
  const offer = {
    id: "35",
    createdAt: "1657198698",
    price: "2000000000000000",
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
      },
      {
        committedDate: "1657198878",
        redeemedDate: null
      },
      {
        committedDate: "1657288773",
        redeemedDate: null
      },
      {
        committedDate: "1657538028",
        redeemedDate: null
      },
      {
        committedDate: "1657538133",
        redeemedDate: null
      },
      {
        committedDate: "1657641168",
        redeemedDate: null
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
    metadata: {
      name: "Long-lived Test Item",
      description: "Lore ipsum",
      externalUrl: "https://interface-test.on.fleek.co",
      schemaUrl: "https://schema.org/schema",
      type: "BASE",
      imageUrl: "https://picsum.photos/seed/35/700"
    },
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
                  {/* TODO: ADD CORRECT VALUES */}
                  {/* {name} */}
                </Typography>
                <DetailWidget
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
                  {/* TODO: ADD CORRECT VALUES */}
                  {values.productInformation.describe}
                </Typography>
                <DetailTable data={[]} tag="strong" />
              </div>
              <div>
                <Typography tag="h3">About the artist</Typography>
                <Typography tag="p" style={{ color: colors.darkGrey }}>
                  {/* TODO: ADD CORRECT VALUES */}
                  {values.creteYourProfile.description}
                </Typography>
              </div>
            </DetailGrid>
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
                  {shippingInfo.shipping}
                </Typography>
                <DetailTable data={shippingInfo.shippingTable} />
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
