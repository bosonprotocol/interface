import AddressImage from "components/offer/AddressImage";
import RootPrice from "components/Price";
import { QueryParameters, UrlParameters } from "lib/routing/query-parameters";
import { useQueryParameter } from "lib/routing/useQueryParameter";
import { useOffer } from "lib/utils/hooks/useOffers/useOffer";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { lg } from "../../lib/screen-sizes";
import { colors } from "../../lib/styles/colors";
import { formatAddress } from "../../lib/utils/address";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  gap: 42px;
  margin-bottom: 42px;

  ${lg} {
    flex-direction: row;
  }
`;

const ImageAndDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  flex-basis: 50%;
  gap: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: left;
  height: auto;
`;

const Image = styled.img`
  height: auto;
  width: 100%;
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
  margin: 10px;
`;

const WidgetContainer = styled.div`
  background: grey;
  width: 500px;
  height: 500px;
  max-width: 100%;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Box = styled.div`
  border: 1px solid ${colors.grey};
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  border-radius: 6px;
  gap: 4px;
  margin-bottom: 10px;
`;

const Price = styled(RootPrice)`
  font-weight: bold;
  font-size: 24px;
`;

export default () => {
  const { [UrlParameters.offerId]: offerId } = useParams();
  const [seller] = useQueryParameter(QueryParameters.seller);
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
  const sellerAddress = offer.seller?.admin;
  const description = offer.metadata?.description || "";

  return (
    <>
      <Root>
        <ImageAndDescription>
          <ImageContainer>
            <Image data-testid="image" src={offerImg} />
          </ImageContainer>
          <div>
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
          </div>
        </ImageAndDescription>
        <Content>
          <AddressContainer>
            <AddressImage address={sellerAddress} />
            <SubHeading data-testid="address">
              {formatAddress(sellerAddress)}
            </SubHeading>
          </AddressContainer>

          <Title data-testid="name">{name}</Title>

          <Box>
            <SubHeading>Price</SubHeading>
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              weiValue={offer.price}
            />
          </Box>
          <ChildrenContainer>
            <WidgetContainer>widget</WidgetContainer>
          </ChildrenContainer>
        </Content>
      </Root>
    </>
  );
};
