import { subgraph } from "@bosonprotocol/react-kit";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import map from "lodash/map";
import styled from "styled-components";

import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { CONFIG } from "../../lib/config";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { Offer } from "../../lib/types/offer";
import { useDisputeResolver } from "../../lib/utils/hooks/useDisputeResolver";
import { fixformattedString } from "../../lib/utils/number";
import { buildCondition } from "../../pages/create-product/utils/buildCondition";
import { VariantV1 } from "../../pages/products/types";
import VariationSelects from "../../pages/products/VariationSelects";
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
import BosonButton from "../ui/BosonButton";
import Typography from "../ui/Typography";
import Video from "../ui/Video";
import { ProductButtonGroup } from "./Product.styles";
import { optionUnitKeys } from "./utils";
import { getFixedOrPercentageVal } from "./utils/termsOfExchange";
import { useCreateForm } from "./utils/useCreateForm";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  seller?: subgraph.SellerFieldsFragment;
  isMultiVariant: boolean;
  isOneSetOfImages: boolean;
  hasMultipleVariants: boolean;
  decimals?: number;
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
export default function Preview({
  togglePreview,
  seller,
  isMultiVariant,
  isOneSetOfImages,
  hasMultipleVariants,
  decimals
}: Props) {
  const { values } = useCreateForm();

  const redemptionPointUrl =
    values.shippingInfo.redemptionPointUrl &&
    values.shippingInfo.redemptionPointUrl.length > 0
      ? values.shippingInfo.redemptionPointUrl
      : window.origin;

  // if we have variants defined, then we show the first one in the preview
  const variantIndex = 0;
  const firstVariant = values.productVariants.variants[variantIndex];
  const exchangeSymbol = isMultiVariant
    ? firstVariant.currency.value
    : values.coreTermsOfSale.currency.value;
  const exchangeToken = CONFIG.defaultTokens.find(
    (n: Token) => n.symbol === exchangeSymbol
  );

  const productImages =
    isMultiVariant && !isOneSetOfImages
      ? values.productVariantsImages?.[variantIndex]?.productImages
      : values?.productImages;
  const thumbnailImg = productImages?.thumbnail?.[0]?.src || "";
  const sliderImages = map(productImages, (v) => v?.[0]?.src || "").filter(
    (ipfsLink) => ipfsLink
  );
  const offerImg = sliderImages?.[0] || "";

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
  const name = values.productInformation.productTitle || "Untitled";
  const price =
    (isMultiVariant ? firstVariant.price : values.coreTermsOfSale.price) || 0;
  const exchangeTokenDecimals = Number(exchangeToken?.decimals || 18);
  const priceBN = parseUnits(
    price < 0.1 ? fixformattedString(price) : price.toString(),
    exchangeTokenDecimals
  );

  const commonTermsOfSale = isMultiVariant
    ? values.variantsCoreTermsOfSale
    : values.coreTermsOfSale;
  const validFromDateInMS = commonTermsOfSale.offerValidityPeriod[0]
    .toDate()
    .getTime();
  const validUntilDateInMS = commonTermsOfSale.offerValidityPeriod[1]
    .toDate()
    .getTime();
  const voucherRedeemableFromDateInMS = commonTermsOfSale.redemptionPeriod[0]
    .toDate()
    .getTime();
  const voucherRedeemableUntilDateInMS = commonTermsOfSale.redemptionPeriod[1]
    .toDate()
    .getTime();
  const quantityAvailable = isMultiVariant
    ? firstVariant.quantity
    : values.coreTermsOfSale.quantity;

  const exchangeDate = Date.now().toString();

  const { tokenGating } = values;

  const condition =
    tokenGating.tokenType && values.productType.tokenGatedOffer === "true"
      ? buildCondition(tokenGating, decimals)
      : undefined;

  // Build the Offer structure (in the shape of SubGraph request), based on temporary data (values)
  const offer = {
    price: priceBN.toString(),
    sellerDeposit: getFixedOrPercentageVal(
      priceBN,
      values.termsOfExchange.sellerDeposit,
      values.termsOfExchange.sellerDepositUnit
        .value as keyof typeof optionUnitKeys,
      exchangeTokenDecimals
    ),
    protocolFee: "0",
    agentFee: "0",
    agentId: "0",
    buyerCancelPenalty: getFixedOrPercentageVal(
      priceBN,
      values.termsOfExchange.buyerCancellationPenalty,
      values.termsOfExchange.buyerCancellationPenaltyUnit
        .value as keyof typeof optionUnitKeys,
      exchangeTokenDecimals
    ),
    quantityAvailable: quantityAvailable.toString(),
    quantityInitial: quantityAvailable.toString(),
    validFromDate: (validFromDateInMS / 1000).toString(),
    validUntilDate: (validUntilDateInMS / 1000).toString(),
    voucherRedeemableFromDate: (
      voucherRedeemableFromDateInMS / 1000
    ).toString(),
    voucherRedeemableUntilDate: (
      voucherRedeemableUntilDateInMS / 1000
    ).toString(),
    disputePeriodDuration: `${
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
      // this 'or' should never occurr
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
    },
    condition: condition
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
  const animationUrl = values.productAnimation?.[0]?.src;
  const variant: VariantV1 = {
    offer,
    variations: [
      ...(values.productVariants?.colors?.filter(isTruthy).map((color) => ({
        id: color,
        option: color,
        type: "Color" as const
      })) ?? []),
      ...(values.productVariants?.sizes?.filter(isTruthy).map((size) => ({
        id: size,
        option: size,
        type: "Size" as const
      })) ?? [])
    ]
  };
  return (
    <PreviewWrapper>
      <PreviewWrapperContent>
        <DetailWrapper>
          <LightBackground>
            <MainDetailGrid>
              <ImageWrapper>
                {animationUrl ? (
                  <Video
                    src={animationUrl}
                    dataTestId="offerAnimationUrl"
                    videoProps={{ muted: true, loop: true, autoPlay: true }}
                    componentWhileLoading={() => (
                      <Image src={thumbnailImg} dataTestId="offerImage" />
                    )}
                  />
                ) : (
                  <Image src={thumbnailImg} dataTestId="offerImage" />
                )}
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
                {isMultiVariant && (
                  <VariationSelects
                    selectedVariant={variant as VariantV1}
                    variants={[variant] as VariantV1[]}
                    disabled
                  />
                )}
                <DetailWidget
                  isPreview={true}
                  pageType="offer"
                  offer={offer}
                  name={name}
                  image={offerImg}
                  hasSellerEnoughFunds={true}
                  hasMultipleVariants={hasMultipleVariants}
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
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {values.productInformation.description}
                </Typography>
                {/* TODO: hidden for now */}
                {/* <DetailTable data={productAttributes ?? []} /> */}
              </div>
              <div>
                <Typography tag="h3">About the creator</Typography>
                <Typography
                  tag="p"
                  color={colors.darkGrey}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {values.createYourProfile.description}
                </Typography>
              </div>
            </DetailGrid>
            <DetailSlider images={sliderImages} />
            <DetailGrid>
              {(values.shippingInfo.returnPeriod ||
                (values?.shippingInfo?.jurisdiction?.length > 0 &&
                  values?.shippingInfo?.jurisdiction[0]?.region?.length >
                    0)) && (
                <div>
                  <Typography tag="h3">Shipping information</Typography>
                  <Typography tag="p" style={{ color: colors.darkGrey }}>
                    Return period: {values.shippingInfo.returnPeriod}{" "}
                    {values.shippingInfo.returnPeriod === 1 ? "day" : "days"}
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
              )}
            </DetailGrid>
          </DarkerBackground>
        </DetailWrapper>
      </PreviewWrapperContent>
      <ProductButtonGroup>
        <BosonButton variant="primaryFill" type="submit">
          Confirm
        </BosonButton>
        <BosonButton
          variant="accentInverted"
          type="button"
          onClick={handleClosePreview}
        >
          Back to overview
        </BosonButton>
      </ProductButtonGroup>
    </PreviewWrapper>
  );
}
