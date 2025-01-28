import { AuthTokenType, subgraph } from "@bosonprotocol/react-kit";
import { Image as AccountImage } from "@davatar/react";
import { useConfigContext } from "components/config/ConfigContext";
import { defaultFontFamily } from "lib/styles/fonts";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { memo } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import { Grid, GridProps } from "../../components/ui/Grid";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getLensImageUrl } from "../../lib/utils/images";
import { getOfferDetails } from "../../lib/utils/offer/getOfferDetails";
import { getLensProfilePictureUrl } from "../modal/components/Profile/Lens/utils";
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
          color: ${colors.violet};
          font-family: ${defaultFontFamily};
        `
      : css`
          color: var(--accent);
        `};

  font-style: normal;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 18px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Buyer = Pick<subgraph.Buyer, "id" | "wallet">;
export type Seller = Pick<
  subgraph.Seller,
  "id" | "assistant" | "authTokenType" | "authTokenId"
> & {
  metadata?: {
    name?: string | null;
    images?: { url: string; tag?: string | null }[] | null;
  } | null;
};

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    offerMetadata: Offer["metadata"];
    accountToShow?: Buyer | Seller;
    accountImageSize?: number;
    withProfileImage: boolean;
    withProfileText?: boolean;
    withBosonStyles?: boolean;
    onClick?: null | undefined | React.MouseEventHandler<HTMLDivElement>;
    lensProfile?: Profile;
  } & Omit<GridProps, "onClick"> &
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">
> = ({
  children,
  offerMetadata,
  accountToShow,
  withProfileImage,
  onClick,
  accountImageSize,
  withProfileText = true,
  withBosonStyles = false,
  lensProfile,
  ...rest
}) => {
  const { config } = useConfigContext();
  const { account: address } = useAccount();
  const navigate = useKeepQueryParamsNavigate();
  const { artist } = getOfferDetails(offerMetadata);

  const userId = accountToShow?.id;
  const isSeller = accountToShow ? "assistant" in accountToShow : false;
  const userAddress = accountToShow
    ? isSeller
      ? (accountToShow as Seller).assistant
      : (accountToShow as Buyer).wallet
    : address;
  const hasCursorPointer = !!onClick || onClick === undefined;
  const seller = isSeller ? (accountToShow as Seller) : null;
  const sellerMetadata = seller?.metadata;
  const useLens = seller?.authTokenType === AuthTokenType.LENS;
  const sellerRegularProfilePicture =
    sellerMetadata?.images?.find((img) => img.tag === "profile")?.url ?? "";
  const lensProfilePicture = getLensProfilePictureUrl(lensProfile);
  const productV1SellerProfileImage =
    artist?.images?.find((img) => img.tag === "profile")?.url ?? "";
  const profilePicture =
    (useLens ? lensProfilePicture : sellerRegularProfilePicture) ??
    productV1SellerProfileImage;
  const profilePictureToShow =
    useLens && config.lens.ipfsGateway
      ? getLensImageUrl(profilePicture, config.lens.ipfsGateway)
      : sellerRegularProfilePicture;
  const sellerName =
    (useLens ? lensProfile?.name : sellerMetadata?.name) ??
    sellerMetadata?.name;
  return (
    <AddressContainer {...rest} data-address-container>
      <SellerContainer
        $hasCursorPointer={hasCursorPointer}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          } else if (onClick !== null) {
            e.stopPropagation();
            if (!userId) {
              return;
            }
            if (isSeller) {
              navigate({
                pathname: generatePath(BosonRoutes.SellerPage, {
                  [UrlParameters.sellerId]: userId ?? null
                })
              });
            } else {
              navigate({
                pathname: generatePath(BosonRoutes.BuyerPage, {
                  [UrlParameters.buyerId]: userId ?? null
                })
              });
            }
          }
        }}
        data-seller-container
      >
        {withProfileImage && userId && (
          <ImageContainer>
            {profilePicture ? (
              <Image
                src={profilePictureToShow}
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
              ? sellerName
                ? sellerName
                : `Seller ID: ${userId}`
              : `Buyer ID: ${userId}`}
          </SellerInfo>
        )}
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default memo(SellerID);
