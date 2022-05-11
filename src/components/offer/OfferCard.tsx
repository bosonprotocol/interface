import AddressContainer from "@components/offer/AddressContainer";
import AddressImage from "@components/offer/AddressImage";
import RootPrice from "@components/price";
import { UrlParameters } from "@lib/routing/query-parameters";
import { OffersRoutes } from "@lib/routing/routes";
import { colors } from "@lib/styles/colors";
import { Offer } from "@lib/types/offer";
import { generatePath, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  border-radius: 12px;
  display: inline-block;
  position: relative;
  width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 16px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 16px;
`;

const Image = styled.img`
  height: 250px;
  width: 250px;
  border-radius: 24px;
`;

const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 18px 0px;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin: 18px 0px;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CommitButtonContainer = styled.div`
  display: flex;
`;

const Price = styled(RootPrice)`
  font-size: 16px;
  font-weight: bold;
`;

const Commit = styled.button`
  all: unset;
  font-weight: 600;
  font-size: 15px;
  color: ${colors.green};
  border-radius: 11px;
  display: inline-block;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  border: 1px solid ${colors.green};
  padding: 6px 12px;
  margin-top: 8px;
`;

interface Props {
  offer: Offer;
}

export default function OfferCard({ offer }: Props) {
  const id = offer.id;

  const offerImg = `https://picsum.photos/seed/${id}/700`;
  const name = offer.metadata?.name || "Untitled";
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.admin;

  const navigate = useNavigate();

  return (
    <Card data-testid="offer">
      <AddressContainer>
        <AddressImage address={sellerAddress} />
        <SellerInfo data-testid="seller-id">Seller ID: {sellerId}</SellerInfo>
      </AddressContainer>
      <ImageContainer>
        <Image data-testid="image" src={offerImg} />
      </ImageContainer>
      <BasicInfoContainer>
        <Name data-testid="name">{name || "Untitled"}</Name>
        <Price
          currencySymbol={offer.exchangeToken.symbol}
          value={offer.price}
          decimals={offer.exchangeToken.decimals}
        />
        <CommitButtonContainer>
          <Commit
            data-testid="commit"
            onClick={() =>
              navigate(
                generatePath(OffersRoutes.OfferDetail, {
                  [UrlParameters.offerId]: id
                })
              )
            }
          >
            Commit
          </Commit>
        </CommitButtonContainer>
      </BasicInfoContainer>
    </Card>
  );
}
