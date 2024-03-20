import {
  AuthTokenType,
  Currencies,
  ProductCard as BosonProductCard
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import { CameraSlash, Lock } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import { generatePath, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, ProductRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { Offer } from "../../lib/types/offer";
import { displayFloat } from "../../lib/utils/calcPrice";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  getFallbackImageUrl,
  getImageUrl,
  getLensImageUrl
} from "../../lib/utils/images";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import {
  ExtendedOffer,
  FilterOptions
} from "../../pages/explore/WithAllOffers";
import { getLensProfilePictureUrl } from "../modal/components/Profile/Lens/utils";
import { useConvertedPrice } from "../price/useConvertedPrice";

interface Props {
  offer: ExtendedOffer;
  filterOptions?: FilterOptions;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  dataTestId: string;
  isHoverDisabled?: boolean;
  lensProfile?: Profile;
}

const ProductCardWrapper = styled.div<{
  $isCustomStoreFront: boolean;
  $isLowerCardBgColorDefined: boolean;
  $bottomCardTextColor: string;
  $avatarTextColor: string;
}>`
  [data-card="product-card"] {
    height: 500px;
    background: var(--upperCardBgColor);
    ${({ $isLowerCardBgColorDefined, $bottomCardTextColor }) => {
      if ($isLowerCardBgColorDefined) {
        return css`
          color: ${$bottomCardTextColor};

          .bottom {
            background: var(--lowerCardBgColor);
          }
          * {
            color: ${$bottomCardTextColor};
          }
        `;
      }
      return css``;
    }}

    [data-image-wrapper] {
      img {
        object-fit: contain;
      }
    }
    ${({ $isCustomStoreFront }) => {
      if (!$isCustomStoreFront) {
        return css`
          border: 1px solid rgba(85, 96, 114, 0.15);
        `;
      }
      return "";
    }}
  }
  [data-avatarname="product-card"] {
    max-width: 100%;
    word-break: break-word;

    ${({ $isLowerCardBgColorDefined, $avatarTextColor }) => {
      if ($isLowerCardBgColorDefined) {
        return css`
          color: ${$avatarTextColor};
        `;
      }
      return css``;
    }}
  }
`;

export default function ProductCard({
  offer,
  dataTestId,
  isHoverDisabled = false,
  filterOptions,
  lensProfile
}: Props) {
  const { config } = useConfigContext();
  const isTokenGated = !!offer.condition?.id;

  const seller = offer?.seller;
  const metadata = seller?.metadata;
  const useLens = seller?.authTokenType === AuthTokenType.LENS;
  const regularProfilePicture =
    metadata?.images?.find((img) => img.tag === "profile")?.url ?? "";
  const avatar =
    (useLens && config.lens.ipfsGateway
      ? getLensImageUrl(
          getLensProfilePictureUrl(lensProfile),
          config.lens.ipfsGateway // this is our ipfs gateway, not lens'
        )
      : regularProfilePicture) ?? regularProfilePicture;
  const [avatarObj, setAvatarObj] = useState<{
    avatarUrl: string | null | undefined;
    status: "lens" | "fallback0" | "fallback1" | "mocked";
  }>({
    avatarUrl: avatar,
    status: "lens"
  });
  useEffect(() => {
    setAvatarObj({
      avatarUrl: avatar,
      status: "lens"
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lensProfile]);
  const avatarDifferentIpfsGateway =
    (useLens
      ? getLensImageUrl(
          getLensProfilePictureUrl(lensProfile),
          "https://ipfs.io/ipfs"
        )
      : regularProfilePicture) ?? regularProfilePicture;
  const fallbackSellerAvatar =
    offer.additional?.product?.productV1Seller?.images?.find(
      (img) => img.tag === "profile"
    )?.url;
  const fallbackSellerAvatarUrl =
    fallbackSellerAvatar && config.lens.ipfsGateway
      ? getLensImageUrl(fallbackSellerAvatar, config.lens.ipfsGateway)
      : fallbackSellerAvatar;
  const imageSrc = getImageUrl(
    offer?.metadata?.image || offer?.metadata?.imageUrl,
    { height: 500 }
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
          [UrlParameters.sellerId]: offer?.seller?.id,
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

  const name =
    (useLens ? lensProfile?.name : metadata?.name) ?? metadata?.name ?? "";
  const lowerCardBgColor = useCustomStoreQueryParameter("lowerCardBgColor");
  const isLowerCardBgColorDefined = !!lowerCardBgColor;
  const bottomCardTextColor = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--lowerCardBgColor") || colors.white,
    color1: useCSSVariable("--textColor") || colors.darkGrey
  });
  const avatarTextColor = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--lowerCardBgColor") || colors.white,
    color1: colors.accent,
    contrastThreshold: 4
  });
  return (
    <ProductCardWrapper
      $isCustomStoreFront={!!isCustomStoreFront}
      $isLowerCardBgColorDefined={isLowerCardBgColorDefined}
      $bottomCardTextColor={bottomCardTextColor}
      $avatarTextColor={avatarTextColor}
    >
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
        avatarName={name ? name : `Seller ID: ${offer.seller.id}`}
        avatar={avatarObj.avatarUrl || fallbackSellerAvatarUrl || mockedAvatar}
        onAvatarError={() => {
          // to avoid infinite loop
          if (avatarObj.status === "lens" && avatarDifferentIpfsGateway) {
            setAvatarObj({
              avatarUrl: avatarDifferentIpfsGateway,
              status: "fallback0"
            });
          } else if (
            avatarObj.status === "fallback0" &&
            fallbackSellerAvatarUrl
          ) {
            setAvatarObj({
              avatarUrl: fallbackSellerAvatarUrl,
              status: "fallback1"
            });
          } else {
            setAvatarObj({
              avatarUrl: mockedAvatar,
              status: "mocked"
            });
          }
        }}
        price={Number(displayFloat(price?.price || 0))}
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
          fallbackSrc: getFallbackImageUrl(imageSrc),
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
