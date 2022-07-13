import { generatePath, useLocation } from "react-router-dom";
import styled from "styled-components";

import RootPrice from "../../components/price";
import { clamp } from "../../components/ui/styles";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Image from "../ui/Image";
import SellerID from "../ui/SellerID";
import Typography from "../ui/Typography";
import ExchangeStatuses from "./ExchangeStatuses";
import OfferBanner from "./OfferBanner";
import OfferRedeemable from "./OfferRedeemable";
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

      img[data-testid] {
        transform: translate(-50%, -50%) scale(1.05);
      }
    }
  `
      : ""}
`;

const Content = styled.div`
  padding: 1rem 1.5rem;
`;

const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
  min-height: 4rem;
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
  type?: "gone" | "hot" | "soon" | undefined;
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
      {Status}
      <Image src={offerImg} dataTestId="offerImage">
        {!isCarousel && <OfferBanner type={type} offer={offer} />}
      </Image>
      <Content>
        {isSellerVisible && sellerAddress && (
          <SellerID seller={offer?.seller}>
            <PriceText>Price</PriceText>
          </SellerID>
        )}

        <BasicInfoContainer>
          <Name tag="h4" data-testid="name">
            {name || "Untitled"}
          </Name>
          {offer.exchangeToken && (
            <Price
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
            />
          )}
        </BasicInfoContainer>
        {!exchange && (
          <TextBelow>
            <OfferRedeemable offer={offer} />
          </TextBelow>
        )}
      </Content>
    </Card>
  );
}
