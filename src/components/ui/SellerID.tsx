import { subgraph } from "@bosonprotocol/react-kit";
import { Image as AccountImage } from "@davatar/react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import Grid, { IGrid } from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { Offer } from "../../lib/types/offer";
import { getOfferDetails } from "../../lib/utils/hooks/getOfferDetails";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import bosonProtocolImage from "../../pages/offers/mock/bosonprotocol.jpeg";
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

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  color: var(--secondary);
  font-family: "Plus Jakarta Sans";
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

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    offer: Offer;
    buyerOrSeller:
      | Pick<subgraph.Seller, "id" | "operator">
      | Pick<subgraph.Buyer, "id" | "wallet">;
    accountImageSize?: number;
    withProfileImage: boolean;
    customImage?: boolean;
    withProfileText?: boolean;
    onClick?: null | undefined | React.MouseEventHandler<HTMLDivElement>;
  } & IGrid &
    React.HTMLAttributes<HTMLDivElement>
> = ({
  children,
  offer,
  buyerOrSeller,
  withProfileImage,
  customImage,
  onClick,
  accountImageSize,
  withProfileText = true,
  ...rest
}) => {
  const navigate = useKeepQueryParamsNavigate();
  const { artist } = getOfferDetails(offer);

  const userId = buyerOrSeller?.id;
  const isSeller = "operator" in buyerOrSeller;
  const userAddress = isSeller ? buyerOrSeller.operator : buyerOrSeller.wallet;
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
            navigate({
              pathname: generatePath(BosonRoutes.Account, {
                [UrlParameters.accountId]: userAddress
              })
            });
          }
        }}
        data-seller-container
      >
        {withProfileImage && (
          <ImageContainer>
            {artist.images?.length !== 0 || customImage ? (
              <Image
                src={
                  artist?.images ? artist?.images[0]?.url : bosonProtocolImage
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
        {withProfileText && (
          <SellerInfo data-testid="seller-info">
            {isSeller ? `Seller ID: ${userId}` : `Buyer ID: ${userId}`}
          </SellerInfo>
        )}
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default SellerID;
