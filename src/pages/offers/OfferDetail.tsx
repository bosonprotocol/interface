import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { useMemo } from "react";
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
import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import useCheckExchangePolicy from "../../lib/utils/hooks/offer/useCheckExchangePolicy";
import useOffer from "../../lib/utils/hooks/offer/useOffer";
import {
  useSellerCurationListFn,
  useSellers
} from "../../lib/utils/hooks/useSellers";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";
import NotFound from "../not-found/NotFound";

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();

  const {
    data: offer,
    isError,
    isLoading,
    refetch: reload
  } = useOffer(
    {
      offerId: offerId || ""
    },
    { enabled: !!offerId }
  );
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

  const sellerId = offer?.seller.id;
  const checkIfSellerIsInCurationList = useSellerCurationListFn();

  const isSellerCurated = useMemo(() => {
    const isSellerInCurationList =
      sellerId && checkIfSellerIsInCurationList(sellerId);
    return isSellerInCurationList;
  }, [sellerId, checkIfSellerIsInCurationList]);

  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: offer?.id
  });

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

  if (!offer.isValid) {
    return (
      <EmptyErrorMessage
        title="Invalid offer"
        message="This offer does not match the expected metadata standard this application enforces"
      />
    );
  }

  if (!isSellerCurated) {
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
                style={{ fontSize: "2rem", marginBottom: "2rem" }}
              >
                {name}
              </Typography>
            </>

            <DetailWidget
              pageType="offer"
              offer={offer}
              name={name}
              image={offerImg}
              hasSellerEnoughFunds={hasSellerEnoughFunds}
              exchangePolicyCheckResult={exchangePolicyCheckResult}
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
