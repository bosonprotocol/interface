import { useParams } from "react-router-dom";

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
import { UrlParameters } from "../../lib/routing/parameters";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../lib/utils/hooks/useSellers";

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
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

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

  if (!exchangeId) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
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
  const buyerAddress = exchange.buyer.wallet;

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
    <>
      <DetailWrapper>
        <LightBackground>
          <MainDetailGrid>
            <ImageWrapper>
              <DetailOpenSea exchange={exchange} />
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
                style={{ fontSize: "2rem", marginBottom: "4rem" }}
              >
                {name}
              </Typography>

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
              <Typography tag="p" data-testid="description">
                {description}
              </Typography>
              {/* TODO: hidden for now */}
              {/* <DetailTable data={productData} tag="strong" inheritColor /> */}
            </div>
            <div>
              <Typography tag="h3">About the creator</Typography>
              <Typography tag="p">{artistDescription}</Typography>
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
            {(!!shippingInfo.shipping ||
              !!shippingInfo.shippingTable.length) && (
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
    </>
  );
}
