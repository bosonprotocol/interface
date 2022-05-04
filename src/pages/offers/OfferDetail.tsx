import AddressImage from "components/offer/AddressImage";
import { UrlParameters } from "lib/routing/query-parameters";
import { useOffer } from "lib/utils/hooks/useOffers/useOffer";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 16px;
`;

const Image = styled.img`
  height: auto;
  width: 80%;
  max-width: 450px;
  border-radius: 24px;
`;

const SubHeading = styled.p`
  font-size: medium;
  font-weight: bold;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
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
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default () => {
  const { [UrlParameters.offerId]: offerId } = useParams();
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
      <h1 data-testid="name">{name}</h1>
      <ImageContainer>
        <Image data-testid="image" src={offerImg} />
      </ImageContainer>
      <Content>
        <section>
          <SubHeading>Brand</SubHeading>
          <p data-testid="brand">Not defined</p>

          <SubHeading>Description</SubHeading>
          <p data-testid="description">{description}</p>

          <SubHeading>Delivery Info</SubHeading>
          <p data-testid="delivery-info">Not defined</p>

          <AddressContainer>
            <AddressImage address={sellerAddress} />
            <SubHeading data-testid="address">{sellerAddress}</SubHeading>
          </AddressContainer>
          <SubHeading>Seller description</SubHeading>
          <p data-testid="seller-description">Not defined</p>
        </section>
        <ChildrenContainer>
          <WidgetContainer>widget</WidgetContainer>
        </ChildrenContainer>
      </Content>
    </>
  );
};
