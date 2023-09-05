import {
  ButtonSize,
  CommitButton,
  exchanges,
  offers,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import dayjs from "dayjs";
import {
  BigNumber,
  BigNumberish,
  constants,
  ContractTransaction,
  ethers
} from "ethers";
import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  CircleWavyQuestion,
  Question,
  WarningCircle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useBalance } from "wagmi";

import { ReactComponent as Logo } from "../../../assets/logo-white.svg";
import { CONFIG } from "../../../lib/config";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { isTruthy } from "../../../lib/types/helpers";
import { Offer } from "../../../lib/types/offer";
import { calcPercentage, displayFloat } from "../../../lib/utils/calcPrice";
import { IPrice } from "../../../lib/utils/convertPrice";
import { getHasExchangeDisputeResolutionElapsed } from "../../../lib/utils/exchange";
import { titleCase } from "../../../lib/utils/formatText";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useEthersSigner } from "../../../lib/utils/hooks/ethers/useEthersSigner";
import useCheckTokenGatedOffer from "../../../lib/utils/hooks/offer/useCheckTokenGatedOffer";
import {
  useAddPendingTransaction,
  useRemovePendingTransaction
} from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  getItemFromStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { ModalTypes, ShowModalFn, useModal } from "../../modal/useModal";
import Price from "../../price/index";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import BosonButton from "../../ui/BosonButton";
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
import bosonSnapshotGateAbi from "./BosonSnapshotGate/BosonSnapshotGate.json";
import { BosonSnapshotGate__factory } from "./BosonSnapshotGate/typechain/factories";
import { DetailDisputeResolver } from "./DetailDisputeResolver";
import DetailTopRightLabel from "./DetailTopRightLabel";
import { QuantityDisplay } from "./QuantityDisplay";
import TokenGated from "./TokenGated";

const StyledPrice = styled(Price)`
  h3 {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;
const CommitButtonWrapper = styled.div<{ pointerEvents: string }>`
  width: 100%;
  > button {
    width: 100%;
    pointer-events: ${({ pointerEvents }) => pointerEvents};
  }
`;

const RedeemButton = styled(BosonButton)`
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

const BlackLogo = styled(Logo)`
  width: 6.25rem;
  height: fit-content;
  padding: 1.2rem 0 0 0;
  :first-child {
    path:first-child {
      fill: ${colors.black};
    }
  }
`;

type ActionName = "approveExchangeToken" | "depositFunds" | "commit";
interface IDetailWidget {
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: Exchange;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  hasMultipleVariants?: boolean;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export const getOfferDetailData = (
  offer: Offer,
  convertedPrice: IPrice | null,
  isModal: boolean,
  modalTypes?: ModalTypes,
  showModal?: ShowModalFn,
  isExchange?: boolean,
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult
) => {
  const redeemableFromDayJs = dayjs(
    Number(`${offer.voucherRedeemableFromDate}000`)
  );
  const redeemableFrom = redeemableFromDayJs.format(CONFIG.dateFormat);
  const redeemableUntil = dayjs(
    Number(`${offer.voucherRedeemableUntilDate}000`)
  ).format(CONFIG.dateFormat);

  const { deposit, formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { deposit: sellerDeposit, formatted: sellerFormatted } = calcPercentage(
    offer,
    "sellerDeposit"
  );

  const exchangePolicyLabel = (
    (offer.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.label || "Unspecified"
  ).replace("fairExchangePolicy", "Fair Exchange Policy");

  // if offer is in creation, offer.id does not exist
  const handleShowExchangePolicy = () => {
    if (modalTypes && showModal) {
      showModal(modalTypes.EXCHANGE_POLICY_DETAILS, {
        title: "Exchange Policy Details",
        offerId: offer.id,
        offerData: offer,
        exchangePolicyCheckResult
      });
    } else {
      console.error("modalTypes and/or showModal undefined");
    }
  };
  const redeemableFromValues =
    isExchange &&
    offer.voucherRedeemableFromDate &&
    redeemableFromDayJs.isAfter(Date.now())
      ? [
          {
            name: "Redeemable from",
            info: (
              <>
                <Typography tag="h6">
                  <b>Redeemable</b>
                </Typography>
                <Typography tag="p">
                  If you don’t redeem your NFT during the redemption period, it
                  will expire and you will receive back the price minus the
                  Buyer cancel penalty
                </Typography>
              </>
            ),
            value: <Typography tag="p">{redeemableFrom}</Typography>
          }
        ]
      : [];
  return [
    ...redeemableFromValues,
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
              {displayFloat(convertedPrice?.price)} {offer.exchangeToken.symbol}
              <small>
                ({convertedPrice?.currency?.symbol}{" "}
                {displayFloat(convertedPrice?.converted, { fixed: 2 })})
              </small>
            </Typography>
          ) : (
            <Typography tag="p">
              {displayFloat(convertedPrice?.price)} {offer.exchangeToken.symbol}
            </Typography>
          )
        }
      : { hide: true },
    {
      name: "Seller deposit",
      info: (
        <>
          <Typography tag="h6">
            <b>Seller deposit</b>
          </Typography>
          <Typography tag="p">
            The Seller deposit is used to hold the seller accountable to follow
            through with their commitment to deliver the physical item. If the
            seller breaks their commitment, the deposit will be transferred to
            the buyer.
          </Typography>
        </>
      ),
      value: (
        <Typography tag="p">
          {sellerFormatted} {offer.exchangeToken.symbol}
          {sellerDeposit !== "0" ? <small>({sellerDeposit}%)</small> : ""}
        </Typography>
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
          {formatted} {offer.exchangeToken.symbol}
          {deposit !== "0" ? <small>({deposit}%)</small> : ""}
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
      value: exchangePolicyCheckResult ? (
        exchangePolicyCheckResult.isValid ? (
          <Typography tag="p">
            {exchangePolicyLabel + " "}
            {modalTypes && showModal && (
              <ArrowSquareOut
                size={20}
                onClick={() => handleShowExchangePolicy()}
                style={{ cursor: "pointer" }}
              />
            )}
          </Typography>
        ) : (
          <Typography tag="p" color={colors.orange}>
            <WarningCircle size={20}></WarningCircle> Non-standard{" "}
            {modalTypes && showModal && (
              <ArrowSquareOut
                size={20}
                onClick={() => handleShowExchangePolicy()}
                style={{ cursor: "pointer" }}
              />
            )}
          </Typography>
        )
      ) : (
        <Typography tag="p" color="purple">
          <CircleWavyQuestion size={20}></CircleWavyQuestion> Unknown{" "}
          {modalTypes && showModal && (
            <ArrowSquareOut
              size={20}
              onClick={() => handleShowExchangePolicy()}
              style={{ cursor: "pointer" }}
            />
          )}
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
  subgraph.ExchangeState.Completed,
  exchanges.ExtendedExchangeState.NotRedeemableYet
];

const DetailWidget: React.FC<IDetailWidget> = ({
  pageType,
  offer,
  exchange,
  name = "",
  image = "",
  hasSellerEnoughFunds,
  isPreview = false,
  hasMultipleVariants,
  exchangePolicyCheckResult
}) => {
  const [commitType, setCommitType] = useState<ActionName | undefined | null>(
    null
  );
  const { openConnectModal } = useConnectModal();
  const [
    isCommittingFromNotConnectedWallet,
    setIsCommittingFromNotConnectedWallet
  ] = useState(false);
  const { showModal, hideModal, modalTypes } = useModal();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const removePendingTransaction = useRemovePendingTransaction();
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");

  const { isLteXS } = useBreakpoints();
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();
  const isSeller = exchange?.seller.assistant === address?.toLowerCase();
  const isOffer = pageType === "offer";
  const isExchange = pageType === "exchange";
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
    : null;

  const disabledRedeemText =
    exchangeStatus === exchanges.ExtendedExchangeState.NotRedeemableYet
      ? "Redeem"
      : titleCase(exchangeStatus || "Unsupported");

  const { data: dataBalance } = useBalance(
    offer.exchangeToken.address !== ethers.constants.AddressZero
      ? {
          address: address,
          token: offer.exchangeToken.address as `0x${string}`
        }
      : { address: address }
  );

  const {
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");

  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const isBeforeRedeem =
    !exchangeStatus || NOT_REDEEMED_YET.includes(exchangeStatus);

  const hasDisputePeriodElapsed: boolean =
    getHasExchangeDisputeResolutionElapsed(exchange, offer);

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );

  const signer = useEthersSigner();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isBuyerInsufficientFunds: boolean = useMemo(
    () => !!dataBalance?.value && dataBalance?.value < BigInt(offer.price),
    [dataBalance, offer.price]
  );

  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const OFFER_DETAIL_DATA = useMemo(
    () =>
      getOfferDetailData(
        offer,
        convertedPrice,
        false,
        modalTypes,
        showModal,
        isExchange,
        exchangePolicyCheckResult
      ),
    [
      offer,
      convertedPrice,
      modalTypes,
      showModal,
      isExchange,
      exchangePolicyCheckResult
    ]
  );
  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () =>
      getOfferDetailData(
        offer,
        convertedPrice,
        true,
        modalTypes,
        showModal,
        isExchange,
        exchangePolicyCheckResult
      ),
    [
      offer,
      convertedPrice,
      modalTypes,
      showModal,
      isExchange,
      exchangePolicyCheckResult
    ]
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
      animationUrl: offer.metadata.animationUrl || "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      exchange: exchange!,
      image,
      name
    }),
    [
      OFFER_DETAIL_DATA_MODAL,
      exchange,
      image,
      name,
      offer.metadata.animationUrl
    ]
  );

  const handleOnGetSignerAddress = useCallback(
    (signerAddress: string | undefined) => {
      const isConnectWalletFromCommit = getItemFromStorage(
        "isConnectWalletFromCommit",
        false
      );
      if (
        isCommittingFromNotConnectedWallet &&
        address &&
        !isChainUnsupported &&
        signerAddress &&
        isConnectWalletFromCommit
      ) {
        const commitButton = commitButtonRef.current;
        if (commitButton) {
          commitButton.click();
          setIsCommittingFromNotConnectedWallet(false);
        }
      }
      return signerAddress;
    },
    [address, isChainUnsupported, isCommittingFromNotConnectedWallet]
  );

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

  const commitButtonRef = useRef<HTMLButtonElement>(null);

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
      return "Sale starting soon™️";
    }
    if (isOfferEmpty) {
      return "Sold out";
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
  const commitProxyAddress = useCustomStoreQueryParameter("commitProxyAddress");
  const openseaLinkToOriginalMainnetCollection = useCustomStoreQueryParameter(
    "openseaLinkToOriginalMainnetCollection"
  );
  const sellerCurationList = useCustomStoreQueryParameter("sellerCurationList");
  const offerCurationList = useCustomStoreQueryParameter("offerCurationList");
  const { isConditionMet } = useCheckTokenGatedOffer({
    commitProxyAddress,
    condition: offer.condition
  });
  const numSellers = new Set(
    sellerCurationList
      .split(",")
      .map((str) => str.trim())
      .filter(isTruthy)
  ).size;
  const numOffers = new Set(
    offerCurationList
      .split(",")
      .map((str) => str.trim())
      .filter(isTruthy)
  ).size;
  const showCommitProxyButton =
    ((numSellers === 1 && numOffers === 0) ||
      (numSellers === 0 && numOffers === 1)) &&
    !!commitProxyAddress;
  const isCommitDisabled =
    (address && isChainUnsupported) ||
    !hasSellerEnoughFunds ||
    isExpiredOffer ||
    isLoading ||
    !quantity ||
    isVoidedOffer ||
    isPreview ||
    isOfferNotValidYet ||
    isBuyerInsufficientFunds ||
    (offer.condition && !isConditionMet);
  const onCommitPendingSignature = () => {
    setIsLoading(true);
    showModal("WAITING_FOR_CONFIRMATION");
  };
  const onCommitPendingTransaction = (
    hash: string,
    isMetaTx?: boolean | undefined,
    actionName?: ActionName | undefined
  ) => {
    setCommitType(actionName);
    if (actionName && actionName === "approveExchangeToken") {
      showModal("TRANSACTION_SUBMITTED", {
        action: "Approve ERC20 Token",
        txHash: hash
      });
    } else {
      showModal("TRANSACTION_SUBMITTED", {
        action: "Commit",
        txHash: hash
      });
      addPendingTransaction({
        type: subgraph.EventType.BuyerCommitted,
        hash,
        isMetaTx,
        accountType: "Buyer",
        offerId: offer.id,
        offer: {
          id: offer.id
        }
      });
    }
  };
  const onCommitSuccess = async (
    _receipt: ethers.providers.TransactionReceipt,
    { exchangeId }: { exchangeId: BigNumberish }
  ) => {
    let createdExchange: subgraph.ExchangeFieldsFragment;
    await poll(
      async () => {
        createdExchange = await coreSDK.getExchangeById(exchangeId);
        return createdExchange;
      },
      (createdExchange) => {
        return !createdExchange;
      },
      500
    );
    setIsLoading(false);
    hideModal();
    if (commitType === "approveExchangeToken") {
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={"Token approval transaction submitted"}
        />
      ));
    } else {
      const showDetailWidgetModal = () => {
        showModal(modalTypes.DETAIL_WIDGET, {
          title: "You have successfully committed!",
          message: "You now own the rNFT",
          type: "SUCCESS",
          id: exchangeId.toString(),
          state: "Committed",
          ...BASE_MODAL_DATA
        });
      };
      showDetailWidgetModal();
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={`Commit to offer: ${offer.metadata.name}`}
          onViewDetails={() => {
            showDetailWidgetModal();
          }}
        />
      ));
    }
    setCommitType(null);
    removePendingTransaction("offerId", offer.id);
  };
  const onCommitError = (error: Error) => {
    console.error("onError", error);
    setIsLoading(false);
    const hasUserRejectedTx =
      "code" in error &&
      (error as unknown as { code: string }).code === "ACTION_REJECTED";
    if (hasUserRejectedTx) {
      showModal("TRANSACTION_FAILED");
    } else {
      Sentry.captureException(error);
      showModal(modalTypes.DETAIL_WIDGET, {
        title: "An error occurred",
        message: "An error occurred when trying to commit!",
        type: "ERROR",
        state: "Committed",
        ...BASE_MODAL_DATA
      });
    }
    setCommitType(null);
    removePendingTransaction("offerId", offer.id);
  };
  const CommitProxyButton = () => {
    const disabled =
      !signer ||
      !offer.condition ||
      !commitProxyAddress ||
      !bosonSnapshotGateAbi.abi ||
      isCommitDisabled ||
      (offer.condition && !isConditionMet);
    const onClick = async () => {
      if (
        !signer ||
        !offer.condition ||
        !commitProxyAddress ||
        !bosonSnapshotGateAbi.abi ||
        isCommitDisabled ||
        (offer.condition && !isConditionMet)
      ) {
        return;
      }
      try {
        onCommitPendingSignature();
        const proxyContract = BosonSnapshotGate__factory.connect(
          commitProxyAddress,
          signer
        );

        if (offer.exchangeToken.address !== constants.AddressZero) {
          const allowance = await coreSDK.getExchangeTokenAllowance(
            offer.exchangeToken.address,
            {
              spender: commitProxyAddress
            }
          );

          if (BigNumber.from(allowance).lt(offer.price)) {
            const tx = await coreSDK.approveExchangeToken(
              offer.exchangeToken.address,
              constants.MaxInt256,
              {
                spender: commitProxyAddress
              }
            );
            await tx.wait();
          }
        }

        const buyerAddress = await signer.getAddress();

        const tx: ContractTransaction = await proxyContract.commitToGatedOffer(
          buyerAddress,
          offer.id,
          offer.condition.minTokenId,
          {
            value:
              offer.exchangeToken.address === constants.AddressZero
                ? offer.price
                : "0"
          }
        );
        onCommitPendingTransaction(tx.hash, false);
        const receipt = await tx.wait();
        const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(
          receipt.logs
        ) as string;
        onCommitSuccess(receipt, { exchangeId });
      } catch (error) {
        onCommitError(error as Error);
      }
    };
    return (
      <BosonButton
        variant="primaryFill"
        onClick={onClick}
        disabled={disabled}
        data-commit-proxy-address
        style={{ height: "3.5rem" }}
      >
        Commit <small>Step 1/2</small>
      </BosonButton>
    );
  };

  useEffect(() => {
    if (isExchange) {
      // Reload the widget script after rendering the component
      console.log(
        "call window.bosonWidgetReload() from DetailWidget component"
      );
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.bosonWidgetReload();
      } catch (e) {
        console.error(e);
        Sentry.captureException(e);
      }
    }
  }, [isExchange, exchange]);

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
          {isOffer && address && !!userCommittedOffers?.length && (
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
          {isExchange && isExchangeExpired && (
            <Grid
              alignItems="center"
              justifyContent="space-between"
              style={{ margin: "-1rem 0 1rem 0", cursor: "pointer" }}
              onClick={() => {
                if (exchange) {
                  showModal(
                    modalTypes.EXPIRE_VOUCHER_MODAL,
                    {
                      title: "Expire Voucher",
                      exchange
                    },
                    "auto"
                  );
                }
              }}
            >
              <Typography
                tag="p"
                style={{ color: colors.darkGrey, margin: 0 }}
                $fontSize="0.75rem"
              >
                You can withdraw your funds here
              </Typography>
              <ArrowRight size={18} color={colors.darkGrey} />
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
              withAsterisk={isPreview && hasMultipleVariants}
            />

            {isOffer && !isNotCommittableOffer && (
              <QuantityDisplay
                quantityInitial={quantityInitial}
                quantity={quantity}
              />
            )}

            {isOffer && isNotCommittableOffer && (
              <DetailTopRightLabel>
                {!isPreview && notCommittableOfferStatus}
              </DetailTopRightLabel>
            )}
            {isOffer && (
              <CommitButtonWrapper
                role="button"
                pointerEvents={!address && openConnectModal ? "none" : "all"}
                onClick={() => {
                  if (!address && openConnectModal) {
                    saveItemInStorage("isConnectWalletFromCommit", true);
                    setIsCommittingFromNotConnectedWallet(true);
                    openConnectModal();
                  }
                }}
              >
                {showCommitProxyButton ? (
                  <CommitProxyButton />
                ) : (
                  <CommitButton
                    variant="primaryFill"
                    isPauseCommitting={!address}
                    buttonRef={commitButtonRef}
                    onGetSignerAddress={handleOnGetSignerAddress}
                    disabled={!!isCommitDisabled}
                    offerId={offer.id}
                    exchangeToken={offer.exchangeToken.address}
                    price={offer.price}
                    coreSdkConfig={{
                      envName: CONFIG.envName,
                      configId: CONFIG.configId,
                      web3Provider: signer?.provider as Provider,
                      metaTx: CONFIG.metaTx
                    }}
                    onError={onCommitError}
                    onPendingSignature={onCommitPendingSignature}
                    onPendingTransaction={onCommitPendingTransaction}
                    onSuccess={onCommitSuccess}
                    extraInfo="Step 1/2"
                  />
                )}
              </CommitButtonWrapper>
            )}
            {isToRedeem && (
              <RedeemButton
                variant="primaryFill"
                size={ButtonSize.Large}
                disabled={
                  isChainUnsupported ||
                  isLoading ||
                  isOffer ||
                  isPreview ||
                  !isBuyer
                }
                id="boson-redeem-redeem"
                data-exchange-id={exchange?.id}
                data-bypass-mode="REDEEM"
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
                {disabledRedeemText}
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
        {offer.condition && (
          <TokenGated
            offer={offer}
            commitProxyAddress={commitProxyAddress}
            openseaLinkToOriginalMainnetCollection={
              openseaLinkToOriginalMainnetCollection
            }
            isConditionMet={isConditionMet}
          />
        )}
        <div style={{ paddingTop: "2rem" }}>
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
                disabled={isChainUnsupported || (!isBuyer && !isSeller)}
              >
                Contact seller
                <Question size={18} />
              </ContactSellerButton>
              {isBeforeRedeem ? (
                <>
                  {![
                    exchanges.ExtendedExchangeState.Expired,
                    subgraph.ExchangeState.Cancelled,
                    subgraph.ExchangeState.Revoked,
                    subgraph.ExchangeState.Completed
                  ].includes(
                    exchangeStatus as
                      | exchanges.ExtendedExchangeState
                      | subgraph.ExchangeState
                  ) && (
                    <StyledCancelButton
                      theme="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={isChainUnsupported || !isBuyer}
                      id="boson-redeem-cancel"
                      data-exchange-id={exchange?.id}
                      data-bypass-mode="CANCEL"
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
                        showModal(
                          modalTypes.RAISE_DISPUTE,
                          {
                            title: "Raise a dispute",
                            exchangeId: exchange?.id || ""
                          },
                          "auto",
                          undefined,
                          { m: "1000px" }
                        );
                      }}
                      theme="blank"
                      style={{ fontSize: "0.875rem" }}
                      disabled={
                        exchange?.state !== "REDEEMED" ||
                        !isBuyer ||
                        hasDisputePeriodElapsed
                      }
                    >
                      Raise a dispute
                      <Question size={18} />
                    </RaiseProblemButton>
                  )}
                </>
              )}
            </Grid>
          </>
        )}
        {isCustomStoreFront && (
          <Grid justifyContent="center" alignItems="center">
            <BlackLogo />
          </Grid>
        )}
      </Widget>
    </>
  );
};

export default DetailWidget;
