import { ExchangeDetailWidget } from "components/detail/DetailWidget/ExchangeDetailWidget";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import {
  DarkerBackground,
  DetailGrid,
  DetailWrapper,
  ImageWrapper,
  LightBackground,
  MainDetailGrid
} from "../../components/detail/Detail.style";
import DetailOpenSea from "../../components/detail/DetailOpenSea";
import DetailShare from "../../components/detail/DetailShare";
import DetailSlider from "../../components/detail/DetailSlider";
import DetailTable from "../../components/detail/DetailTable";
import DetailTransactions from "../../components/detail/DetailTransactions";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { useLensProfilesPerSellerIds } from "../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import {
  useSellerCurationListFn,
  useSellers
} from "../../lib/utils/hooks/useSellers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
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
  const textColor = useCustomStoreQueryParameter("textColor");
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
  const buyerAddress = exchange.buyer.wallet;

  const {
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    artistDescription,
    images
  } = getOfferDetails(offer);

  return (
    <>
      <DetailWrapper>
        <LightBackground>
          <MainDetailGrid>
            <ImageWrapper>
              <DetailOpenSea exchange={exchange} />
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
                  buyerOrSeller={exchange?.seller}
                  justifyContent="flex-start"
                  withProfileImage
                  lensProfile={sellerLensProfile}
                />
                <Typography
                  tag="h1"
                  data-testid="name"
                  style={{
                    fontSize: "2rem",
                    ...(!hasVariations && { marginBottom })
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
            <DetailTransactions
              title="Transaction History (this item)"
              exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
              offer={offer}
              buyerAddress={buyerAddress}
            />
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
    </>
  );
}
