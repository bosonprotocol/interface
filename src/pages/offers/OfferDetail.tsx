import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import {
  DarkerBackground,
  DetailGrid,
  DetailWrapper,
  ImageWrapper,
  InfoIcon,
  InfoIconTextWrapper,
  LightBackground,
  MainDetailGrid,
  Tab,
  Tabs,
  Toggle,
  WidgetContainer
} from "../../components/detail/Detail.style";
import DetailChart from "../../components/detail/DetailChart";
import DetailShare from "../../components/detail/DetailShare";
import DetailSlider from "../../components/detail/DetailSlider";
import DetailTable from "../../components/detail/DetailTable";
import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { getOfferDetails } from "../../lib/utils/hooks/getOfferDetails";
import useOffer from "../../lib/utils/hooks/offer/useOffer";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import { isAccountSeller } from "../../lib/utils/isAccountSeller";
import { useCustomStoreQueryParameter } from "../custom-store/useCustomStoreQueryParameter";

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();

  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fromAccountPage =
    (location.state as { from: string })?.from === BosonRoutes.YourAccount;
  const [isTabSellerSelected, setTabSellerSelected] =
    useState<boolean>(fromAccountPage);
  const { address: account } = useAccount();
  const address = account || "";
  const customMetaTransactionsApiKey = useCustomStoreQueryParameter(
    "metaTransactionsApiKey"
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
    admin: offer?.seller.admin,
    includeFunds: true
  });
  const sellerAvailableDeposit = sellers?.[0].funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = offer?.sellerDeposit;
  const hasSellerEnoughFunds =
    Number(sellerAvailableDeposit) >= Number(offerRequiredDeposit);

  useEffect(() => {
    if (!address) {
      setTabSellerSelected(false);
    }
  }, [address]);

  useEffect(() => {
    if (offer && widgetRef.current) {
      const widgetContainer = document.createElement("div");
      widgetContainer.style.width = "100%";
      widgetRef.current.appendChild(widgetContainer);
      manageOffer(
        offer.id,
        {
          ...CONFIG,
          metaTransactionsApiKey:
            customMetaTransactionsApiKey || CONFIG.metaTransactionsApiKey
        },
        widgetContainer,
        {
          forceBuyerView: !isTabSellerSelected
        }
      );
      return () => widgetContainer.remove();
    }

    return;
  }, [offer, isTabSellerSelected, address, customMetaTransactionsApiKey]);

  if (!offerId) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
  const isSeller = isAccountSeller(offer, address);

  const {
    name,
    offerImg,
    shippingInfo,
    description,
    productData,
    artistDescription,
    images
  } = getOfferDetails(offer);

  return (
    <DetailWrapper>
      <LightBackground>
        {isSeller && (
          <Toggle>
            <InfoIconTextWrapper>
              <InfoIcon />
              <span>You are the owner of this offer. Toggle view:</span>
            </InfoIconTextWrapper>
            <Tabs>
              <Tab
                $isSelected={!isTabSellerSelected}
                onClick={() => setTabSellerSelected(false)}
              >
                Buyer
              </Tab>
              <Tab
                $isSelected={isTabSellerSelected}
                onClick={() => setTabSellerSelected(true)}
              >
                Seller
              </Tab>
            </Tabs>
          </Toggle>
        )}
        <MainDetailGrid>
          <ImageWrapper>
            <Image src={offerImg} dataTestId="offerImage" />
          </ImageWrapper>
          <div>
            <SellerID
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
            {isSeller ? (
              <>
                {isTabSellerSelected ? (
                  <WidgetContainer ref={widgetRef}></WidgetContainer>
                ) : (
                  <DetailWidget
                    pageType="offer"
                    offer={offer}
                    name={name}
                    image={offerImg}
                    hasSellerEnoughFunds={hasSellerEnoughFunds}
                  />
                )}
              </>
            ) : (
              <DetailWidget
                pageType="offer"
                offer={offer}
                name={name}
                image={offerImg}
                hasSellerEnoughFunds={hasSellerEnoughFunds}
              />
            )}
          </div>
          <DetailShare />
        </MainDetailGrid>
      </LightBackground>
      <DarkerBackground>
        <DetailGrid>
          <div>
            <Typography tag="h3">Product data</Typography>
            <Typography
              tag="p"
              style={{ color: colors.darkGrey }}
              data-testid="description"
            >
              {description}
            </Typography>
            <DetailTable data={productData} tag="strong" />
          </div>
          <div>
            <Typography tag="h3">About the artist</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {artistDescription}
            </Typography>
          </div>
        </DetailGrid>
        {images.length > 0 && <DetailSlider images={images} />}
        <DetailGrid>
          <DetailChart offer={offer} title="Inventory graph" />
          <div>
            <Typography tag="h3">Shipping information</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              {shippingInfo.shipping}
            </Typography>
            <DetailTable data={shippingInfo.shippingTable} />
          </div>
        </DetailGrid>
      </DarkerBackground>
    </DetailWrapper>
  );
}
