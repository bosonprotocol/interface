import { subgraph } from "@bosonprotocol/react-kit";
import { Image as AccountImage } from "@davatar/react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import Grid, { IGrid } from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { getOfferDetails } from "../../lib/utils/getOfferDetails";
import { MediaSet } from "../../lib/utils/hooks/lens/graphql/generated";
import { useCurrentSeller } from "../../lib/utils/hooks/useCurrentSeller";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Image from "./Image";

const AddressContainer = styled(Grid)`
  gap: 10px;
  margin: 0;
`;

const SellerContainer = styled.div<{ $hasCursorPointer: boolean }>`
  ${({ $hasCursorPointer }) => $hasCursorPointer && `cursor: pointer;`}

  display: flex;
  align-items: center;
  gap: 10px;
`;

const SellerInfo = styled.div<{ $withBosonStyles?: boolean }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  ${({ $withBosonStyles }) =>
    $withBosonStyles
      ? css`
          color: ${colors.secondary};
          font-family: "Plus Jakarta Sans";
        `
      : css`
          color: var(--accent);
        `};

  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Buyer = Pick<subgraph.Buyer, "id" | "wallet">;
type Seller = Pick<subgraph.Seller, "id" | "operator">;

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    offer: Offer;
    buyerOrSeller: Buyer | Seller;
    accountImageSize?: number;
    withProfileImage: boolean;
    withProfileText?: boolean;
    withBosonStyles?: boolean;
    onClick?: null | undefined | React.MouseEventHandler<HTMLDivElement>;
  } & IGrid &
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">
> = ({
  children,
  offer,
  buyerOrSeller,
  withProfileImage,
  onClick,
  accountImageSize,
  withProfileText = true,
  withBosonStyles = false,
  ...rest
}) => {
  const { address } = useAccount();
  const { lens } = useCurrentSeller({
    sellerId: offer.seller.id
  });

  const navigate = useKeepQueryParamsNavigate();
  const { artist } = getOfferDetails(offer);

  const userId = buyerOrSeller?.id;
  const isSeller = buyerOrSeller ? "operator" in buyerOrSeller : false;
  const userAddress = buyerOrSeller
    ? isSeller
      ? (buyerOrSeller as Seller).operator
      : (buyerOrSeller as Buyer).wallet
    : address;
  const hasCursorPointer = !!onClick || onClick === undefined;

  return (
    <AddressContainer {...rest} data-address-container>
      <SellerContainer
        $hasCursorPointer={hasCursorPointer}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          } else if (onClick !== null) {
            e.stopPropagation();
            if (isSeller) {
              navigate({
                pathname: generatePath(BosonRoutes.SellerPage, {
                  [UrlParameters.sellerId]: userId
                })
              });
            } else {
              navigate({
                pathname: generatePath(BosonRoutes.BuyerPage, {
                  [UrlParameters.buyerId]: userId
                })
              });
            }
          }
        }}
        data-seller-container
      >
        {withProfileImage && userId && (
          <ImageContainer>
            {(lens?.picture as MediaSet) ||
            (artist?.images && artist?.images.length > 0) ? (
              <Image
                src={
                  (lens?.picture as MediaSet)?.original?.url ||
                  ((artist?.images?.[0]?.url || "") as string)
                }
                style={{
                  height: "1rem",
                  width: "1rem",
                  borderRadius: "50%",
                  padding: 0
                }}
              />
            ) : (
              <AccountImage
                size={accountImageSize || 17}
                address={userAddress}
              />
            )}
          </ImageContainer>
        )}
        {withProfileText && userId && (
          <SellerInfo
            data-testid="seller-info"
            $withBosonStyles={withBosonStyles}
          >
            {isSeller
              ? lens?.name
                ? lens?.name
                : `Seller ID: ${userId}`
              : `Buyer ID: ${userId}`}
          </SellerInfo>
        )}
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default SellerID;
