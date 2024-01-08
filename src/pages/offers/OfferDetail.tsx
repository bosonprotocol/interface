import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import useProductByOfferId from "lib/utils/hooks/product/useProductByOfferId";
import { VariantV1 } from "pages/products/types";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DarkerBackground,
  DetailGrid,
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid
} from "../../components/detail/Detail.style";
import DetailChart from "../../components/detail/DetailChart";
import DetailShare from "../../components/detail/DetailShare";
import DetailSlider from "../../components/detail/DetailSlider";
import DetailTable from "../../components/detail/DetailTable";
import Image from "../../components/ui/Image";
import SellerID, { Seller } from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import NotFound from "../not-found/NotFound";

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();

  const {
    data: productResult,
    isError,
    isLoading
  } = useProductByOfferId(offerId || "", { enabled: !!offerId });

  const variants = productResult?.variants;
  const variantsWithV1 = variants?.filter(
    ({ offer: { metadata } }) => metadata?.type === "PRODUCT_V1"
  ) as VariantV1[] | undefined;
  const defaultVariant =
    variantsWithV1?.find((variant) => !variant.offer.voided) ||
    variantsWithV1?.[0];
  const { offer } = defaultVariant || {};
  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant]);
  const textColor = useCustomStoreQueryParameter("textColor");

  const sellerId = offer?.seller.id;
  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const isSellerCurated = useMemo(() => {
    const isSellerInCurationList =
      sellerId && checkIfSellerIsInCurationList(sellerId);
    return isSellerInCurationList;
  }, [sellerId, checkIfSellerIsInCurationList]);

  if (!offerId) {
    return null;
  }

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError) {
    return (
      <EmptyErrorMessage
        title="Error"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (!offer) {
    return (
      <EmptyErrorMessage
        title="Not found"
        message="This offer does not exist"
      />
    );
  }

  if (!isSellerCurated || !selectedVariant) {
    return <NotFound />;
  }

  const {
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    // productData,
    artistDescription,
    images
  } = getOfferDetails(offer);

  return (
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
                  <Image src={offerImg ?? ""} dataTestId="offerImage" />
                )}
              />
            ) : (
              <Image src={offerImg ?? ""} dataTestId="offerImage" />
            )}
          </ImageWrapper>
          <div style={{ width: "100%" }}>
            <>
              <SellerID
                offer={offer}
                buyerOrSeller={offer?.seller as Seller}
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
            </>

            {/* <DetailWidget
              pageType="offer"
              offer={offer}
              name={name}
              image={offerImg}
              hasSellerEnoughFunds={hasSellerEnoughFunds}
              exchangePolicyCheckResult={exchangePolicyCheckResult}
              reload={reload}
            /> */}
            <CommitDetailWidget
              selectedVariant={selectedVariant}
              hasMultipleVariants={false}
              isPreview={false}
            />
          </div>
          <DetailShare />
        </MainDetailGrid>
      </LightBackground>
      <DarkerBackground>
        <DetailGrid>
          <div>
            <Typography tag="h3">Product description</Typography>
            <Typography
              tag="p"
              data-testid="description"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {description}
            </Typography>
            {/* TODO: hidden for now */}
            {/* <DetailTable data={productData} tag="strong" inheritColor /> */}
          </div>
          <div>
            <Typography tag="h3">About the creator</Typography>
            <Typography tag="p" style={{ whiteSpace: "pre-wrap" }}>
              {artistDescription}
            </Typography>
          </div>
        </DetailGrid>
        {images.length > 0 && <DetailSlider images={images} />}
        <DetailGrid>
          <DetailChart offer={offer} title="Inventory graph" />
          {(shippingInfo.returnPeriodInDays !== undefined ||
            !!shippingInfo.shippingTable.length) && (
            <div>
              <Typography tag="h3">Shipping information</Typography>
              <Typography
                tag="p"
                style={{ color: textColor || colors.darkGrey }}
              >
                Return period: {shippingInfo.returnPeriodInDays}{" "}
                {shippingInfo.returnPeriodInDays === 1 ? "day" : "days"}
              </Typography>
              <DetailTable data={shippingInfo.shippingTable} inheritColor />
            </div>
          )}
        </DetailGrid>
      </DarkerBackground>
    </DetailWrapper>
  );
}
