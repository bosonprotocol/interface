import { subgraph } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import map from "lodash/map";
import slice from "lodash/slice";
import styled from "styled-components";

import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getLocalStorageItems } from "../../lib/utils/getLocalStorageItems";
import { useDisputeResolver } from "../../lib/utils/hooks/useDisputeResolver";
import { Token } from "../convertion-rate/ConvertionRateContext";
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
  seller?: subgraph.SellerFieldsFragment;
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
export default function Preview({ togglePreview, seller }: Props) {
  const { values } = useCreateForm();

  const redemptionPointUrl =
    values.shippingInfo.redemptionPointUrl &&
    values.shippingInfo.redemptionPointUrl.length > 0
      ? values.shippingInfo.redemptionPointUrl
      : window.origin;

  const exchangeToken = CONFIG.defaultTokens.find(
    (n: Token) => n.symbol === values.coreTermsOfSale.currency.value
  );
  const previewImages = getLocalStorageItems({
    key: "create-product-image"
  });
  const thumbnailImages = getLocalStorageItems({
    key: "create-product-image_productImages.thumbnail"
  });
  const disputeResolverId = CONFIG.defaultDisputeResolverId;
  const { disputeResolver } = useDisputeResolver(disputeResolverId);
  const escalationResponsePeriod =
    disputeResolver?.escalationResponsePeriod || "0";
  const fee =
    disputeResolver && exchangeToken?.address
      ? disputeResolver.fees.find(
          (f: {
            feeAmount: string;
            tokenAddress: string;
            tokenName: string;
            token: {
              address: string;
              decimals: string;
              symbol: string;
              name: string;
            };
          }) => f.tokenAddress === exchangeToken.address
        )
      : undefined;
  const escalationDeposit = fee?.feeAmount || "0";

  const handleClosePreview = () => {
    togglePreview(false);
  };

  const offerImg = previewImages?.[1] ?? null;
  const thumbnailImg = thumbnailImages?.[0] ?? null;

  const sliderImages = slice(previewImages, 1);
  const name = values.productInformation.productTitle || "Untitled";

  const priceBN = parseUnits(
    `${values.coreTermsOfSale.price}`,
    Number(exchangeToken?.decimals || 18)
  );

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

  // Build the Offer structure (in the shape of SubGraph request), based on temporary data (values)
  const offer = {
    price: priceBN.toString(),
    sellerDeposit: priceBN
      .mul(parseFloat(values.termsOfExchange.sellerDeposit) * 1000)
      .div(100 * 1000)
      .toString(),
    protocolFee: "0",
    agentFee: "0",
    agentId: "0",
    buyerCancelPenalty: priceBN
      .mul(parseFloat(values.termsOfExchange.buyerCancellationPenalty) * 1000)
      .div(100 * 1000)
      .toString(),
    quantityAvailable: values.coreTermsOfSale.quantity.toString(),
    quantityInitial: values.coreTermsOfSale.quantity.toString(),
    validFromDate: (validFromDateInMS / 1000).toString(),
    validUntilDate: (validUntilDateInMS / 1000).toString(),
    voucherRedeemableFromDate: (
      voucherRedeemableFromDateInMS / 1000
    ).toString(),
    voucherRedeemableUntilDate: (
      voucherRedeemableUntilDateInMS / 1000
    ).toString(),
    fulfillmentPeriodDuration: `${
      parseInt(values.termsOfExchange.disputePeriod) * 24 * 3600
    }`, // day to sec
    voucherValidDuration: "0", // we use redeemableFrom/redeemableUntil so should be 0
    resolutionPeriodDuration: `${
      parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600
    }`, // day to sec
    metadataUri: "not-uploaded-yet", // can't be empty
    metadataHash: "not-uploaded-yet", // can't be empty
    voidedAt: null,
    disputeResolverId,
    exchanges: [
      {
        committedDate: exchangeDate,
        redeemedDate: exchangeDate
      }
    ],
    seller,
    exchangeToken: exchangeToken || {
      address: ethers.constants.AddressZero,
      decimals: CONFIG.nativeCoin?.decimals || "",
      name: values.coreTermsOfSale.currency.value || "",
      symbol: values.coreTermsOfSale.currency.value || ""
    },
    isValid: false,
    disputeResolutionTerms: {
      buyerEscalationDeposit: escalationDeposit,
      escalationResponsePeriod: escalationResponsePeriod
    },
    metadata: {
      shipping: {
        returnPeriodInDays: parseInt(values.shippingInfo.returnPeriod)
      },
      exchangePolicy: {
        sellerContactMethod: CONFIG.defaultSellerContactMethod,
        disputeResolverContactMethod: `email to: ${CONFIG.defaultDisputeResolverContactMethod}`
      },
      productV1Seller: {
        name: values.createYourProfile.name
      }
    }
  } as unknown as Offer;

  const productAttributes = values.productInformation?.attributes?.filter(
    (attribute: { name: string; value: string }) => {
      return attribute.name.length > 0;
    }
  );
  productAttributes.push({ name: "Token Type", value: "BOSON rNFT" });
  productAttributes.push({
    name: "Redeemable At",
    value: redemptionPointUrl
  });
  productAttributes.push({
    name: "Redeemable Until",
    value: new Date(voucherRedeemableUntilDateInMS).toString(),
    display_type: "date"
  });
  productAttributes.push({
    name: "Seller",
    value: values.createYourProfile?.name || ""
  });
  productAttributes.push({
    name: "Offer Category",
    value: values.productType?.productType?.toUpperCase() || ""
  });

  return (
    <PreviewWrapper>
      <PreviewWrapperContent>
        <DetailWrapper>
          <LightBackground>
            <MainDetailGrid>
              <ImageWrapper>
                <Image src={thumbnailImg} dataTestId="offerImage" />
              </ImageWrapper>
              <div>
                <SellerID
                  offer={offer}
                  buyerOrSeller={offer?.seller}
                  justifyContent="flex-start"
                  withProfileImage
                  onClick={null}
                />
                <Typography
                  tag="h1"
                  data-testid="name"
                  $fontSize="2rem"
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
                <Typography tag="h3">Product description</Typography>
                <Typography
                  tag="p"
                  color={colors.darkGrey}
                  data-testid="description"
                >
                  {values.productInformation.description}
                </Typography>
                <DetailTable data={productAttributes ?? []} />
              </div>
              <div>
                <Typography tag="h3">About the creator</Typography>
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
        <Button theme="primary" type="submit">
          Confirm
        </Button>
        <Button theme="secondary" type="button" onClick={handleClosePreview}>
          Back to overview
        </Button>
      </ProductButtonGroup>
    </PreviewWrapper>
  );
}
