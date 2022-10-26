import {
  Currencies,
  ProductCard as BosonProductCard
} from "@bosonprotocol/react-kit";
import { CameraSlash } from "phosphor-react";
import { useMemo } from "react";
import { generatePath, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { calcPrice } from "../../lib/utils/calcPrice";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useGetIpfsImage } from "../../lib/utils/hooks/useGetIpfsImage";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { getLensProfilePictureUrl } from "../modal/components/CreateProfile/Lens/utils";

interface Props {
  offer: any;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  dataTestId: string;
  isHoverDisabled?: boolean;
}

const ProductCardWrapper = styled.div<{ $isCustomStoreFront: boolean }>`
  [data-card="product-card"] {
    min-height: 500px;
    color: ${colors.black};
    [data-image-wrapper] {
      img {
        object-fit: contain;
        padding-bottom: 5.25rem;
      }
    }
  }
  ${({ $isCustomStoreFront }) => {
    if (!$isCustomStoreFront) {
      return "";
    }

    return css`
      [data-avatarname="product-card"] {
        color: ${colors.black};
      }
    `;
  }};
`;

export default function ProductCard({
  offer,
  dataTestId,
  isHoverDisabled = false
}: Props) {
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const [lens] = lensProfiles;
  const { imageSrc: avatar } = useGetIpfsImage(getLensProfilePictureUrl(lens));
  const { imageStatus, imageSrc } = useGetIpfsImage(
    offer?.metadata?.imageUrl || offer?.metadata?.image
  );
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();
  const handleText = useHandleText(offer);
  const price = useMemo(
    () =>
      offer?.price && offer?.exchangeToken?.decimals
        ? calcPrice(offer?.price, offer?.exchangeToken?.decimals)
        : 0,
    [offer.exchangeToken.decimals, offer.price]
  );

  const handleOnCardClick = () => {
    navigate(
      {
        pathname: generatePath(OffersRoutes.OfferDetail, {
          [UrlParameters.offerId]: offer.id
        })
      },
      {
        state: {
          from: location.pathname
        }
      }
    );
  };
  const handleOnAvatarClick = () => {
    navigate({
      pathname: generatePath(BosonRoutes.SellerPage, {
        [UrlParameters.sellerId]: offer.seller.id
      })
    });
  };
  return (
    <ProductCardWrapper $isCustomStoreFront={!!isCustomStoreFront}>
      <BosonProductCard
        dataCard="product-card"
        dataTestId={dataTestId}
        productId={offer?.id}
        onCardClick={handleOnCardClick}
        title={offer?.metadata?.name}
        avatarName={lens?.name ? lens?.name : `Seller ID: ${offer.seller.id}`}
        avatar={avatar || mockedAvatar}
        price={Number(price)}
        asterisk={offer?.additional?.variants?.length > 1 ? true : false}
        tooltip={
          offer?.additional?.variants?.length > 1
            ? "Price may be different on variants"
            : ""
        }
        currency={offer.exchangeToken.symbol as Currencies}
        onAvatarNameClick={handleOnAvatarClick}
        imageProps={{
          src: imageSrc,
          preloadConfig: {
            status: imageStatus,
            errorIcon: <CameraSlash size={32} color={colors.white} />
          }
        }}
        bottomText={handleText}
        isHoverDisabled={isHoverDisabled}
      />
    </ProductCardWrapper>
  );
}
