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
import Loading from "../../components/ui/Loading";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import Video from "../../components/ui/Video";
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
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
    isLoading
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

  if (!offerId) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div data-testid="errorOffer">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offer) {
    return <div data-testid="notFound">This offer does not exist</div>;
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
