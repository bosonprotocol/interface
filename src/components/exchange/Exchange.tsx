import {
  Currencies,
  ExchangeCard,
  ExchangeCardStatus,
  exchanges,
  subgraph
} from "@bosonprotocol/react-kit";
import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import { useAccount } from "wagmi";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { Offer } from "../../lib/types/offer";
import { Exchange as IExchange } from "../../lib/utils/hooks/useExchanges";
import { useGetIpfsImage } from "../../lib/utils/hooks/useGetIpfsImage";
import { useHandleText } from "../../lib/utils/hooks/useHandleText";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getOfferDetailData } from "../detail/DetailWidget/DetailWidget";
import { useModal } from "../modal/useModal";
import { useConvertedPrice } from "../price/useConvertedPrice";

interface Props {
  offer: Offer;
  exchange: IExchange;
  isPrivateProfile?: boolean;
  reload?: () => void;
}

export default function Exchange({ offer, exchange, reload }: Props) {
  const { showModal, modalTypes } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const { imageStatus, imageSrc } = useGetIpfsImage(offer.metadata.imageUrl);
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();

  const handleText = useHandleText(offer);

  const status = useMemo(
    () =>
      exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment),
    [exchange]
  );

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
    navigate({
      pathname: generatePath(BosonRoutes.Exchange, {
        [UrlParameters.exchangeId]: exchange.id
      })
    });
  };

  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () => getOfferDetailData(offer, convertedPrice, true),
    [offer, convertedPrice]
  );

  const BASE_MODAL_DATA = useMemo(
    () => ({
      data: OFFER_DETAIL_DATA_MODAL,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      exchange: exchange!,
      image: offer.metadata.imageUrl,
      name: offer.metadata.name
    }),
    [
      OFFER_DETAIL_DATA_MODAL,
      exchange,
      offer.metadata.imageUrl,
      offer.metadata.name
    ]
  );

  const createSpecificCardConfig = () => {
    switch (status) {
      case "REDEEMED": {
        const handleDispute = () => {
          showModal(modalTypes.RAISE_DISPUTE, {
            title: "Raise a problem",
            exchangeId: exchange?.id || ""
          });
        };
        return {
          status: "REDEEMED" as Extract<ExchangeCardStatus, "REDEEMED">,
          isCTAVisible: isBuyer,
          disputeButtonConfig: {
            onClick: handleDispute,
            variant: "ghostOrange" as const
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
          showModal(
            modalTypes.REDEEM,
            {
              title: "Redeem your item",
              exchangeId: exchange?.id || "",
              buyerId: exchange?.buyer.id || "",
              sellerId: exchange?.seller.id || "",
              sellerAddress: exchange?.seller.operator || "",
              reload
            },
            "s"
          );
        };
        const handleCancel = () => {
          if (!exchange) {
            return;
          }
          showModal(modalTypes.CANCEL_EXCHANGE, {
            title: "Cancel exchange",
            exchange,
            BASE_MODAL_DATA,
            reload
          });
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

  return (
    <ExchangeCard
      onCardClick={handleOnCardClick}
      id={offer.id}
      title={offer.metadata.name}
      avatarName="ABI"
      avatar="https://images.unsplash.com/photo-1613771404721-1f92d799e49f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9rZW1vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
      imageProps={{
        src: imageSrc,
        preloadConfig: {
          status: imageStatus
        }
      }}
      price={Number(price)}
      currency={offer.exchangeToken.symbol as Currencies}
      {...createSpecificCardConfig()}
    />
  );
}
