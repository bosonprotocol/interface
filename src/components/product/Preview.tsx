import { Grid, subgraph } from "@bosonprotocol/react-kit";
import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { Spinner } from "components/loading/Spinner";
import Loading from "components/ui/Loading";
import { ChatInitializationStatus } from "lib/utils/hooks/chat/useChatStatus";
import map from "lodash/map";
import { useChatContext } from "pages/chat/ChatProvider/ChatContext";
import { OfferFullDescription } from "pages/common/OfferFullDescription";
import { AgreeToTermsAndSellerAgreement } from "pages/create-product/AgreeToTermsAndSellerAgreement";
import styled from "styled-components";

import Image from "../../components/ui/Image";
import SellerID, { Seller } from "../../components/ui/SellerID";
import { isTruthy } from "../../lib/types/helpers";
import { useForm } from "../../lib/utils/hooks/useForm";
import { VariantV1 } from "../../pages/products/types";
import VariationSelects from "../../pages/products/VariationSelects";
import {
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid,
  SellerAndOpenSeaGrid
} from "../detail/Detail.style";
import BosonButton from "../ui/BosonButton";
import { Typography } from "../ui/Typography";
import Video from "../ui/Video";
import { ConfirmProductDetailsButtonGroup } from "./confirmProductDetailsPage/ConfirmProductDetails.styles";
import { usePreviewOffers } from "./utils/usePreviewOffers";
const ObjectContainImage = styled(Image)`
  > * {
    object-fit: contain;
  }
`;
interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
  seller?: subgraph.SellerFieldsFragment;
  isMultiVariant: boolean;
  isOneSetOfImages: boolean;
  decimals?: number;
  chatInitializationStatus: ChatInitializationStatus;
}

const PreviewWrapper = styled.div`
  margin: 2rem auto;
  max-width: 90%;
`;
const PreviewWrapperContent = styled.div`
  overflow: hidden;
  box-shadow:
    0px 0px 4px rgba(0, 0, 0, 0.1),
    0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1),
    0px 0px 32px rgba(0, 0, 0, 0.1);
`;
export default function Preview({
  togglePreview,
  seller,
  isMultiVariant,
  isOneSetOfImages,
  decimals,
  chatInitializationStatus
}: Props) {
  const { bosonXmtp } = useChatContext();

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
  const offerImg: string = sliderImages?.[0] || "";

  const handleClosePreview = () => {
    togglePreview(false);
  };
  const name = values.productInformation.productTitle || "Untitled";

  const previewOffers = usePreviewOffers({
    isMultiVariant,
    seller,
    overrides: { decimals, offerImg, visuals_images: sliderImages }
  });
  // Build the Offer structure (in the shape of SubGraph request), based on temporary data (values)
  const [offer] = previewOffers;
  if (!offer.seller) {
    return (
      <>
        <Loading />
        <BosonButton
          variant="accentInverted"
          type="button"
          onClick={handleClosePreview}
        >
          Back to overview
        </BosonButton>
      </>
    );
  }
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
      displayType: "date"
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
  const OfferImage = (
    <ObjectContainImage
      src={thumbnailImg || ""}
      dataTestId="offerImage"
      alt="Offer"
    />
  );
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
                    componentWhileLoading={() => OfferImage}
                    withMuteButton
                  />
                ) : (
                  OfferImage
                )}
                <SellerAndOpenSeaGrid>
                  <SellerID
                    offer={offer}
                    buyerOrSeller={offer?.seller as Seller}
                    justifyContent="flex-start"
                    withProfileImage
                    onClick={null}
                  />
                </SellerAndOpenSeaGrid>
              </ImageWrapper>
              <div style={{ width: "100%" }}>
                <Typography
                  tag="h1"
                  data-testid="name"
                  fontSize="2rem"
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
                <CommitDetailWidget
                  selectedVariant={variant}
                  isPreview={true}
                  name={name}
                  image={offerImg}
                />
              </div>
            </MainDetailGrid>
          </LightBackground>
          <OfferFullDescription offer={offer} exchange={null} />
        </DetailWrapper>
      </PreviewWrapperContent>
      <Grid
        flexDirection="column"
        marginTop="5rem"
        alignItems="flex-start"
        gap="1rem"
      >
        <AgreeToTermsAndSellerAgreement isMultiVariant={isMultiVariant} />
        <ConfirmProductDetailsButtonGroup>
          <BosonButton
            variant="primaryFill"
            type="submit"
            disabled={
              ![
                ChatInitializationStatus.INITIALIZED,
                ChatInitializationStatus.ALREADY_INITIALIZED
              ].includes(chatInitializationStatus) ||
              !values.confirmProductDetails?.acceptsTerms
            }
          >
            {chatInitializationStatus ===
              ChatInitializationStatus.NOT_INITIALIZED && bosonXmtp ? (
              <Spinner size={20} />
            ) : (
              "Confirm"
            )}
          </BosonButton>
          <BosonButton
            variant="accentInverted"
            type="button"
            onClick={handleClosePreview}
          >
            Back to overview
          </BosonButton>
        </ConfirmProductDetailsButtonGroup>
      </Grid>
    </PreviewWrapper>
  );
}
