import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import AddressContainer from "./../../components/offer/AddressContainer";
import AddressImage from "./../../components/offer/AddressImage";
import RootPrice from "./../../components/price";
import { CONFIG } from "./../../lib/config";
import { UrlParameters } from "./../../lib/routing/query-parameters";
import { colors } from "./../../lib/styles/colors";
import { Offer } from "./../../lib/types/offer";
import { useOffer } from "./../../lib/utils/hooks/useOffers/useOffer";
import { ReactComponent as InfoSvg } from "./images/info.svg";

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

const ImageContainer = styled.div`
  display: flex;
  justify-content: left;
  height: auto;
`;

const Image = styled.img`
  height: auto;
  width: 100%;
  margin: 0 auto;
  border-radius: 22px;
  object-fit: contain;
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

const InfoIcon = styled(InfoSvg).attrs({
  height: "32px",
  width: "32px",
  fill: colors.bosonSkyBlue
})`
  position: relative;
  right: 2px;
`;

function isAccountSeller(offer: Offer, account: string): boolean {
  if (offer.seller.clerk.toLowerCase() === account.toLowerCase()) return true;
  if (offer.seller.operator.toLowerCase() === account.toLowerCase())
    return true;
  return false;
}

function getIsOfferValid(offer: Offer | undefined | null): boolean {
  const now = Date.now() / 1000;
  const isValid =
    Number(offer?.validFromDate) <= now && now <= Number(offer?.validUntilDate);
  return isValid;
}

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isTabSellerSelected, setTabSellerSelected] = useState(false);
  const [account, setAccount] = useState("");

  if (!offerId) {
    return null;
  }

  const {
    data: offer,
    isError,
    isLoading
  } = useOffer({
    offerId
  });

  useEffect(() => {
    if (offer && widgetRef.current) {
      const widgetContainer = document.createElement("div");
      widgetContainer.style.width = "100%";
      widgetRef.current.appendChild(widgetContainer);
      manageOffer(offer.id, CONFIG, widgetContainer, {
        forceBuyerView: !isTabSellerSelected
      });
      return () => widgetContainer.remove();
    }

    return;
  }, [offer, isTabSellerSelected]);

  useEffect(() => {
    function handleMessageFromIframe(e: MessageEvent) {
      const { target, message, wallet } = e.data || {};

      if (target === "boson" && message === "wallet-changed") {
        setAccount(wallet);
      }
    }
    window.addEventListener("message", handleMessageFromIframe);
    return () => window.removeEventListener("message", handleMessageFromIframe);
  }, []);

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

  const isOfferValid = getIsOfferValid(offer);
  if (!offer || !isOfferValid) {
    return <div data-testid="notFound">This offer does not exist</div>;
  }
  const isSeller = isAccountSeller(offer, account ?? "");
  const name = offer.metadata?.name || "Untitled";
  const offerImg = `https://picsum.photos/seed/${offerId}/700`;
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.admin;
  const description = offer.metadata?.description || "";

  return (
    <>
      <Root>
        <ImageAndDescription>
          <ImageContainer>
            <Image data-testid="image" src={offerImg} />
          </ImageContainer>
          <Info>
            <Box>
              <SubHeading>Brand</SubHeading>
              <span data-testid="brand">Not defined</span>
            </Box>
            <Box>
              <SubHeading>Description</SubHeading>
              <Information data-testid="description">{description}</Information>
            </Box>
            <Box>
              <SubHeading>Delivery Information</SubHeading>
              <span data-testid="delivery-info">Not defined</span>
            </Box>
            <Box>
              <SubHeading> Seller</SubHeading>
              <AddressContainer>
                <AddressImage address={sellerAddress} />
                <div data-testid="seller-id">ID: {sellerId}</div>
              </AddressContainer>
            </Box>
          </Info>
        </ImageAndDescription>
        <Content>
          <Title data-testid="name">{name}</Title>

          <Box>
            <SubHeading>Price</SubHeading>
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          </Box>
          {isSeller && (
            <Toggle>
              <InfoIconTextWrapper>
                <InfoIcon />
                <span>You are the owner of this offer. Toggle view:</span>
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
