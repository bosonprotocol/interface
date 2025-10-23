import {
  AuthTokenType,
  Currencies,
  ExchangeCard,
  ExchangeCardStatus,
  exchanges,
  hooks,
  isBundle,
  ProductType,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { useAccount, useSigner } from "lib/utils/hooks/connection/connection";
import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import { CameraSlash } from "phosphor-react";
import { useMemo, useRef, useState } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import mockedAvatar from "../../assets/frame.png";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { calcPrice } from "../../lib/utils/calcPrice";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
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
  sellerLensProfile?: Profile;
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

export default function Exchange({
  offer,
  exchange,
  sellerLensProfile
}: Props) {
  const { config } = useConfigContext();
  const seller = exchange?.seller;
  const metadata = seller?.metadata;
  const useLens = seller?.authTokenType === AuthTokenType.LENS;
  const regularProfilePicture =
    metadata?.images?.find((img) => img.tag === "profile")?.url ?? "";
  const avatar =
    (useLens && config.lens.ipfsGateway
      ? getLensImageUrl(
          getLensProfilePictureUrl(sellerLensProfile),
          config.lens.ipfsGateway
        )
      : regularProfilePicture) ?? regularProfilePicture;
  const sellerName =
    (useLens ? sellerLensProfile?.name : metadata?.name) ??
    (metadata?.name || `Seller ID: ${seller?.id}`);

  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const { mainImage } = getOfferDetails(offer.metadata);
  const imageSrc = getImageUrl((mainImage || offer?.metadata?.imageUrl) ?? "", {
    height: 500
  });
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const { account: address } = useAccount();
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
        [UrlParameters.sellerId]: offer.seller?.id || null
      })
    });
  };
  const iframeRef = useRef<HTMLIFrameElement>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const signer = useSigner();
  const { reload: reloadIframeListener } = hooks.useCallSignerFromIframe({
    iframeRef,
    isIframeLoaded,
    signer,
    childIframeOrigin: CONFIG.widgetsUrl as `http${string}`
  });
  function onLoadIframe({ iframe }: { iframe: HTMLIFrameElement }) {
    iframeRef.current = iframe;
    setIsIframeLoaded(true);
    reloadIframeListener();
  }
  const createSpecificCardConfig = () => {
    switch (status) {
      case "REDEEMED": {
        const handleDispute = () => {
          showModal(
            modalTypes.RAISE_DISPUTE,
            {
              title: "Dispute mutual resolution process",
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
        const handleRedeem = () => {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.bosonWidgetShowRedeem(
              {
                exchangeId: exchange?.id || "",
                widgetAction: "REDEEM_FORM",
                configId: config.envConfig.configId,
                account: address,
                withExternalSigner: "true"
              },
              onLoadIframe
            );
          } catch (e) {
            console.error(e);
            Sentry.captureException(e);
          }
        };
        const handleCancel = () => {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window.bosonWidgetShowRedeem(
              {
                exchangeId: exchange?.id || "",
                widgetAction: "CANCEL_FORM",
                showRedemptionOverview: false,
                configId: config.envConfig.configId,
                account: address,
                withExternalSigner: "true"
              },
              onLoadIframe
            );
          } catch (e) {
            console.error(e);
            Sentry.captureException(e);
          }
        };
        return {
          status: "COMMITTED" as Extract<ExchangeCardStatus, "COMMITTED">,
          isCTAVisible: isBuyer,
          bottomText: handleText,
          redeemButtonConfig: {
            onClick: handleRedeem
          },
          cancelButtonConfig: {
            onClick: handleCancel
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
  const isPhygital = isBundle(offer);
  return (
    <ExchangeCardWrapper $isCustomStoreFront={!!isCustomStoreFront}>
      <ExchangeCard
        onCardClick={handleOnCardClick}
        isConnected={!!address}
        dataCard="exchange-card"
        id={offer.id}
        title={offer.metadata?.name || ""}
        avatarName={sellerName}
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
        price={price}
        currency={offer.exchangeToken.symbol as Currencies}
        productType={isPhygital ? ProductType.phygital : ProductType.physical}
        {...createSpecificCardConfig()}
      />
    </ExchangeCardWrapper>
  );
}
