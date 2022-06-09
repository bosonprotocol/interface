import { Image as AccountImage } from "@davatar/react";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import AddressContainer from "../../components/offer/AddressContainer";
import RootPrice from "../../components/price";
import { UrlParameters } from "../../lib/routing/query-parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";

const Card = styled.div`
  border-radius: 12px;
  box-shadow: inset -3px -3px 3px #0e0f17, inset 3px 3px 3px #363b5b;
  display: inline-block;
  position: relative;
  width: 250px;
  padding: 0 16px;
  cursor: pointer;
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

const ButtonContainer = styled.div`
  display: flex;
`;

const Price = styled(RootPrice)`
  font-size: 16px;
  font-weight: bold;
`;

const Button = styled.button`
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

const getCTAPath = (
  action: Props["action"],
  {
    offerId,
    exchangeId
  }: { offerId: Props["offer"]["id"]; exchangeId: string | undefined }
) => {
  if (action === "redeem" && exchangeId) {
    return generatePath(BosonRoutes.Exchange, {
      [UrlParameters.exchangeId]: exchangeId
    });
  }
  return generatePath(OffersRoutes.OfferDetail, {
    [UrlParameters.offerId]: offerId
  });
};

const CTA = ({
  action,
  onClick
}: {
  action: Props["action"];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  if (action === "commit") {
    return (
      <Button data-testid="commit" onClick={onClick}>
        Commit
      </Button>
    );
  } else if (action === "redeem") {
    return (
      <Button data-testid="redeem" onClick={onClick}>
        Redeem
      </Button>
    );
  }
  return null;
};

export type Action = "commit" | "redeem" | null;

interface Props {
  offer: Offer;
  exchangeId?: string;
  showSeller?: boolean;
  showCTA?: boolean;
  action?: Action;
  dataTestId: string;
}

export default function OfferCard({
  offer,
  exchangeId,
  showSeller,
  showCTA,
  action,
  dataTestId
}: Props) {
  if (!offer) {
    return null;
  }
  const offerId = offer.id;
  const isSellerVisible = showSeller === undefined ? true : showSeller;
  const offerImg = `https://picsum.photos/seed/${offerId}/700`;
  const name = offer.metadata?.name || "Untitled";
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.operator;

  const location = useLocation();
  const navigate = useNavigate();
  const path = getCTAPath(action, { offerId, exchangeId });

  const isClickable = !!path;
  const onClick: React.MouseEventHandler<unknown> = (e) => {
    e.stopPropagation();
    isClickable &&
      navigate(path, {
        state: {
          from: location.pathname
        }
      });
  };

  return (
    <Card data-testid={dataTestId} onClick={onClick}>
      {isSellerVisible && sellerAddress && (
        <AddressContainer
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              generatePath(BosonRoutes.Account, {
                [UrlParameters.accountId]: sellerAddress
              })
            );
          }}
        >
          <div>
            <AccountImage size={30} address={sellerAddress} />
          </div>
          <SellerInfo data-testid="seller-id">Seller ID: {sellerId}</SellerInfo>
        </AddressContainer>
      )}
      <ImageContainer>
        <Image data-testid="image" src={offerImg} />
      </ImageContainer>
      <BasicInfoContainer>
        <Name data-testid="name">{name || "Untitled"}</Name>
        {offer.exchangeToken && (
          <Price
            currencySymbol={offer.exchangeToken.symbol}
            value={offer.price}
            decimals={offer.exchangeToken.decimals}
          />
        )}
        {showCTA && (
          <ButtonContainer>
            <CTA onClick={onClick} action={action} />
          </ButtonContainer>
        )}
      </BasicInfoContainer>
    </Card>
  );
}
