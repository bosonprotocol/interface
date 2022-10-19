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
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import useOffer from "../../lib/utils/hooks/offer/useOffer";
import { useSellers } from "../../lib/utils/hooks/useSellers";

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();
  console.log(
    "🚀  roberto --  ~ file: OfferDetail.tsx ~ line 28 ~ OfferDetail ~ offerId",
    offerId
  );

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

  const { data: sellers } = useSellers({
    id: offer?.seller.id,
    includeFunds: true
  });
  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = offer?.sellerDeposit;
  const hasSellerEnoughFunds =
    Number(sellerAvailableDeposit) >= Number(offerRequiredDeposit);

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

  const {
    name,
    offerImg,
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
            <Image src={offerImg} dataTestId="offerImage" />
          </ImageWrapper>
          <div>
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
          {(!!shippingInfo.shipping || !!shippingInfo.shippingTable.length) && (
            <div>
              <Typography tag="h3">Shipping information</Typography>
              <Typography tag="p" style={{ color: colors.darkGrey }}>
                {shippingInfo.shipping}
              </Typography>
              <DetailTable data={shippingInfo.shippingTable} inheritColor />
            </div>
          )}
        </DetailGrid>
      </DarkerBackground>
    </DetailWrapper>
  );
}
