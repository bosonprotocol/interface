import { manageExchange } from "@bosonprotocol/widgets-sdk";
import { Image as AccountImage } from "@davatar/react";
import { useEffect, useRef, useState } from "react";
import { IoIosImage, IoIosInformationCircleOutline } from "react-icons/io";
import { generatePath, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import AddressContainer from "../../components/offer/AddressContainer";
import ExchangeStatuses from "../../components/offer/ExchangeStatuses";
import RootPrice from "../../components/price";
import { CONFIG } from "../../lib/config";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { isAccountSeller } from "../../lib/utils/isAccountSeller";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  gap: 130px;
  margin-bottom: 42px;

  @media (min-width: 1200px) {
    flex-direction: row;
  }
`;

const ImageAndDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  flex-basis: 50%;
  gap: 20px;

  @media (min-width: 981px) {
    flex-direction: row;
  }

  @media (min-width: 1200px) {
    flex-direction: column;
  }
`;

const StatusContainer = styled.div`
  width: 100%;
  position: absolute;
`;

const StatusSubContainer = styled.div`
  max-width: 700px;
  width: 700px;
  position: relative;
  margin: 0 auto;

  @media (min-width: 981px) {
    width: initial;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: left;
  height: auto;
  position: relative;

  [data-testid="statuses"] {
    position: absolute;
    right: 5px;
    top: 5px;
    margin: 0 auto;
    justify-content: center;
  }
`;

const Image = styled.img`
  height: auto;
  width: 100%;
  margin: 0 auto;
  border-radius: 22px;
  object-fit: contain;
  max-height: 700px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  min-width: 500px;
  height: 500px;
  background-color: ${colors.grey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 21px;
  border-radius: 24px;

  span {
    padding: 10px;
    text-align: center;
    color: lightgrey;
  }
`;

const ImageNotAvailable = styled(IoIosImage)`
  font-size: 50px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin: 0;
`;

const SubHeading = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: ${colors.grey};
`;

const Information = styled.span`
  font-weight: bold;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
  gap: 20px;
  padding-top: 24px;
`;

const ChildrenContainer = styled.div`
  iframe {
    width: 100%;
  }
`;

const WidgetContainer = styled.div`
  max-width: 100%;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  border-radius: 6px;
  gap: 4px;
  box-shadow: inset -3px -3px 3px #0e0f17, inset 3px 3px 3px #363b5b;
`;

const Toggle = styled.div`
  border: 1px solid ${colors.bosonSkyBlue};
  color: ${colors.bosonSkyBlue};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-radius: 6px;
  gap: 4px;
`;

const InfoIconTextWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 30%;
`;

const Tab = styled("button")<{ $isLeft: boolean; $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  border: 1px solid ${colors.bosonSkyBlue};
  border-radius: ${(props) =>
    props.$isLeft ? "30px 0 0 30px" : "0 30px 30px 0"};
  background-color: ${(props) =>
    props.$isSelected ? colors.bosonSkyBlue : colors.navy};
  ${(props) =>
    props.$isSelected
      ? "box-shadow: inset 1px 2px 5px #777;"
      : `box-shadow: 0px 2px 9px -3px ${colors.bosonSkyBlue};`}
  padding: 7px;
  font-size: 14px;
  color: ${(props) => (props.$isSelected ? colors.black : colors.bosonSkyBlue)};
  width: 200px;
  max-width: 100%;
  text-align: center;
`;

const Price = styled(RootPrice)`
  font-weight: bold;
  font-size: 24px;
`;

const InfoIcon = styled(IoIosInformationCircleOutline).attrs({
  fill: colors.bosonSkyBlue
})`
  position: relative;
  right: 2px;
  font-size: 27px;
`;

export default function Exchange() {
  const { [UrlParameters.exchangeId]: exchangeId } = useParams();
  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fromAccountPage =
    (location.state as { from: string })?.from === BosonRoutes.YourAccount;
  const [isTabSellerSelected, setTabSellerSelected] = useState(fromAccountPage);
  const { data: account } = useAccount();
  const address = account?.address || "";

  const navigate = useKeepQueryParamsNavigate();

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
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

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
  const name = offer.metadata?.name || "Untitled";
  const offerImg = offer.metadata.imageUrl;
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.operator;
  // const isOfferValid = getIsOfferValid(offer);
  const description = offer.metadata?.description || "";
  const buyerAddress = exchange.buyer.wallet;
  const isBuyer = buyerAddress.toLowerCase() === address.toLowerCase();
  return (
    <>
      <Root>
        <ImageAndDescription>
          <ImageContainer>
            <StatusContainer>
              <StatusSubContainer>
                <ExchangeStatuses
                  offer={offer}
                  exchange={exchange as NonNullable<Offer["exchanges"]>[number]}
                />
              </StatusSubContainer>
            </StatusContainer>

            {offerImg ? (
              <Image data-testid="image" src={offerImg} />
            ) : (
              <ImagePlaceholder>
                <ImageNotAvailable />
                <span>IMAGE NOT AVAILABLE</span>
              </ImagePlaceholder>
            )}
          </ImageContainer>
          <Info>
            <Box>
              <SubHeading>Brand</SubHeading>
              <span data-testid="brand">Not defined</span>
            </Box>
            <Box>
              <SubHeading>Description</SubHeading>
              <Information data-testid="description">
                {description || "Not defined"}
              </Information>
            </Box>
            <Box>
              <SubHeading>Delivery Information</SubHeading>
              <span data-testid="delivery-info">Not defined</span>
            </Box>
            <Box>
              <SubHeading>Seller</SubHeading>
              <AddressContainer
                onClick={() =>
                  navigate({
                    pathname: generatePath(BosonRoutes.Account, {
                      [UrlParameters.accountId]: sellerAddress
                    })
                  })
                }
              >
                <AccountImage size={30} address={sellerAddress} />
                <div data-testid="seller-id">ID: {sellerId}</div>
              </AddressContainer>
            </Box>
          </Info>
        </ImageAndDescription>
        <Content>
          <Title data-testid="name">{name || "Untitled"}</Title>

          <Box>
            <SubHeading>Price</SubHeading>
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          </Box>
          {isSeller && isBuyer && (
            <Toggle>
              <InfoIconTextWrapper>
                <InfoIcon />
                <span>You are the owner of this exchange. Toggle view:</span>
              </InfoIconTextWrapper>
              <Tabs>
                <Tab
                  $isLeft
                  $isSelected={!isTabSellerSelected}
                  onClick={() => setTabSellerSelected(false)}
                >
                  Buyer
                </Tab>
                <Tab
                  $isLeft={false}
                  $isSelected={isTabSellerSelected}
                  onClick={() => setTabSellerSelected(true)}
                >
                  Seller
                </Tab>
              </Tabs>
            </Toggle>
          )}
          <ChildrenContainer>
            <WidgetContainer ref={widgetRef}></WidgetContainer>
          </ChildrenContainer>
        </Content>
      </Root>
    </>
  );
}
