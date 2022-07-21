import { exchanges } from "@bosonprotocol/core-sdk";
import {
  ExchangeFieldsFragment,
  ExchangeState
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { Provider } from "@bosonprotocol/ethers-sdk";
import {
  CancelButton,
  CommitButton,
  RedeemButton
} from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { Check, Question } from "phosphor-react";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { titleCase } from "../../../lib/utils/formatText";
import { isOfferHot } from "../../../lib/utils/getOfferLabel";
import { getBuyerCancelPenalty } from "../../../lib/utils/getPrices";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { getItemFromStorage } from "../../../lib/utils/hooks/useLocalStorage";
import { useModal } from "../../modal/useModal";
import Price from "../../price/index";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import {
  Break,
  CommitAndRedeemButton,
  RaiseProblemButton,
  RedeemLeftButton,
  Widget,
  WidgetUpperGrid
} from "../Detail.style";
import DetailTable from "../DetailTable";
import { DetailDisputeResolver } from "./DetailDisputeResolver";
import { DetailSellerDeposit } from "./DetailSellerDeposit";

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

interface IDetailWidget {
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: NonNullable<Offer["exchanges"]>[number];
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
}

const oneSecondToDays = 86400;
const getOfferDetailData = (
  offer: Offer,
  convertedPrice: IPrice | null,
  isModal: boolean
) => {
  const redeemableUntil = dayjs(
    Number(offer.validFromDate) * 1000 +
      Number(offer.voucherValidDuration) * 1000
  ).format(CONFIG.dateFormat);

  const priceNumber = Number(convertedPrice?.converted);

  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(offer, convertedPrice);
  return [
    {
      name: "Redeemable until",
      info: (
        <>
          <Typography tag="h6">
            <b>Redeemable</b>
          </Typography>
          <Typography tag="p">
            If you don’t redeem your NFT during the redemption period, it will
            expire and you will receive back the price minus the Buyer cancel
            penalty
          </Typography>
        </>
      ),
      value: <Typography tag="p">{redeemableUntil}</Typography>
    },
    isModal
      ? {
          name: "Price",
          value: convertedPrice?.currency ? (
            <Typography tag="p">
              {convertedPrice?.price} ETH
              <small>
                ({convertedPrice?.currency?.symbol} {convertedPrice?.converted})
              </small>
            </Typography>
          ) : (
            <Typography tag="p">{convertedPrice?.price} ETH</Typography>
          )
        }
      : { hide: true },
    {
      name: DetailSellerDeposit.name,
      info: DetailSellerDeposit.info,
      value: (
        <DetailSellerDeposit.value offer={offer} conversionRate={priceNumber} />
      )
    },
    {
      name: "Buyer cancel. pen.",
      info: (
        <>
          <Typography tag="h6">
            <b>Buyer Cancelation penalty</b>
          </Typography>
          <Typography tag="p">
            If you fail to redeem your rNFT in time, you will receive back the
            price minus the buyer cancellation penalty.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {buyerCancelationPenalty}%
          <small>(${convertedBuyerCancelationPenalty})</small>
        </Typography>
      )
    },
    {
      name: "Fair exchange policy",
      info: (
        <>
          <Typography tag="h6">
            <b>Exchange policy</b>
          </Typography>
          <Typography tag="p">
            The Exchange policy ensures that the terms of sale are set in a fair
            way to protect both buyers and sellers.
          </Typography>
        </>
      ),
      value: <Check size={16} />
    },
    {
      name: DetailDisputeResolver.name,
      info: DetailDisputeResolver.info,
      value: <DetailDisputeResolver.value />
    }
  ];
};

const SHOULD_DISPLAY_REDEEM_BTN = [
  ExchangeState.Revoked,
  ExchangeState.Cancelled,
  exchanges.ExtendedExchangeState.Expired,
  ExchangeState.Completed
];
const DetailWidget: React.FC<IDetailWidget> = ({
  pageType,
  offer,
  exchange,
  name = "",
  image = "",
  hasSellerEnoughFunds
}) => {
  const { showModal, modalTypes } = useModal();
  const { isLteXS } = useBreakpoints();
  const cancelRef = useRef<HTMLDivElement | null>(null);

  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as ExchangeFieldsFragment)
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === ExchangeState.Committed;
  const isBeforeRedeem =
    !exchangeStatus || !SHOULD_DISPLAY_REDEEM_BTN.includes(exchangeStatus);

  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals
  });

  const OFFER_DETAIL_DATA = useMemo(
    () => getOfferDetailData(offer, convertedPrice, false),
    [offer, convertedPrice]
  );
  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () => getOfferDetailData(offer, convertedPrice, true),
    [offer, convertedPrice]
  );
  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable),
    [offer?.quantityAvailable]
  );
  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(Number(offer?.validUntilDate) * 1000).isBefore(dayjs()),
    [offer?.validUntilDate]
  );
  const isVoidedOffer = !!offer.voidedAt;
  const isHotOffer = useMemo(
    () => isOfferHot(offer?.quantityAvailable, offer?.quantityInitial),
    [offer?.quantityAvailable, offer?.quantityInitial]
  );
  const redeemableDays = Math.round(
    Number(offer.voucherValidDuration) / oneSecondToDays
  );

  const handleCancel = () => {
    // TODO: it's just a workaround for now
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const child = cancelRef.current!.children[0] ?? null;
    if (child) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      child.click();
    }
  };
  const handleRedeemModal = () => {
    showModal(modalTypes.WHAT_IS_REDEEM, { title: "Commit and Redeem" });
  };

  const isChainUnsupported = getItemFromStorage("isChainUnsupported", false);

  const BASE_MODAL_DATA = useMemo(
    () => ({
      data: OFFER_DETAIL_DATA_MODAL,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      exchange: exchange!,
      image,
      name
    }),
    [OFFER_DETAIL_DATA_MODAL, exchange, image, name]
  );

  return (
    <>
      <Widget>
        {isExchange && isBeforeRedeem && (
          <RedeemLeftButton>
            {redeemableDays} days left to Redeem
          </RedeemLeftButton>
        )}
        <div>
          <WidgetUpperGrid
            style={{ paddingBottom: !isExchange || isLteXS ? "0.5rem" : "0" }}
          >
            <StyledPrice
              isExchange={isExchange}
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              tag="h3"
              convert
            />
            {isOffer && (
              <Grid
                alignItems="center"
                justifyContent="flex-end"
                style={{ marginTop: isLteXS ? "-7rem" : "0" }}
              >
                <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
                  {isHotOffer && (
                    <>
                      {quantity === 0 && "No items available!"}
                      {quantity > 0 &&
                        `Only ${quantity} ${
                          quantity === 1 ? "item" : "items"
                        } left!`}
                    </>
                  )}
                </Typography>
              </Grid>
            )}
            {isOffer && (
              <CommitButton
                disabled={
                  isChainUnsupported ||
                  !hasSellerEnoughFunds ||
                  isExpiredOffer ||
                  isLoading ||
                  !quantity ||
                  isVoidedOffer
                }
                offerId={offer.id}
                chainId={CONFIG.chainId}
                onError={(args) => {
                  console.error("onError", args);
                  setIsLoading(false);
                  showModal(modalTypes.DETAIL_WIDGET, {
                    title: "An error occurred",
                    message: "An error occurred when trying to commit!",
                    type: "ERROR",
                    state: "Committed",
                    ...BASE_MODAL_DATA
                  });
                }}
                onPendingSignature={() => {
                  console.log("onPendingSignature");
                  setIsLoading(true);
                }}
                onSuccess={(args, { exchangeId }) => {
                  console.log("onSuccess", args, exchangeId);
                  setIsLoading(false);
                  showModal(modalTypes.DETAIL_WIDGET, {
                    title: "You have successfully committed!",
                    message: "You now own the rNFT",
                    type: "SUCCESS",
                    id: exchangeId.toString(),
                    state: "Committed",
                    ...BASE_MODAL_DATA
                  });
                }}
                extraInfo="Step 1/2"
                web3Provider={signer?.provider as Provider}
              />
            )}
            {isToRedeem && (
              <RedeemButton
                disabled={isChainUnsupported || isLoading || isOffer}
                exchangeId={exchange?.id || offer.id}
                chainId={CONFIG.chainId}
                onError={(args) => {
                  console.error("onError", args);
                  setIsLoading(false);
                  showModal(modalTypes.DETAIL_WIDGET, {
                    title: "An error occurred",
                    message: "An error occurred when trying to redeem!",
                    type: "ERROR",
                    state: "Redeemed",
                    ...BASE_MODAL_DATA
                  });
                }}
                onPendingSignature={() => {
                  console.log("onPendingSignature");
                  setIsLoading(true);
                }}
                onSuccess={(args) => {
                  console.log("onSuccess", args);
                  setIsLoading(false);
                  showModal(modalTypes.DETAIL_WIDGET, {
                    title: "You have successfully redeemed!",
                    message: "You have successfully redeemed!",
                    type: "SUCCESS",
                    state: "Redeemed",
                    ...BASE_MODAL_DATA
                  });
                }}
                extraInfo={isToRedeem ? "Step 2/2" : "Step 2"}
                web3Provider={signer?.provider as Provider}
              />
            )}
            {!isToRedeem && (
              <Button theme="outline" disabled>
                {titleCase(exchangeStatus)}
                <Check size={24} />
              </Button>
            )}
          </WidgetUpperGrid>
        </div>
        <Grid
          justifyContent="center"
          style={
            !isOffer && !isLteXS
              ? {
                  maxWidth: "50%",
                  marginLeft: "calc(50% - 0.5rem)"
                }
              : {}
          }
        >
          {isBeforeRedeem ? (
            <CommitAndRedeemButton
              tag="p"
              onClick={handleRedeemModal}
              style={{ fontSize: "0.75rem", marginTop: 0 }}
            >
              {isOffer ? "What is commit and redeem?" : "What is redeem?"}
            </CommitAndRedeemButton>
          ) : (
            <CommitAndRedeemButton
              tag="p"
              style={{ fontSize: "0.75rem", marginTop: 0 }}
            >
              &nbsp;
            </CommitAndRedeemButton>
          )}
        </Grid>
        <Break />
        <div>
          <DetailTable align noBorder data={OFFER_DETAIL_DATA} />
        </div>
        {isExchange && isBeforeRedeem && (
          <>
            <Break />
            <RaiseProblemButton
              onClick={handleCancel}
              theme="blank"
              style={{ fontSize: "0.875rem" }}
              disabled={isChainUnsupported}
            >
              Raise a problem
              <Question size={18} />
            </RaiseProblemButton>
          </>
        )}
      </Widget>

      {isExchange && (
        <div
          style={{ opacity: 0 }}
          ref={(ref) => {
            cancelRef.current = ref;
          }}
        >
          <CancelButton
            disabled={isChainUnsupported || isLoading}
            exchangeId={exchange?.id || offer.id}
            chainId={CONFIG.chainId}
            onError={(args) => {
              console.error("onError", args);
              setIsLoading(false);
              showModal(modalTypes.DETAIL_WIDGET, {
                title: "An error occurred",
                message: "An error occurred when trying to cancel!",
                type: "ERROR",
                state: "Cancelled",
                ...BASE_MODAL_DATA
              });
            }}
            onPendingSignature={() => {
              console.log("onPendingSignature");
              setIsLoading(true);
            }}
            onSuccess={(args) => {
              console.log("onSuccess", args);
              setIsLoading(false);
              showModal(modalTypes.DETAIL_WIDGET, {
                title: "You have successfully cancelled!",
                message: "You have successfully cancelled!",
                type: "SUCCESS",
                state: "Cancelled",
                ...BASE_MODAL_DATA
              });
            }}
            web3Provider={signer?.provider as Provider}
          />
        </div>
      )}
    </>
  );
};

export default DetailWidget;
