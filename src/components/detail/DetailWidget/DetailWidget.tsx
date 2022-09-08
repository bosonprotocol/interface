import { ExtendedExchangeState } from "@bosonprotocol/core-sdk/dist/cjs/exchanges";
import { ExchangeState } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import {
  CommitButton,
  exchanges,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { Check, Question } from "phosphor-react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount, useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { titleCase } from "../../../lib/utils/formatText";
import { isOfferHot } from "../../../lib/utils/getOfferLabel";
import { getBuyerCancelPenalty } from "../../../lib/utils/getPrices";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
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
  ContactSellerButton,
  RaiseProblemButton,
  RedeemLeftButton,
  StyledCancelButton,
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

const RedeemButton = styled(Button)`
  padding: 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;

  && {
    > div {
      width: 100%;
      gap: 1rem;
      display: flex;
      align-items: stretch;
      justify-content: center;
      small {
        align-items: center;
      }
    }

    ${breakpoint.s} {
      > div {
        gap: 0.5rem;
      }
    }
    ${breakpoint.m} {
      > div {
        gap: 1rem;
      }
    }
  }
`;

interface IDetailWidget {
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: Exchange;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
}

export const getOfferDetailData = (
  offer: Offer,
  convertedPrice: IPrice | null,
  isModal: boolean
) => {
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
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
              {convertedPrice?.price} {offer.exchangeToken.symbol}
              <small>
                ({convertedPrice?.currency?.symbol} {convertedPrice?.converted})
              </small>
            </Typography>
          ) : (
            <Typography tag="p">
              {convertedPrice?.price} {offer.exchangeToken.symbol}
            </Typography>
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

const NOT_REDEEMED_YET = [
  subgraph.ExchangeState.Committed,
  subgraph.ExchangeState.Revoked,
  subgraph.ExchangeState.Cancelled,
  exchanges.ExtendedExchangeState.Expired,
  subgraph.ExchangeState.Completed
];

const DetailWidget: React.FC<IDetailWidget> = ({
  pageType,
  offer,
  exchange,
  name = "",
  image = "",
  hasSellerEnoughFunds,
  isPreview = false
}) => {
  const { showModal, modalTypes } = useModal();
  const { isLteXS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
    : null;

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
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

  const voucherRedeemableUntilDate = dayjs(
    Number(offer.voucherRedeemableUntilDate) * 1000
  );
  const nowDate = dayjs();

  const totalHours = voucherRedeemableUntilDate.diff(nowDate, "hours");
  const redeemableDays = Math.floor(totalHours / 24);
  const redeemableHours = totalHours - redeemableDays * 24;

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
  const handleCancel = () => {
    if (!exchange) {
      return;
    }
    showModal(modalTypes.CANCEL_EXCHANGE, {
      title: "Cancel exchange",
      exchange,
      BASE_MODAL_DATA
    });
  };
  return (
    <>
      <Widget>
        {isExchange && isToRedeem && (
          <RedeemLeftButton>
            {redeemableDays > 0
              ? `${redeemableDays} days left to Redeem`
              : `${redeemableHours} hours left to Redeem`}
          </RedeemLeftButton>
        )}
        <div>
          <WidgetUpperGrid
            style={{ paddingBottom: !isExchange || isLteXS ? "0.5rem" : "0" }}
          >
            <StyledPrice
              isExchange={isExchange}
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
                  isVoidedOffer ||
                  isPreview
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
                  setIsLoading(true);
                }}
                onSuccess={(_args, { exchangeId }) => {
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
                theme="secondary"
                size="large"
                disabled={
                  isChainUnsupported ||
                  isLoading ||
                  isOffer ||
                  isPreview ||
                  !isBuyer
                }
                onClick={() => {
                  showModal(
                    modalTypes.REDEEM,
                    {
                      title: "Redeem your item",
                      exchangeId: exchange?.id || "",
                      buyerId: exchange?.buyer.id || "",
                      sellerId: exchange?.seller.id || "",
                      sellerAddress: exchange?.seller.operator || ""
                    },
                    "s"
                  );
                }}
              >
                <span>Redeem</span>
                <Typography
                  tag="small"
                  $fontSize="0.75rem"
                  lineHeight="1.125rem"
                  fontWeight="600"
                  margin="0"
                >
                  Step 2/2
                </Typography>
              </RedeemButton>
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
        {isExchange && (
          <>
            <Break />
            <Grid as="section">
              <ContactSellerButton
                onClick={() =>
                  navigate({
                    pathname: `${BosonRoutes.Chat}/${exchange?.id || ""}`
                  })
                }
                theme="blank"
                style={{ fontSize: "0.875rem" }}
                disabled={isChainUnsupported || !isBuyer}
              >
                Contact seller
                <Question size={18} />
              </ContactSellerButton>
              {isBeforeRedeem ? (
                <>
                  {![
                    ExtendedExchangeState.Expired,
                    ExchangeState.Cancelled
                  ].includes(
                    exchangeStatus as ExtendedExchangeState | ExchangeState
                  ) && (
                    <StyledCancelButton
                      onClick={handleCancel}
                      theme="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={isChainUnsupported || !isBuyer}
                    >
                      Cancel
                      <Question size={18} />
                    </StyledCancelButton>
                  )}
                </>
              ) : (
                <>
                  {!exchange?.disputed && (
                    <RaiseProblemButton
                      onClick={() => {
                        showModal(modalTypes.RAISE_DISPUTE, {
                          title: "Raise a problem",
                          exchangeId: exchange?.id || ""
                        });
                      }}
                      theme="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={exchange?.state !== "REDEEMED" || !isBuyer}
                    >
                      Raise a problem
                      <Question size={18} />
                    </RaiseProblemButton>
                  )}
                </>
              )}
            </Grid>
          </>
        )}
      </Widget>
    </>
  );
};

export default DetailWidget;
