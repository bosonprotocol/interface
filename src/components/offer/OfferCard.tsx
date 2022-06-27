import { Image as AccountImage } from "@davatar/react";
import { IoIosImage } from "react-icons/io";
import { generatePath, useLocation } from "react-router-dom";
import styled from "styled-components";

import RootPrice from "../../components/price";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Typography from "../ui/Typography";
import ExchangeStatuses from "./ExchangeStatuses";
import OfferStatuses from "./OfferStatuses";

const Card = styled.div`
  display: inline-block;
  background-color: ${colors.white};
  position: relative;
  width: 100%;
  min-height: 500px;
  cursor: pointer;
  border: 1px solid ${colors.darkGrey}99;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;

  [data-testid="statuses"] {
    position: absolute;
    top: 2px;
    right: 7px;
    justify-content: flex-end;
  }
`;

const Content = styled.div`
  margin: 16px 24.5px;
`;

const Image = styled.img`
  height: 390px;
  width: 100%;
`;

const ImagePlaceholder = styled.div`
  height: 250px;
  width: 250px;
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

const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4px;
  margin: 4px 0 8px 0;
`;

const SellerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  margin: 0 0 4px 0;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  color: ${colors.secondary};
  font-weight: 600;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const Price = styled(RootPrice)`
  font-size: 16px;
  font-weight: bold;
  stroke: black;

  svg {
    width: 9px;
  }
`;

const PriceText = styled(Typography)`
  color: #556072;
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

export type Action = "commit" | "redeem" | null;

interface Props {
  offer: Offer;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  showSeller?: boolean;
  action?: Action;
  dataTestId: string;
  isPrivateProfile?: boolean;
}

export default function OfferCard({
  offer,
  exchange,
  showSeller,
  action,
  dataTestId,
  isPrivateProfile
}: Props) {
  const offerId = offer.id;
  const isSellerVisible = showSeller === undefined ? true : showSeller;
  const offerImg = offer.metadata.imageUrl;
  const name = offer.metadata?.name || "Untitled";
  const sellerId = offer.seller?.id;
  const sellerAddress = offer.seller?.operator;

  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();

  if (!offer) {
    return null;
  }
  const path = getCTAPath(action, { offerId, exchangeId: exchange?.id });

  const isClickable = !!path;
  const onClick: React.MouseEventHandler<unknown> = (e) => {
    e.stopPropagation();
    isClickable &&
      navigate(
        { pathname: path },
        {
          state: {
            from: location.pathname
          }
        }
      );
  };

  const Status = isPrivateProfile ? (
    exchange ? (
      <ExchangeStatuses offer={offer} exchange={exchange} />
    ) : (
      <OfferStatuses offer={offer} />
    )
  ) : (
    <></>
  );

  return (
    <Card data-testid={dataTestId} onClick={onClick}>
      <ImageContainer>
        {Status}
        {offerImg ? (
          <Image data-testid="image" src={offerImg} />
        ) : (
          <ImagePlaceholder>
            <ImageNotAvailable />
            <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
          </ImagePlaceholder>
        )}
      </ImageContainer>
      <Content>
        {isSellerVisible && sellerAddress && (
          <AddressContainer
            onClick={(e) => {
              e.stopPropagation();
              navigate({
                pathname: generatePath(BosonRoutes.Account, {
                  [UrlParameters.accountId]: sellerAddress
                })
              });
            }}
          >
            <SellerContainer>
              <div>
                <AccountImage size={17} address={sellerAddress} />
              </div>
              <SellerInfo data-testid="seller-id">
                Seller ID: {sellerId}
              </SellerInfo>
            </SellerContainer>
            <PriceText>Price</PriceText>
          </AddressContainer>
        )}

        <BasicInfoContainer>
          <Name data-testid="name">{name || "Untitled"}</Name>
          {offer.exchangeToken && (
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          )}
        </BasicInfoContainer>
        {!exchange && (
          <Typography>Redeemable until 30 days after commit</Typography>
        )}
      </Content>
    </Card>
  );
}
