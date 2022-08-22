import { parseUnits } from "@ethersproject/units";
import map from "lodash/map";
import slice from "lodash/slice";
import styled from "styled-components";

import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
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
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ProductButtonGroup } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

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
  const { values } = useCreateForm();

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

  const weiPrice = parseUnits(`${values.coreTermsOfSale.price}`, 18);

  const sellerDeposit = parseInt(values.termsOfExchange.sellerDeposit) / 100;
  const buyerDeposit =
    parseInt(values.termsOfExchange.buyerCancellationPenalty) / 100;

  const validFromDateInMS = Date.parse(
    values.coreTermsOfSale.offerValidityPeriod[0]
  );
  const validUntilDateInMS = Date.parse(
    values.coreTermsOfSale.offerValidityPeriod[1]
  );
  const voucherRedeemableFromDateInMS = Date.parse(
    values.coreTermsOfSale.redemptionPeriod[0]
  );
  const voucherRedeemableUntilDateInMS = Date.parse(
    values.coreTermsOfSale.redemptionPeriod[1]
  );

  const exchangeDate = Date.now().toString();

  const offer = {
    price: weiPrice.toString(),

    sellerDeposit: parseUnits(
      `${parseInt(values.coreTermsOfSale.price) * sellerDeposit}`,
      18
    ).toString(),
    buyerCancelPenalty: parseUnits(
      `${parseInt(values.coreTermsOfSale.price) * buyerDeposit}`,
      18
    ).toString(),
    validFromDate: validFromDateInMS.toString(),
    validUntilDate: validUntilDateInMS.toString(),
    voucherRedeemableFromDate: voucherRedeemableFromDateInMS.toString(),
    voucherRedeemableUntilDate: voucherRedeemableUntilDateInMS.toString(),
    voidedAt: null,
    voucherValidDuration: "21727820",
    exchanges: [
      {
        committedDate: exchangeDate,
        redeemedDate: exchangeDate
      }
    ],
    seller: {
      id: "4",
      operator: logoImage,
      active: true
    },
    exchangeToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: "18",
      name: "Ether",
      symbol: "ETH"
    },
    isValid: false
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
                  offer={offer}
                  buyerOrSeller={offer?.seller}
                  justifyContent="flex-start"
                  withProfileImage
                />
                <Typography
                  tag="h1"
                  data-testid="name"
                  fontSize="2rem"
                  margin="0 0 2rem 0"
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
                  color={colors.darkGrey}
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
                <Typography tag="p" color={colors.darkGrey}>
                  {values.createYourProfile.description}
                </Typography>
              </div>
            </DetailGrid>
            createYourProfile
            <DetailSlider images={sliderImages} isPreview />
            <DetailGrid>
              {values?.shippingInfo?.jurisdiction?.length > 0 &&
                values?.shippingInfo?.jurisdiction[0]?.region?.length > 0 && (
                  <div>
                    <Typography tag="h3">Shipping information</Typography>
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
                )}
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
