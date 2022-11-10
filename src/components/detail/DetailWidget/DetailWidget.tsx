import {
  ButtonSize,
  CommitButton,
  exchanges,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import {
  BigNumber,
  BigNumberish,
  constants,
  ContractTransaction,
  ethers
} from "ethers";
import { ArrowRight, ArrowSquareOut, Check, Question } from "phosphor-react";
import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount, useBalance, useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { isTruthy } from "../../../lib/types/helpers";
import { Offer } from "../../../lib/types/offer";
import { calcPercentage, displayFloat } from "../../../lib/utils/calcPrice";
import { IPrice } from "../../../lib/utils/convertPrice";
import { titleCase } from "../../../lib/utils/formatText";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
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

interface IDetailWidget {
  pageType?: "exchange" | "offer";
  offer: Offer;
  exchange?: Exchange;
  name?: string;
  image?: string;
  hasSellerEnoughFunds: boolean;
  isPreview?: boolean;
  reload?: () => void;
  hasMultipleVariants?: boolean;
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

  const { deposit, formatted } = calcPercentage(offer, "buyerCancelPenalty");
  const { deposit: sellerDeposit, formatted: sellerFormatted } = calcPercentage(
    offer,
    "sellerDeposit"
  );

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
              {displayFloat(convertedPrice?.price)} {offer.exchangeToken.symbol}
              <small>
                ({convertedPrice?.currency?.symbol}{" "}
                {displayFloat(convertedPrice?.converted)})
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
  isPreview = false,
  hasMultipleVariants,
  reload
}) => {
  const { openConnectModal } = useConnectModal();
  const [
    isCommittingFromNotConnectedWallet,
    setIsCommittingFromNotConnectedWallet
  ] = useState(false);
  const { showModal, hideModal, modalTypes } = useModal();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
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

  const isExchangeExpired =
    exchangeStatus &&
    [exchanges.ExtendedExchangeState.Expired].includes(
      exchangeStatus as unknown as exchanges.ExtendedExchangeState
    );

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
  const sellerCurationList = useCustomStoreQueryParameter("sellerCurationList");
  const offerCurationList = useCustomStoreQueryParameter("offerCurationList");
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
    isBuyerInsufficientFunds;
  const onCommitPendingSignature = () => {
    setIsLoading(true);
    showModal("WAITING_FOR_CONFIRMATION");
  };
  const onCommitPendingTransaction = (
    hash: string,
    isMetaTx?: boolean | undefined
  ) => {
    showModal("TRANSACTION_SUBMITTED", {
      action: "Commit",
      txHash: hash
    });
    addPendingTransaction({
      type: subgraph.EventType.BuyerCommitted,
      hash,
      isMetaTx,
      accountType: "Buyer",
      offer: {
        id: offer.id
      }
    });
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
  };
  const onCommitError = (error: Error) => {
    console.error("onError", error);
    setIsLoading(false);
    const hasUserRejectedTx =
      "code" in error &&
      (error as unknown as { code: string }).code === "ACTION_REJECTED";
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
  };
  const CommitProxyButton = () => {
    const disabled =
      !signer ||
      !offer.condition ||
      !commitProxyAddress ||
      !bosonSnapshotGateAbi.abi ||
      isCommitDisabled;
    const onClick = async () => {
      if (
        !signer ||
        !offer.condition ||
        !commitProxyAddress ||
        !bosonSnapshotGateAbi.abi ||
        isCommitDisabled
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
          offer.condition.tokenId,
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
                    disabled={isCommitDisabled}
                    offerId={offer.id}
                    exchangeToken={offer.exchangeToken.address}
                    price={offer.price}
                    envName={CONFIG.envName}
                    onError={onCommitError}
                    onPendingSignature={onCommitPendingSignature}
                    onPendingTransaction={onCommitPendingTransaction}
                    onSuccess={onCommitSuccess}
                    extraInfo="Step 1/2"
                    web3Provider={signer?.provider as Provider}
                    metaTx={CONFIG.metaTx}
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
                onClick={() => {
                  showModal(
                    modalTypes.REDEEM,
                    {
                      title: "Redeem your item",
                      offerName: offer.metadata.name,
                      offerId: offer.id,
                      exchangeId: exchange?.id || "",
                      buyerId: exchange?.buyer.id || "",
                      sellerId: exchange?.seller.id || "",
                      sellerAddress: exchange?.seller.operator || "",
                      setIsLoading: setIsLoading,
                      reload
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
