import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
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
// import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID, { Seller } from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import {
  getOfferAnimationUrl,
  getOfferDetails
} from "../../lib/utils/getOfferDetails";
import useProductByUuid from "../../lib/utils/hooks/product/useProductByUuid";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import NotFound from "../not-found/NotFound";
import { VariantV1 } from "./types";
import VariationSelects from "./VariationSelects";

export default function ProductDetail() {
  const {
    [UrlParameters.uuid]: productUuid = "",
    [UrlParameters.sellerId]: sellerId = ""
  } = useParams();
  const textColor = useCustomStoreQueryParameter("textColor");
  const {
    data: productResult,
    isError,
    isLoading
  } = useProductByUuid(sellerId, productUuid, { enabled: !!productUuid });

  const product = productResult?.product;
  const variants = productResult?.variants;
  const variantsWithV1 = variants?.filter(
    ({ offer: { metadata } }) => metadata?.type === "PRODUCT_V1"
  ) as VariantV1[] | undefined;
  const defaultVariant =
    variantsWithV1?.find((variant) => !variant.offer.voided) ||
    variantsWithV1?.[0];

  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  const selectedOffer = selectedVariant?.offer;

  const animationUrl = useMemo(
    () => getOfferAnimationUrl(selectedOffer),
    [selectedOffer]
  );
  const hasVariants =
    !!variantsWithV1?.length &&
    variantsWithV1.every((variant) => !!variant.variations.length);
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant]);

  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const isSellerCurated = useMemo(() => {
    const isSellerInCurationList =
      sellerId && checkIfSellerIsInCurationList(sellerId);
    return isSellerInCurationList;
  }, [sellerId, checkIfSellerIsInCurationList]);

  const { data: exchanges } = useExchanges(
    {
      offerId: selectedOffer?.id || "",
      disputed: null
    },
    {
      enabled: !!selectedOffer?.id
    }
  );

  if (selectedOffer) {
    selectedOffer.exchanges = exchanges;
  }

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError) {
    return (
      <EmptyErrorMessage
        title="Error while retrieving this product"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (
    (!productResult && !isLoading && !isError) ||
    !selectedOffer ||
    !product ||
    !product.id
  ) {
    return (
      <EmptyErrorMessage
        title="This product does not exist"
        message="Check if you selected the appropiate chain in the top bar"
      />
    );
  }

  if (!isSellerCurated) {
    return <NotFound />;
  }

  const {
    name,
    offerImg,
    shippingInfo,
    description,
    artistDescription,
    images
  } = getOfferDetails(selectedOffer);

  return (
    <DetailWrapper>
      <LightBackground>
        <MainDetailGrid>
          <ImageWrapper>
            {animationUrl ? (
              <Video
                src={animationUrl}
                videoProps={{
                  muted: true,
                  loop: true,
                  autoPlay: true
                }}
                componentWhileLoading={() => (
                  <Image src={offerImg || ""} alt="Offer image" />
                )}
              />
            ) : (
              <Image src={offerImg || ""} dataTestId="offerImage" />
            )}
          </ImageWrapper>
          <div style={{ width: "100%" }}>
            <>
              <SellerID
                offer={selectedOffer}
                buyerOrSeller={selectedOffer?.seller as Seller}
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

              {hasVariants && (
                <VariationSelects
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                  variants={variantsWithV1}
                />
              )}
            </>

            {/* <DetailWidget
              pageType="offer"
              offer={selectedOffer}
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
          <DetailChart offer={selectedOffer} title="Inventory graph" />
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
