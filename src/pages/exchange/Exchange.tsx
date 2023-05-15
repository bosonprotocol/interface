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
import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
// DETAILS COMPONENTS ABOVE
import Image from "../../components/ui/Image";
import Loading from "../../components/ui/Loading";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { useCurationLists } from "../../lib/utils/hooks/useCurationLists";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import {
  useSellerCurationListFn,
  useSellers
} from "../../lib/utils/hooks/useSellers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import { VariantV1 } from "../products/types";
import VariationSelects from "../products/VariationSelects";

const marginBottom = "4rem";

const StyledVariationSelects = styled(VariationSelects)`
  margin-bottom: ${marginBottom};
`;

export default function Exchange() {
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();

  const {
    data: exchanges,
    isError,
    isLoading,
    refetch: reload
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
  const curationLists = useCurationLists();
  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const isSellerCurated = useMemo(() => {
    const isSellerInCurationList =
      !curationLists.enableCurationLists ||
      (sellerId && checkIfSellerIsInCurationList(sellerId));
    return isSellerInCurationList;
  }, [sellerId, checkIfSellerIsInCurationList, curationLists]);

  const variant = {
    offer,
    variations
  };
  const textColor = useCustomStoreQueryParameter("textColor");

  const { data: sellers } = useSellers(
    {
      id: offer?.seller.id,
      includeFunds: true
    },
    {
      enabled: !!offer?.seller.id
    }
  );
  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(offer?.sellerDeposit || 0);
  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !exchangeId) {
    return (
      <div data-testid="errorExchange">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offer) {
    return <div data-testid="notFound">This exchange does not exist</div>;
  }

  if (!offer.isValid) {
    return (
      <div data-testid="invalidMetadata">
        This offer does not match the expected metadata standard this
        application enforces
      </div>
    );
  }

  if (!isSellerCurated) {
    return (
      <div data-testid="notCuratedSeller">
        Seller account {sellerId} has been banned.
      </div>
    );
  }
  const buyerAddress = exchange.buyer.wallet;

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
                    <Image src={offerImg} dataTestId="offerImage" />
                  )}
                />
              ) : (
                <Image src={offerImg} dataTestId="offerImage" />
              )}
            </ImageWrapper>
            <div>
              <>
                <SellerID
                  offer={offer}
                  buyerOrSeller={offer?.seller}
                  justifyContent="flex-start"
                  withProfileImage
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
                  selectedVariant={variant as VariantV1}
                  variants={[variant] as VariantV1[]}
                  disabled
                />
              )}

              <DetailWidget
                pageType="exchange"
                offer={offer}
                exchange={exchange}
                name={name}
                image={offerImg}
                hasSellerEnoughFunds={hasSellerEnoughFunds}
                reload={reload}
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
