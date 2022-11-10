import {
  Currencies,
  ProductCard as BosonProductCard
} from "@bosonprotocol/react-kit";
import { CameraSlash, Lock } from "phosphor-react";
import { useMemo, useState } from "react";
import { generatePath, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, ProductRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { Offer } from "../../lib/types/offer";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getImageUrl, getLensImageUrl } from "../../lib/utils/images";
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
    height: 500px;
    color: ${colors.black};
    [data-image-wrapper] {
      img {
        object-fit: contain;
      }
    }
  }
  [data-avatarname="product-card"] {
    max-width: 100%;
    word-break: break-word;
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
  const isTokenGated = !!offer.condition?.id;

  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const [lens] = lensProfiles;
  const avatar = getLensImageUrl(getLensProfilePictureUrl(lens));
  const [avatarObj, setAvatarObj] = useState<{
    avatarUrl: string | null | undefined;
    status: "lens" | "fallback" | "mocked";
  }>({
    avatarUrl: avatar,
    status: "lens"
  });
  const fallbackSellerAvatar: string | null = // TODO: fix types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    offer.additional?.product.productV1Seller.images.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img: any) => img.tag === "profile"
    )?.url;
  const fallbackSellerAvatarUrl = fallbackSellerAvatar
    ? getLensImageUrl(fallbackSellerAvatar)
    : fallbackSellerAvatar;
  const imageSrc = getImageUrl(
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
  const hasVariantsWithDifferentPrice =
    offer?.additional &&
    offer?.additional?.variants?.length > 1 &&
    !allVariantsHaveSamePrice;
  return (
    <ProductCardWrapper $isCustomStoreFront={!!isCustomStoreFront}>
      {isTokenGated && (
        <LockIcon>
          <Lock size={20} color={colors.grey} />
        </LockIcon>
      )}
      <BosonProductCard
        dataCard="product-card"
        dataTestId={dataTestId}
        productId={offer?.id}
        onCardClick={handleOnCardClick}
        title={offer?.metadata?.name}
        avatarName={lens?.name ? lens?.name : `Seller ID: ${offer.seller.id}`}
        avatar={avatarObj.avatarUrl || fallbackSellerAvatarUrl || mockedAvatar}
        onAvatarError={() => {
          // to avoid infinite loop
          if (avatarObj.status === "lens") {
            setAvatarObj({
              avatarUrl: fallbackSellerAvatarUrl,
              status: "fallback"
            });
          } else if (avatarObj.status === "fallback") {
            setAvatarObj({
              avatarUrl: mockedAvatar,
              status: "mocked"
            });
          }
        }}
        price={Number(price?.price || 0)}
        asterisk={hasVariantsWithDifferentPrice}
        tooltip={
          hasVariantsWithDifferentPrice
            ? "Price may be different on variants"
            : ""
        }
        currency={priceValue?.symbol as Currencies}
        onAvatarNameClick={handleOnAvatarClick}
        imageProps={{
          src: imageSrc,
          withLoading: true,
          errorConfig: {
            errorIcon: <CameraSlash size={32} color={colors.white} />
          }
        }}
        bottomText={handleText}
        isHoverDisabled={isHoverDisabled}
      />
    </ProductCardWrapper>
  );
}

const LockIcon = styled.div`
  position: absolute;
  z-index: 4;
  background-color: ${colors.white};
  padding: 0.5rem;
  border-radius: 50%;
  border: 0.125rem solid ${colors.black};
  width: 2.5rem;
  height: 2.5rem;
  margin-top: 1.063rem;
  margin-left: 1.063rem;
  display: grid;
  justify-content: center;
  align-content: center;
`;
