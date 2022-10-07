import {
  CommitButton,
  exchanges,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, ethers } from "ethers";
import { ArrowRight, ArrowSquareOut, Check, Question } from "phosphor-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useBalance, useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { titleCase } from "../../../lib/utils/formatText";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { getBuyerCancelPenalty } from "../../../lib/utils/getPrices";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getItemFromStorage } from "../../../lib/utils/hooks/useLocalStorage";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import { ModalTypes, ShowModalFn, useModal } from "../../modal/useModal";
import Price from "../../price/index";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
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
import DetailTopRightLabel from "./DetailTopRightLabel";
import { QuantityDisplay } from "./QuantityDisplay";

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
  isModal: boolean,
  modalTypes?: ModalTypes,
  showModal?: ShowModalFn
) => {
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
  ).format(CONFIG.dateFormat);

  const priceNumber = Number(convertedPrice?.converted);

  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(offer, convertedPrice);

  // if offer is in creation, offer.id does not exist
  const handleShowExchangePolicy = () => {
    const offerData = offer.id ? undefined : offer;
    if (modalTypes && showModal) {
      showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
        title: "Exchange Policy Details",
        offerId: offer.id,
        offerData
      });
    } else {
      console.error("modalTypes and/or showModal undefined");
    }
  };

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
      name: "Exchange policy",
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
      value: (
        <Typography tag="p">
          Fair Exchange Policy{" "}
          <ArrowSquareOut
            size={20}
            onClick={() => handleShowExchangePolicy()}
            style={{ cursor: "pointer" }}
          />
        </Typography>
      )
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
  const coreSDK = useCoreSDK();
  const { isLteXS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
    : null;

  const { data: dataBalance } = useBalance(
    offer.exchangeToken.address !== ethers.constants.AddressZero
      ? {
          addressOrName: address,
          token: offer.exchangeToken.address
        }
      : { addressOrName: address }
  );

  const {
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isBuyerInsufficientFunds = useMemo(
    () => dataBalance?.value.lt(BigNumber.from(offer.price)),
    [dataBalance, offer.price]
  );

  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const OFFER_DETAIL_DATA = useMemo(
    () =>
      getOfferDetailData(offer, convertedPrice, false, modalTypes, showModal),
    [offer, convertedPrice, modalTypes, showModal]
  );
  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () =>
      getOfferDetailData(offer, convertedPrice, true, modalTypes, showModal),
    [offer, convertedPrice, modalTypes, showModal]
  );

  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable || 0),
    [offer?.quantityAvailable]
  );

  const quantityInitial = useMemo<number>(
    () => Number(offer?.quantityInitial || 0),
    [offer?.quantityInitial]
  );

  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(getDateTimestamp(offer?.validUntilDate)).isBefore(dayjs()),
    [offer?.validUntilDate]
  );
  const isVoidedOffer = !!offer.voidedAt;

  const voucherRedeemableUntilDate = dayjs(
    getDateTimestamp(offer.voucherRedeemableUntilDate)
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

  const userCommittedOffers = useMemo(
    () => offer.exchanges?.filter((elem) => elem?.buyer?.id === buyerId),
    [offer, buyerId]
  );

  const isOfferEmpty = quantity < 1;
  const isOfferNotValidYet = dayjs(
    getDateTimestamp(offer?.validFromDate)
  ).isAfter(nowDate);

  const isNotCommittableOffer =
    (isOfferEmpty ||
      isOfferNotValidYet ||
      isExpiredOffer ||
      offer.voided ||
      !hasSellerEnoughFunds ||
      isBuyerInsufficientFunds) &&
    isOffer;

  const notCommittableOfferStatus = useMemo(() => {
    if (isBuyerInsufficientFunds) {
      return "Insufficient Funds";
    }
    if (offer.voided) {
      return "Offer voided";
    }
    if (isExpiredOffer) {
      return "Expired";
    }
    if (isOfferNotValidYet) {
      return "Invalid";
    }
    if (isOfferEmpty) {
      return "Offer empty";
    }
    if (!hasSellerEnoughFunds) {
      return "Invalid";
    }
    return "";
  }, [
    hasSellerEnoughFunds,
    isBuyerInsufficientFunds,
    isExpiredOffer,
    isOfferEmpty,
    isOfferNotValidYet,
    offer.voided
  ]);

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
          {isOffer && !!userCommittedOffers?.length && (
            <Grid
              alignItems="center"
              justifyContent="space-between"
              style={{ margin: "-1rem 0 1rem 0", cursor: "pointer" }}
              onClick={() =>
                navigate({
                  pathname: `${BosonRoutes.YourAccount}`
                })
              }
            >
              <Typography
                tag="p"
                style={{ color: colors.orange, margin: 0 }}
                $fontSize="0.75rem"
              >
                You already own {userCommittedOffers.length}{" "}
                {offer.metadata.name} rNFT
              </Typography>
              <ArrowRight size={18} color={colors.orange} />
            </Grid>
          )}
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
              withBosonStyles
            />

            {isOffer && !isNotCommittableOffer && (
              <QuantityDisplay
                quantityInitial={quantityInitial}
                quantity={quantity}
              />
            )}

            {isOffer && isNotCommittableOffer && (
              <DetailTopRightLabel>
                {notCommittableOfferStatus}
              </DetailTopRightLabel>
            )}
            {isOffer && (
              <CommitButton
                variant="primaryFill"
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
                envName={CONFIG.envName}
                onError={(error) => {
                  console.error("onError", error);
                  setIsLoading(false);
                  const hasUserRejectedTx =
                    "code" in error &&
                    (error as unknown as { code: string }).code ===
                      "ACTION_REJECTED";
                  if (hasUserRejectedTx) {
                    showModal("CONFIRMATION_FAILED");
                  } else {
                    showModal(modalTypes.DETAIL_WIDGET, {
                      title: "An error occurred",
                      message: "An error occurred when trying to commit!",
                      type: "ERROR",
                      state: "Committed",
                      ...BASE_MODAL_DATA
                    });
                  }
                }}
                onPendingSignature={() => {
                  setIsLoading(true);
                  showModal("WAITING_FOR_CONFIRMATION");
                }}
                onPendingTransaction={(hash) => {
                  showModal("TRANSACTION_SUBMITTED", {
                    action: "Commit",
                    txHash: hash
                  });
                }}
                onSuccess={async (_, { exchangeId }) => {
                  let createdExchange: subgraph.ExchangeFieldsFragment;
                  await poll(
                    async () => {
                      createdExchange = await coreSDK.getExchangeById(
                        exchangeId
                      );
                      return createdExchange;
                    },
                    (createdExchange) => {
                      return !createdExchange;
                    },
                    500
                  );
                  setIsLoading(false);
                  toast((t) => (
                    <SuccessTransactionToast
                      t={t}
                      action={`Commit to offer: ${offer.metadata.name}`}
                      onViewDetails={() => {
                        showModal(modalTypes.DETAIL_WIDGET, {
                          title: "You have successfully committed!",
                          message: "You now own the rNFT",
                          type: "SUCCESS",
                          id: exchangeId.toString(),
                          state: "Committed",
                          ...BASE_MODAL_DATA
                        });
                      }}
                    />
                  ));
                }}
                extraInfo="Step 1/2"
                web3Provider={signer?.provider as Provider}
              />
            )}
            {isToRedeem && (
              <RedeemButton
                theme="bosonPrimary"
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
                      offerName: offer.metadata.name,
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
          <DetailTable
            align
            noBorder
            data={OFFER_DETAIL_DATA}
            inheritColor={false}
          />
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
                    exchanges.ExtendedExchangeState.Expired,
                    subgraph.ExchangeState.Cancelled
                  ].includes(
                    exchangeStatus as
                      | exchanges.ExtendedExchangeState
                      | subgraph.ExchangeState
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
