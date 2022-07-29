import map from "lodash/map";
import slice from "lodash/slice";
import styled from "styled-components";

import DetailChart from "../../components/detail/DetailChart";
import DetailWidget from "../../components/detail/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
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
import { useConvertedPrice } from "../price/useConvertedPrice";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ProductButtonGroup } from "./Product.styles";
import { useThisForm } from "./utils/useThisForm";

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
  const { values } = useThisForm();

  const previewImages = getLocalStorageItems({
    key: "create-product-image"
  });

  const handleClosePreview = () => {
    togglePreview(false);
  };

  const logoImage = previewImages?.[0] ?? null;
  const offerImg = previewImages?.[1] ?? null;
  const sliderImages = slice(previewImages, 1);
  const name = values.productInformation.productTitle || "Untitled";
  console.log("🚀 ~ file: Preview.tsx ~ line 55 ~ Preview ~ values", values);
  // const price = useConvertedPrice(values.coreTermsOfSale.price);
  console.log(
    "🚀 ~ file: Preview.tsx ~ line 60 ~ Preview ~ values.coreTermsOfSale.price",
    values.coreTermsOfSale.price
  );
  const price = useConvertedPrice({
    value: values.coreTermsOfSale.price,
    decimals: "0"
  });
  console.log("🚀 ~ file: Preview.tsx ~ line 59 ~ Preview ~ price", price);
  // const validFromDate = values.coreTermsOfSale.redemptionPeriod; // transform to timestamp; Redeemable until
  const sellerDeposit = values.termsOfExchange.sellerDeposit; // Should be calc with termsOfExchange.sellerDepositUnit or not ? Seller deposit
  // console.log(
  //   "🚀 ~ file: Preview.tsx ~ line 59 ~ Preview ~ sellerDeposit",
  //   sellerDeposit
  // );

  // const new
  // const buyerCancelPenalty = values.termsOfExchange.buyerCancellationPenalty; // Should be calc with values.termsOfExchange.buyerCancellationPenaltyUnit or not ? Buyer cancel. pen.
  // const fairExchangePolicy = values.termsOfExchange.exchangePolicy;
  // const disputeResolver = values.termsOfExchange.disputeResolver;
  // const seller.operator = values.creteYourProfile.logo avatar on the top (small picture)
  // const seller.id = ?
  // const exchangeToken.symbol = values.coreTermsOfSale.currency

  // const validFromDate = // TODO FIX NON NULL ASSERTION
  //   (
  //     (values.coreTermsOfSale.redemptionPeriod?.[1]!.valueOf() as any) / 1000
  //   ).toString();

  const offer = {
    id: "35",
    createdAt: "1657198698",
    price: price.price,
    metadataHash: "Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    sellerDeposit,
    fulfillmentPeriodDuration: "86400",
    resolutionPeriodDuration: "86400",
    metadataUri: "ipfs://Qmf77HBcgxaiB2XT8fYSdDPMWo58VrMu1PVPXoBsBpgAko",
    buyerCancelPenalty: "10000000000000",
    quantityAvailable: "994",
    quantityInitial: "1000",
    validFromDate: "1677285059",
    validUntilDate: "1677285059", // CHECK validUntilDate
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
      operator: logoImage,
      active: true
    },
    exchangeToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: "0",
      name: "Ether",
      symbol: "ETH"
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
                  customImage
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
                  data={values?.productInformation?.attributes ?? []}
                />
              </div>
              <div>
                <Typography tag="h3">About the artist</Typography>
                <Typography tag="p" style={{ color: colors.darkGrey }}>
                  {values.creteYourProfile.description}
                </Typography>
              </div>
            </DetailGrid>
            <DetailSlider images={sliderImages} />
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
                  data={map(
                    values?.shippingInfo?.jurisdiction,
                    ({ region, time }) => {
                      return {
                        name: region,
                        value: time
                      };
                    }
                  )}
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
