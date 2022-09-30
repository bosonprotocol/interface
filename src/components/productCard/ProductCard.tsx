import {
  Currencies,
  ProductCard as BosonProductCard
} from "@bosonprotocol/react-kit";
import { BigNumber, utils } from "ethers";
import { CameraSlash } from "phosphor-react";
import { useMemo } from "react";
import { generatePath, useLocation } from "react-router-dom";
import styled from "styled-components";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, OffersRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { useGetIpfsImage } from "../../lib/utils/hooks/useGetIpfsImage";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

interface Props {
  offer: Offer;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  dataTestId: string;
  isHoverDisabled?: boolean;
}

const ProductCardWrapper = styled.div`
  [data-card="product-card"] {
    min-height: 500px;
    color: ${colors.black};
  }
`;

export default function ProductCard({
  offer,
  dataTestId,
  isHoverDisabled = false
}: Props) {
  const { imageStatus, imageSrc } = useGetIpfsImage(offer.metadata.imageUrl);
  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();
  const handleText = useHandleText(offer);
  const price = useMemo(() => {
    try {
      return utils.formatUnits(
        BigNumber.from(offer.price),
        Number(offer.exchangeToken.decimals)
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [offer.exchangeToken.decimals, offer.price]);

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
    <ProductCardWrapper>
      <BosonProductCard
        dataCard="product-card"
        dataTestId={dataTestId}
        productId={offer.id}
        onCardClick={handleOnCardClick}
        title={offer.metadata.name}
        avatarName={`Seller ID: ${offer.seller.id}`}
        // TODO: ADD AVATAR IMAGE FOR NOW HARDCODED
        avatar={mockedAvatar}
        price={Number(price)}
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
