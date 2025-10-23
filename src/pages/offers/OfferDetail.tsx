import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import useProductByOfferId from "lib/utils/hooks/product/useProductByOfferId";
import { OfferFullDescription } from "pages/common/OfferFullDescription";
import { VariantV1 } from "pages/products/types";
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
import SellerID from "../../components/ui/SellerID";
import { Typography } from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import { getOfferDetails } from "../../lib/utils/offer/getOfferDetails";
import NotFound from "../not-found/NotFound";
const ObjectContainImage = styled(Image)`
  > * {
    object-fit: contain;
  }
`;
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
  const sellerId = offer?.seller?.id;
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

  const { name, offerImg, animationUrl } = getOfferDetails(offer.metadata);
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
                offerMetadata={offer.metadata}
                accountToShow={offer?.seller || undefined}
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
