import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { OfferFullDescription } from "pages/common/OfferFullDescription";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";

import {
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid,
  SellerAndOpenSeaGrid
} from "../../components/detail/Detail.style";
import DetailShare from "../../components/detail/DetailShare";
import Image from "../../components/ui/Image";
import SellerID, { Seller } from "../../components/ui/SellerID";
import { Typography } from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import {
  getOfferAnimationUrl,
  getOfferDetails
} from "../../lib/utils/getOfferDetails";
import useProductByUuid from "../../lib/utils/hooks/product/useProductByUuid";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import NotFound from "../not-found/NotFound";
import { VariantV1 } from "./types";
import VariationSelects from "./VariationSelects";
const ObjectContainImage = styled(Image)`
  > * {
    object-fit: contain;
  }
`;
export default function ProductDetail() {
  const {
    [UrlParameters.uuid]: productUuid = "",
    [UrlParameters.sellerId]: sellerId = ""
  } = useParams();
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

  const { name, offerImg } = getOfferDetails(selectedOffer);
  const OfferImage = (
    <ObjectContainImage
      src={offerImg || ""}
      dataTestId="offerImage"
      alt="Offer"
    />
  );
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
                componentWhileLoading={() => OfferImage}
              />
            ) : (
              OfferImage
            )}
            <SellerAndOpenSeaGrid>
              <SellerID
                offer={selectedOffer}
                buyerOrSeller={selectedOffer?.seller as Seller}
                justifyContent="flex-start"
                withProfileImage
              />
            </SellerAndOpenSeaGrid>
          </ImageWrapper>
          <div style={{ width: "100%" }}>
            <>
              <Typography
                tag="h1"
                data-testid="name"
                style={{ fontSize: "2rem", marginBottom: "2rem", marginTop: 0 }}
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
            <CommitDetailWidget
              selectedVariant={selectedVariant}
              isPreview={false}
            />
          </div>
          <DetailShare />
        </MainDetailGrid>
      </LightBackground>
      <OfferFullDescription offer={selectedVariant.offer} exchange={null} />
    </DetailWrapper>
  );
}
