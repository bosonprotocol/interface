import { hooks, PhygitalLabel } from "@bosonprotocol/react-kit";
import { CommitDetailWidget } from "components/detail/DetailWidget/CommitDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { isTruthy } from "lib/types/helpers";
import { Offer } from "lib/types/offer";
import { getProductV1BundleItemsFilter } from "lib/utils/bundle/filter";
import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import { OfferFullDescription } from "pages/common/OfferFullDescription";
import { VariantV1 } from "pages/products/types";
import VariationSelects from "pages/products/VariationSelects";
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
import NotFound from "../not-found/NotFound";

const ObjectContainImage = styled(Image)`
  > * {
    object-fit: contain;
  }
`;
export default function BundleDetail() {
  const {
    [UrlParameters.uuid]: bundleUuid = "",
    [UrlParameters.sellerId]: sellerId = ""
  } = useParams();
  const coreSDK = useCoreSDK();
  const {
    data: bundleResult,
    isError,
    isLoading
  } = hooks.useBundleByUuid(sellerId, bundleUuid, coreSDK, {
    enabled: !!bundleUuid
  });

  const variantsWithV1: VariantV1[] | undefined = useMemo(
    () =>
      bundleResult
        ?.flatMap((bundle) => {
          const bundleItems = bundle.items;
          const productV1Items = bundleItems
            ? getProductV1BundleItemsFilter(bundleItems)
            : undefined;
          if (!productV1Items) {
            return null;
          }
          return productV1Items.map(
            (productV1Item) =>
              ({
                variations: productV1Item.variations,
                offer: bundle.offer
              }) as VariantV1
          );
        })
        .filter(isTruthy),
    [bundleResult]
  );

  const defaultVariant: VariantV1 | undefined =
    variantsWithV1?.find((variant) => !variant.offer.voided) ??
    variantsWithV1?.[0];

  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  const selectedOffer: Offer | undefined = selectedVariant?.offer;
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

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError) {
    return (
      <EmptyErrorMessage
        title="Error while retrieving this bundle"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (
    (!bundleResult && !isLoading && !isError) ||
    !selectedOffer ||
    !selectedOffer.metadata
  ) {
    return (
      <EmptyErrorMessage
        title={
          bundleResult
            ? "This bundle does not have a physical item"
            : "This bundle does not exist"
        }
        message="Check if you selected the appropiate chain in the top bar"
      />
    );
  }

  if (!isSellerCurated) {
    return <NotFound />;
  }
  const { name, mainImage, animationUrl } = getOfferDetails(
    selectedOffer.metadata
  );
  const OfferImage = (
    <ObjectContainImage src={mainImage} dataTestId="offerImage" alt="Offer" />
  );
  return (
    <DetailWrapper>
      <LightBackground>
        <MainDetailGrid>
          <ImageWrapper>
            <PhygitalLabel />
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
                offerMetadata={selectedOffer.metadata}
                accountToShow={selectedOffer?.seller}
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

              {hasVariants && selectedVariant && variantsWithV1 && (
                <VariationSelects
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                  variants={variantsWithV1}
                />
              )}
            </>
            {selectedVariant && (
              <CommitDetailWidget
                selectedVariant={selectedVariant}
                isPreview={false}
              />
            )}
          </div>
          <DetailShare />
        </MainDetailGrid>
      </LightBackground>
      <OfferFullDescription offer={selectedOffer} exchange={null} />
    </DetailWrapper>
  );
}
