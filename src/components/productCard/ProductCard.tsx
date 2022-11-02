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
import { BosonRoutes, ProductRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { Offer } from "../../lib/types/offer";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useGetIpfsImage } from "../../lib/utils/hooks/useGetIpfsImage";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import {
  ExtendedOffer,
  FilterOptions
} from "../../pages/explore/WithAllOffers";
import { getLensProfilePictureUrl } from "../modal/components/CreateProfile/Lens/utils";
import { useConvertedPrice } from "../price/useConvertedPrice";

interface Props {
  offer: ExtendedOffer;
  filterOptions?: FilterOptions;
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
  isHoverDisabled = false,
  filterOptions
}: Props) {
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const [lens] = lensProfiles;
  const { imageSrc: avatar } = useGetIpfsImage(getLensProfilePictureUrl(lens));
  const { imageStatus, imageSrc } = useGetIpfsImage(
    offer?.metadata?.image || offer?.metadata?.imageUrl
  );
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();
  const handleText = useHandleText(offer);

  const priceValue = useMemo(() => {
    if (filterOptions?.orderBy === "price") {
      const selected =
        filterOptions?.orderDirection === "asc"
          ? offer?.priceDetails?.low
          : offer?.priceDetails?.high;

      return {
        value: selected?.value || "",
        decimals: selected?.exchangeToken?.decimals || "",
        symbol: selected?.exchangeToken?.symbol || ""
      };
    }
    return {
      value: offer?.price || "",
      decimals: offer?.exchangeToken?.decimals || "",
      symbol: offer?.exchangeToken?.symbol || ""
    };
  }, [offer, filterOptions]);

  const price = useConvertedPrice(priceValue);

  const handleOnCardClick = () => {
    navigate(
      {
        pathname: generatePath(ProductRoutes.ProductDetail, {
          [UrlParameters.uuid]: offer?.uuid || ""
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
  const allVariantsHaveSamePrice = useMemo(() => {
    const variantsPrices = offer?.additional?.variants
      .map((variant) => variant.price)
      .filter(isTruthy);
    const variantsAddresses = offer?.additional?.variants
      .map((variant) => variant.exchangeToken.address)
      .filter(isTruthy);
    return (
      new Set(variantsPrices).size === 1 &&
      new Set(variantsAddresses).size === 1
    );
  }, [offer?.additional?.variants]);
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
        price={Number(price?.price || 0)}
        asterisk={
          offer?.additional &&
          offer?.additional?.variants?.length > 1 &&
          !allVariantsHaveSamePrice
        }
        tooltip={
          ((offer?.additional && offer?.additional?.variants) || [])?.length > 1
            ? "Price may be different on variants"
            : ""
        }
        currency={priceValue?.symbol as Currencies}
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
