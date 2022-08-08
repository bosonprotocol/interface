import { manageExchange } from "@bosonprotocol/widgets-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
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
import DetailOpenSea from "../../components/detail/DetailOpenSea";
import DetailShare from "../../components/detail/DetailShare";
import DetailSlider from "../../components/detail/DetailSlider";
import DetailTable from "../../components/detail/DetailTable";
import DetailTransactions from "../../components/detail/DetailTransactions";
import DetailWidget from "../../components/detail/DetailWidget/DetailWidget";
// DETAILS COMPONENTS ABOVE
import Image from "../../components/ui/Image";
import SellerID from "../../components/ui/SellerID";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import {
  getOfferArtistDescription,
  getOfferDescription,
  getOfferImage,
  getOfferImageList,
  getOfferProductData,
  getOfferShippingInformation
} from "../../lib/utils/hooks/offers/placeholders";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { isAccountSeller } from "../../lib/utils/isAccountSeller";
import { MOCK } from "./mock/mock";

export default function Exchange() {
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();

  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fromAccountPage =
    (location.state as { from: string })?.from === BosonRoutes.YourAccount;
  const [isTabSellerSelected, setTabSellerSelected] = useState(fromAccountPage);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const { address: account } = useAccount();
  const address = account || "";
  // const {
  //   data: exchanges,
  //   isError,
  //   isLoading
  // } = useExchanges(
  //   {
  //     id: exchangeId,
  //     disputed: null
  //   },
  //   {
  //     enabled: !!exchangeId
  //   }
  // );
  const getExchanges = ({
    id_in,
    disputed
  }: {
    id_in: string[];
    disputed: null;
  }): ReturnType<typeof useExchanges> => {
    const r = {
      data: id_in.map((id, index) => ({
        id,
        buyer: {
          id: "1",
          wallet: "0x"
        },
        committedDate: new Date().toString(),
        disputed: true,
        expired: true,
        finalizedDate: new Date().toString(),
        redeemedDate: new Date().toString(),
        state: "REDEEMED",
        validUntilDate: new Date().toString(),
        seller: { id: "123" },
        offer: {
          id: "1",
          exchanges: [{ id, commitedDate: new Date().toString() }],
          buyerCancelPenalty: "",
          createdAt: "",
          disputeResolverId: "",
          exchangeToken: {
            address:
              index === 0
                ? "0x123"
                : "0x0000000000000000000000000000000000000000",
            decimals: "18",
            name: index === 0 ? "PepitoName" : "Ether",
            symbol: index === 0 ? "pepito" : "ETH",
            __typename: "ExchangeToken"
          },
          fulfillmentPeriodDuration: "",
          metadataHash: "",
          metadataUri: "",
          price: "10001230000000000000",
          protocolFee: "",
          quantityAvailable: "",
          quantityInitial: "",
          resolutionPeriodDuration: "",
          seller: {
            active: true,
            admin: "0x9c2925a41d6FB1c6C8f53351634446B0b2E65999",
            clerk: "0x9c2925a41d6FB1c6C8f53351634446B0b2E65999",
            __typename: "Seller",
            id: "5",
            operator: "0x9c2925a41d6FB1c6C8f53351634446B0b2E65999",
            treasury: "0x9c2925a41d6FB1c6C8f53351634446B0b2E65999"
          },
          sellerDeposit: "",
          validFromDate: "",
          validUntilDate: "",
          voucherRedeemableFromDate: "",
          voucherRedeemableUntilDate: "",
          voucherValidDuration: "",
          __typename: "Offer",
          isValid: true,
          voidedAt: "",
          metadata: {
            imageUrl:
              "https://assets.website-files.com/6058b6a3587b6e155196ebbb/61b24ecf53f687b4500a6203_NiftyKey_Logo_Vertical.svg",
            type: "BASE",
            name: index === 0 ? "boson t-shirt" : "another tshirt"
          }
        }
      }))
    };
    return r as any;
  };
  const { data: exchanges } = useMemo(
    () =>
      getExchanges({
        // TODO: remove
        id_in: ["115"],
        disputed: null
      }),
    []
  );
  const isError = false;
  const isLoading = false;
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

  // const { data: sellers } = useSellers({
  //   admin: offer?.seller.admin,
  //   includeFunds: true
  // });

  const getSellers = () => {
    return {
      data: [{ funds: [{ token: { address: "" }, availableAmount: 3 }] }]
    };
  };

  const { data: sellers } = getSellers();

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
    if (offer && widgetRef.current && exchangeId) {
      const widgetContainer = document.createElement("div");
      widgetContainer.style.width = "100%";
      widgetRef.current.appendChild(widgetContainer);
      manageExchange(exchangeId, CONFIG, widgetContainer, {
        forceBuyerView: !isTabSellerSelected
      });
      return () => widgetContainer.remove();
    }

    return;
  }, [offer, isTabSellerSelected, exchangeId]);

  if (!exchangeId) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
  const isSeller = isAccountSeller(offer, address);
  const buyerAddress = exchange.buyer.wallet;
  const isBuyer = buyerAddress.toLowerCase() === address.toLowerCase();

  const name = offer.metadata?.name || "Untitled";
  const offerImg = getOfferImage(offer.id, name);
  const shippingInfo = getOfferShippingInformation(name);
  const description = offer.metadata?.description || "";
  const mockedDescription = getOfferDescription(name);
  const productData = getOfferProductData(name);
  const artistDescription = getOfferArtistDescription(name);
  const images = getOfferImageList(name);

  return (
    <>
      <DetailWrapper>
        <LightBackground>
          {isSeller && isBuyer && (
            <Toggle>
              <InfoIconTextWrapper>
                <InfoIcon />
                <span>You are the owner of this exchange. Toggle view:</span>
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
              <DetailOpenSea
                exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
              />
              <Image src={offerImg} dataTestId="offerImage" />
            </ImageWrapper>
            <div>
              <SellerID
                seller={offer?.seller}
                offerName={name}
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
              {isSeller ? (
                <>
                  {isTabSellerSelected ? (
                    <WidgetContainer ref={widgetRef}></WidgetContainer>
                  ) : (
                    // TODO: handle this widget
                    <DetailWidget
                      pageType="exchange"
                      offer={offer}
                      setIsModalOpened={setIsModalOpened}
                      isModalOpened={isModalOpened}
                      exchange={
                        exchange as NonNullable<Offer["exchanges"]>[number]
                      }
                      name={name}
                      image={offerImg}
                      hasSellerEnoughFunds={hasSellerEnoughFunds}
                    />
                  )}
                </>
              ) : (
                // TODO: handle this widget
                <DetailWidget
                  pageType="exchange"
                  offer={offer}
                  exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
                  name={name}
                  image={offerImg}
                  hasSellerEnoughFunds={hasSellerEnoughFunds}
                  setIsModalOpened={setIsModalOpened}
                  isModalOpened={isModalOpened}
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
                {mockedDescription || description}
              </Typography>
              <DetailTable data={productData} tag="strong" />
            </div>
            <div>
              <Typography tag="h3">About the artist</Typography>
              <Typography tag="p" style={{ color: colors.darkGrey }}>
                {artistDescription || MOCK.aboutArtist}
              </Typography>
            </div>
          </DetailGrid>
          <DetailSlider images={images.length ? images : MOCK.images} />
          <DetailGrid>
            <DetailChart offer={offer} title="Trade history (all items)" />
            <DetailTransactions
              title="Transaction History (this item)"
              exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
              offer={offer}
              buyerAddress={buyerAddress}
            />
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
    </>
  );
}
