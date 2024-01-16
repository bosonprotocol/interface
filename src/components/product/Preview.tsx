import { subgraph } from "@bosonprotocol/react-kit";
import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import map from "lodash/map";
import styled from "styled-components";

import Image from "../../components/ui/Image";
import SellerID, { Seller } from "../../components/ui/SellerID";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { useForm } from "../../lib/utils/hooks/useForm";
import { VariantV1 } from "../../pages/products/types";
import VariationSelects from "../../pages/products/VariationSelects";
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
import { usePreviewOffers } from "./utils/usePreviewOffer";

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  seller?: subgraph.SellerFieldsFragment;
  isMultiVariant: boolean;
  isOneSetOfImages: boolean;
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
  decimals
}: Props) {
  const { values } = useForm();

  // if we have variants defined, then we show the first one in the preview
  const variantIndex = 0;
  const productImages =
    isMultiVariant && !isOneSetOfImages
      ? values.productVariantsImages?.[variantIndex]?.productImages
      : values?.productImages;
  const thumbnailImg = productImages?.thumbnail?.[0]?.src || "";
  const sliderImages = map(productImages, (v) => v?.[0]?.src || "").filter(
    (ipfsLink) => ipfsLink
  );
  const offerImg = sliderImages?.[0] || "";

  const handleClosePreview = () => {
    togglePreview(false);
  };
  const name = values.productInformation.productTitle || "Untitled";

  const previewOffers = usePreviewOffers({
    isMultiVariant,
    seller,
    overrides: { decimals }
  });
  // Build the Offer structure (in the shape of SubGraph request), based on temporary data (values)
  const [offer] = previewOffers;
  /*
  // TODO: hidden for now
  const redemptionPointUrl =
    values.shippingInfo.redemptionPointUrl &&
    values.shippingInfo.redemptionPointUrl.length > 0
      ? values.shippingInfo.redemptionPointUrl
      : window.origin;
  const commonTermsOfSale = isMultiVariant
    ? values.variantsCoreTermsOfSale
    : values.coreTermsOfSale;
  const {
    offerValidityPeriod,
    redemptionPeriod,
    infiniteExpirationOffers,
    voucherValidDurationInDays
  } = commonTermsOfSale;

  const { voucherRedeemableUntilDateInMS, voucherValidDurationInMS } =
    extractOfferTimestamps({
      offerValidityPeriod,
      redemptionPeriod,
      infiniteExpirationOffers: !!infiniteExpirationOffers,
      voucherValidDurationInDays
    });
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
  if (voucherRedeemableUntilDateInMS) {
    productAttributes.push({
      name: "Redeemable Until",
      value: new Date(voucherRedeemableUntilDateInMS).toString(),
      display_type: "date"
    });
  } else {
    productAttributes.push({
      name: ProductMetadataAttributeKeys["Redeemable After X Days"],
      value: (voucherValidDurationInMS / 86400000).toString()
    });
  }

  productAttributes.push({
    name: "Seller",
    value: values.createYourProfile?.name || ""
  });
  productAttributes.push({
    name: "Offer Category",
    value: values.productType?.productType?.toUpperCase() || ""
  });
  */
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
              <div style={{ width: "100%" }}>
                <SellerID
                  offer={offer}
                  buyerOrSeller={offer?.seller as Seller}
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
                {/* <DetailWidget
                  isPreview={true}
                  pageType="offer"
                  offer={offer}
                  name={name}
                  image={offerImg}
                  hasSellerEnoughFunds={true}
                  hasMultipleVariants={hasMultipleVariants}
                  exchangePolicyCheckResult={exchangePolicyCheckResult}
                /> */}
                <CommitDetailWidget
                  selectedVariant={variant}
                  isPreview={true}
                  name={name}
                  image={offerImg}
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
                  (values?.shippingInfo?.jurisdiction[0]?.region?.length ?? 0) >
                    0)) && (
                <div>
                  <Typography tag="h3">Shipping information</Typography>
                  <Typography tag="p" style={{ color: colors.darkGrey }}>
                    Return period: {values.shippingInfo.returnPeriod}{" "}
                    {values.shippingInfo.returnPeriod === 1 ? "day" : "days"}
                  </Typography>
                  <DetailTable
                    data={map(
                      values?.shippingInfo?.jurisdiction.filter(
                        (v) => v.time && v.region
                      ),
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
