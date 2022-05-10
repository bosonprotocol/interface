import { manageOffer } from "@bosonprotocol/widgets-sdk";
import RootPrice from "@components/price";
import { CONFIG } from "@lib/config";
import { QueryParameters, UrlParameters } from "@lib/routing/query-parameters";
import { useQueryParameter } from "@lib/routing/useQueryParameter";
import { colors } from "@lib/styles/colors";
import { useOffer } from "@lib/utils/hooks/useOffers/useOffer";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  border: 1px solid ${colors.grey};
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  border-radius: 6px;
  gap: 4px;
`;

const Price = styled(RootPrice)`
  font-weight: bold;
  font-size: 24px;
`;

export default function OfferDetail() {
  const { [UrlParameters.offerId]: offerId } = useParams();
  const [seller] = useQueryParameter(QueryParameters.seller);
  const widgetRef = useRef<HTMLDivElement>(null);

  const isSeller = seller === "true";

  if (!offerId) {
    return null;
  }

  const {
    data: offer,
    isError,
    isLoading
  } = useOffer({
    offerId,
    valid: !isSeller
  });
  useEffect(() => {
    if (offer && widgetRef.current) {
      const widgetContainer = document.createElement("div");
      widgetContainer.style.width = "100%";
      widgetRef.current.appendChild(widgetContainer);
      manageOffer(offer.id, CONFIG, widgetContainer);
      return () => widgetContainer.remove();
    }

    return;
  }, [offer]);

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

  const name = offer.metadata?.name || "Untitled";
  const offerImg = `https://picsum.photos/seed/${offerId}/700`;
  const sellerId = offer.seller?.id;
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
              <SubHeading>Seller Description</SubHeading>
              <span data-testid="seller-description">Not defined</span>
            </Box>

            <Box>
              <SubHeading>Delivery Information</SubHeading>
              <span data-testid="delivery-info">Not defined</span>
            </Box>
          </Info>
        </ImageAndDescription>
        <Content>
          <AddressContainer data-testid="seller-id">
            Seller ID: {sellerId}
          </AddressContainer>

          <Title data-testid="name">{name}</Title>

          <Box>
            <SubHeading>Price</SubHeading>
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          </Box>
          <ChildrenContainer>
            <WidgetContainer ref={widgetRef}></WidgetContainer>
          </ChildrenContainer>
        </Content>
      </Root>
    </>
  );
}
