import { Image as AccountImage } from "@davatar/react";
import { IoIosImage } from "react-icons/io";
import { generatePath, useLocation } from "react-router-dom";
import styled from "styled-components";

import RootPrice from "../../components/price";
import { buttonText, clamp } from "../../components/ui/styles";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Typography from "../ui/Typography";
import ExchangeStatuses from "./ExchangeStatuses";
import OfferBanner from "./OfferBanner";
import OfferStatuses from "./OfferStatuses";

const Card = styled.div<{ isCarousel: boolean }>`
  display: inline-block;
  background-color: ${colors.white};
  position: relative;
  width: 100%;
  cursor: pointer;
  border: 1px solid ${colors.black}20;

  ${({ isCarousel }) =>
    !isCarousel
      ? `
    transition: all 300ms ease-in-out;
    transition: box-shadow 300ms;

    &:hover {
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.05),
      4px 4px 4px rgba(0, 0, 0, 0.05),
      8px 8px 8px rgba(0, 0, 0, 0.05),
      16px 16px 16px rgba(0, 0, 0, 0.05);

      img {
        transform: translate(-50%, -50%) scale(1.05);
      }
    }
  `
      : ""}
`;

const ImageContainer = styled.div`
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  height: 0;
  padding-top: 120%;
  > img,
  > div:not([data-banner]) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
  }

  [data-testid="statuses"] {
    position: absolute;
    top: 2px;
    right: 7px;
    justify-content: flex-end;
  }
`;

const Content = styled.div`
  padding: 1rem 1.5rem;
`;

const Image = styled.img`
  height: 100%;
`;

const ImagePlaceholder = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${colors.darkGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    fill: ${colors.white};
  }

  span {
    ${buttonText}
    color: ${colors.white};
    padding: 1rem;
    text-align: center;
  }
`;

const ImageNotAvailable = styled(IoIosImage)`
  font-size: 50px;
`;

const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  margin: 4px 0 8px 0;
  min-height: 4rem;
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
  color: var(--secondary);
  font-weight: 600;
`;

const Name = styled(Typography)`
  ${clamp}
  font-weight: 600;
  margin: 0;
`;

const Price = styled(RootPrice)`
  font-size: 16px;
  font-weight: bold;
  stroke: black;
`;

const PriceText = styled(Typography)`
  color: #556072;
`;
const TextBelow = styled(Typography)`
  font-size: 12px;
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
  isCarousel?: boolean;
  type?: "featured" | "hot" | "soon" | undefined;
}
export default function OfferCard({
  offer,
  exchange,
  showSeller,
  action,
  dataTestId,
  isPrivateProfile,
  isCarousel = false,
  type
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
    <Card data-testid={dataTestId} onClick={onClick} isCarousel={isCarousel}>
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
        {!isCarousel && <OfferBanner type={type} offer={offer} />}
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
          <Name tag="h4" data-testid="name">
            {name || "Untitled"}
          </Name>
          {offer.exchangeToken && (
            <Price
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          )}
        </BasicInfoContainer>
        {!exchange && (
          <TextBelow>Redeemable until 30 days after commit</TextBelow>
        )}
      </Content>
    </Card>
  );
}
