import { ExchangeDetailWidget } from "components/detail/DetailWidget/ExchangeDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { OfferFullDescription } from "pages/common/OfferFullDescription";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import {
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid,
  SellerAndOpenSeaGrid
} from "../../components/detail/Detail.style";
import DetailOpenSea from "../../components/detail/DetailOpenSea";
import DetailShare from "../../components/detail/DetailShare";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import { Typography } from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { useLensProfilesPerSellerIds } from "../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import {
  useSellerCurationListFn,
  useSellers
} from "../../lib/utils/hooks/useSellers";
import NotFound from "../not-found/NotFound";
import { VariantV1 } from "../products/types";
import VariationSelects from "../products/VariationSelects";

const marginBottom = "1rem";

const StyledVariationSelects = styled(VariationSelects)`
  margin-bottom: 0;
  > * {
    margin-bottom: 0;
  }
`;

export default function Exchange() {
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();

  const {
    data: exchanges,
    isError,
    isLoading
  } = useExchanges(
    {
      id: exchangeId,
      disputed: null
    },
    {
      enabled: !!exchangeId,
      onlyCuratedSeller: false // fetch the exchange in any case, page will be filtered later
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;
  const metadata = offer?.metadata;
  const variations = metadata?.variations;
  const hasVariations = !!variations?.length;
  const sellerId = exchange?.seller.id;
  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const isSellerCurated = useMemo(() => {
    const isSellerInCurationList =
      sellerId && checkIfSellerIsInCurationList(sellerId);
    return isSellerInCurationList;
  }, [sellerId, checkIfSellerIsInCurationList]);
  const { data: sellers } = useSellers(
    {
      id: sellerId,
      includeFunds: true
    },
    {
      enabled: !!sellerId
    }
  );
  // fetch lensProfile for current SellerId
  const seller = sellers?.[0];
  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers: seller ? [seller] : [] },
    { enabled: !!seller }
  );
  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError || !exchangeId) {
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
        message="This exchange does not exist"
      />
    );
  }
  const variant = {
    offer,
    variations: variations ?? []
  } as VariantV1;

  const sellerLensProfile = seller
    ? sellerLensProfilePerSellerId?.get(seller.id)
    : undefined;

  if (!offer.isValid) {
    return (
      <EmptyErrorMessage
        title="Invalid offer/exchange"
        message="The offer of this exchange does not match the expected metadata standard this application enforces"
      />
    );
  }

  if (!isSellerCurated) {
    return <NotFound />;
  }

  const { name, offerImg, animationUrl } = getOfferDetails(offer);

  return (
    <>
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
              <SellerAndOpenSeaGrid>
                <SellerID
                  offer={offer}
                  buyerOrSeller={exchange?.seller}
                  justifyContent="flex-start"
                  withProfileImage
                  lensProfile={sellerLensProfile}
                />
                <DetailOpenSea exchange={exchange} />
              </SellerAndOpenSeaGrid>
            </ImageWrapper>
            <div style={{ width: "100%" }}>
              <>
                <Typography
                  tag="h1"
                  data-testid="name"
                  style={{
                    fontSize: "2rem",
                    ...(!hasVariations && { marginBottom }),
                    marginTop: 0
                  }}
                >
                  {name}
                </Typography>
              </>
              {hasVariations && (
                <StyledVariationSelects
                  selectedVariant={variant}
                  variants={[variant]}
                  disabled
                />
              )}

              <ExchangeDetailWidget exchange={exchange} variant={variant} />
            </div>
            <DetailShare />
          </MainDetailGrid>
        </LightBackground>
        <OfferFullDescription offer={offer} exchange={exchange} />
      </DetailWrapper>
    </>
  );
}
