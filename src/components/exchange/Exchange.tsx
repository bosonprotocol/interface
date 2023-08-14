import {
  Currencies,
  ExchangeCard,
  ExchangeCardStatus,
  exchanges,
  subgraph
} from "@bosonprotocol/react-kit";
import { CameraSlash } from "phosphor-react";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { calcPrice } from "../../lib/utils/calcPrice";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { Exchange as IExchange } from "../../lib/utils/hooks/useExchanges";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  getFallbackImageUrl,
  getImageUrl,
  getLensImageUrl
} from "../../lib/utils/images";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { getLensProfilePictureUrl } from "../modal/components/Profile/Lens/utils";
import { useModal } from "../modal/useModal";

interface Props {
  offer: Offer;
  exchange: IExchange;
  isPrivateProfile?: boolean;
  reload?: () => void;
}

const ExchangeCardWrapper = styled.div<{ $isCustomStoreFront: boolean }>`
  [data-card="exchange-card"] {
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
      [data-avatarname="exchange-card"] {
        color: ${colors.black};
      }
    `;
  }};
`;

export default function Exchange({ offer, exchange }: Props) {
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const [lens] = lensProfiles;
  const avatar = getLensImageUrl(getLensProfilePictureUrl(lens));

  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const imageSrc = getImageUrl(offer.metadata.imageUrl, {
    height: 500
  });
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();

  const handleText = useHandleText(offer);

  const status = useMemo(
    () =>
      exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment),
    [exchange]
  );

  const price = useMemo(
    () => calcPrice(offer.price, offer.exchangeToken.decimals),
    [offer.exchangeToken.decimals, offer.price]
  );

  const handleOnCardClick = () => {
    navigate({
      pathname: generatePath(BosonRoutes.Exchange, {
        [UrlParameters.exchangeId]: exchange.id
      })
    });
  };

  const handleOnAvatarClick = () => {
    navigate({
      pathname: generatePath(BosonRoutes.SellerPage, {
        [UrlParameters.sellerId]: offer.seller.id
      })
    });
  };

  const createSpecificCardConfig = () => {
    switch (status) {
      case "REDEEMED": {
        const handleDispute = () => {
          showModal(
            modalTypes.RAISE_DISPUTE,
            {
              title: "Dispute process",
              exchangeId: exchange?.id || ""
            },
            "auto",
            undefined,
            {
              l: "1000px"
            }
          );
        };
        return {
          status: "REDEEMED" as Extract<ExchangeCardStatus, "REDEEMED">,
          isCTAVisible: isBuyer,
          disputeButtonConfig: {
            onClick: handleDispute,
            variant: "secondaryInverted" as const,
            showBorder: false
          }
        };
      }
      case "CANCELLED":
        return {
          status: "CANCELLED" as Extract<ExchangeCardStatus, "CANCELLED">,
          isCTAVisible: isBuyer
        };
      case "COMMITTED": {
        return {
          status: "COMMITTED" as Extract<ExchangeCardStatus, "COMMITTED">,
          isCTAVisible: isBuyer,
          bottomText: handleText,
          redeemButtonConfig: {
            // button id must start with "boson-redeem" to handle the redeem widget
            id: `boson-redeem-redeem-${exchange?.id}`,
            "data-exchange-id": exchange?.id,
            "data-bypass-mode": "REDEEM"
          },
          cancelButtonConfig: {
            // button id must start with "boson-redeem" to handle the redeem widget
            id: `boson-redeem-cancel-${exchange?.id}`,
            "data-exchange-id": exchange?.id,
            "data-bypass-mode": "CANCEL"
          }
        };
      }
      default:
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: status as any
        };
    }
  };

  return (
    <ExchangeCardWrapper $isCustomStoreFront={!!isCustomStoreFront}>
      <ExchangeCard
        onCardClick={handleOnCardClick}
        dataCard="exchange-card"
        id={offer.id}
        title={offer.metadata.name}
        avatarName={lens?.name ? lens?.name : `Seller ID: ${offer.seller.id}`}
        avatar={avatar || mockedAvatar}
        imageProps={{
          src: imageSrc,
          fallbackSrc: getFallbackImageUrl(imageSrc),
          withLoading: true,
          errorConfig: {
            errorIcon: <CameraSlash size={32} color={colors.white} />
          }
        }}
        onAvatarNameClick={handleOnAvatarClick}
        price={Number(price)}
        currency={offer.exchangeToken.symbol as Currencies}
        {...createSpecificCardConfig()}
      />
    </ExchangeCardWrapper>
  );
}
