import {
  CommitButton,
  ExternalDetailView,
  extractUserFriendlyError,
  getHasUserRejectedTx,
  Provider,
  RedeemButton,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { useAccountDrawer } from "components/header/accountDrawer";
import { Spinner } from "components/loading/Spinner";
import { MODAL_TYPES } from "components/modal/ModalComponents";
import { useModal } from "components/modal/useModal";
import { useConvertedPrice } from "components/price/useConvertedPrice";
import SuccessTransactionToast from "components/toasts/SuccessTransactionToast";
import BosonButton from "components/ui/BosonButton";
import Button from "components/ui/Button";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import dayjs from "dayjs";
import {
  BigNumber,
  BigNumberish,
  constants,
  ContractTransaction,
  ethers,
  providers
} from "ethers";
import { CONFIG } from "lib/config";
import { isTruthy } from "lib/types/helpers";
import { getDateTimestamp } from "lib/utils/getDateTimestamp";
import { useAccount, useSigner } from "lib/utils/hooks/connection/connection";
import {
  getItemFromStorage,
  saveItemInStorage
} from "lib/utils/hooks/localstorage/useLocalStorage";
import useCheckExchangePolicy from "lib/utils/hooks/offer/useCheckExchangePolicy";
import useCheckTokenGatedOffer from "lib/utils/hooks/offer/useCheckTokenGatedOffer";
import { useExchangeTokenBalance } from "lib/utils/hooks/offer/useExchangeTokenBalance";
import {
  useAddPendingTransaction,
  useRemovePendingTransaction
} from "lib/utils/hooks/transactions/usePendingTransactions";
import { useSellers } from "lib/utils/hooks/useSellers";
import { poll } from "lib/utils/promises";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import { useCustomStoreQueryParameter } from "pages/custom-store/useCustomStoreQueryParameter";
import { VariantV1 } from "pages/products/types";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import styled from "styled-components";

import bosonSnapshotGateAbi from "./BosonSnapshotGate/BosonSnapshotGate.json";
import { BosonSnapshotGate__factory } from "./BosonSnapshotGate/typechain/factories";
import { getOfferDetailData } from "./DetailWidget";
const StyledRedeemButton = styled(RedeemButton)`
  width: 100%;
`;
const containerBreakpoint = "400px";
const CTAsGrid = styled(Grid)`
  .show-in-larger-view {
    display: none;
  }
  .show-in-smaller-view {
    display: block;
  }
  @container (width > ${containerBreakpoint}) {
    .show-in-larger-view {
      display: block;
    }
    .show-in-smaller-view {
      display: none;
    }
  }
`;

const CommitWrapper = styled(Grid)`
  flex-direction: column;
  row-gap: 0.5rem;
  column-gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  @container (width > ${containerBreakpoint}) {
    flex-direction: row;
    > * {
      flex: 1 1 50%;
    }
  }
`;
const CommitButtonWrapper = styled.div<{ $pointerEvents: string }>`
  width: 100%;
  cursor: pointer;
  > button {
    width: 100%;
    pointer-events: ${({ $pointerEvents }) => $pointerEvents};
  }
`;

type CommitDetailWidgetProps = {
  selectedVariant: VariantV1;
  isPreview: boolean;
  name?: string;
  image?: string;
};
type ActionName = "approveExchangeToken" | "depositFunds" | "commit";

export const CommitDetailWidget: React.FC<CommitDetailWidgetProps> = ({
  selectedVariant,
  isPreview,
  name = "",
  image = ""
}) => {
  const { offer } = selectedVariant;
  const [commitType, setCommitType] = useState<ActionName | undefined | null>(
    null
  );
  const { config } = useConfigContext();
  const { account: address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const coreSDK = useCoreSDK();
  const { showModal, hideModal } = useModal();
  const addPendingTransaction = useAddPendingTransaction();
  const removePendingTransaction = useRemovePendingTransaction();
  const [, openConnectModal] = useAccountDrawer();
  const sellerCurationList = useCustomStoreQueryParameter("sellerCurationList");
  const offerCurationList = useCustomStoreQueryParameter("offerCurationList");
  const [
    isCommittingFromNotConnectedWallet,
    setIsCommittingFromNotConnectedWallet
  ] = useState(false);
  const signer = useSigner();
  const { balance: exchangeTokenBalance, loading: balanceLoading } =
    useExchangeTokenBalance(offer.exchangeToken, {
      enabled: offer.price !== "0"
    });
  const commitButtonRef = useRef<HTMLButtonElement>(null);

  const isCustomStoreFront =
    useCustomStoreQueryParameter("isCustomStoreFront") === "true";
  const commitProxyAddress = useCustomStoreQueryParameter("commitProxyAddress");
  const { isConditionMet } = useCheckTokenGatedOffer({
    commitProxyAddress,
    offer
  });
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
      let txResponse: providers.TransactionResponse | undefined = undefined;
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
        txResponse = tx;
        onCommitPendingTransaction(tx.hash, false);
        const receipt = await tx.wait();
        const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(
          receipt.logs
        ) as string;
        onCommitSuccess(receipt, { exchangeId });
      } catch (error) {
        onCommitError(error as Error, { txResponse });
      }
    };
    return (
      <BosonButton
        variant="primaryFill"
        onClick={onClick}
        disabled={disabled}
        data-commit-proxy-address
        style={{ height: "3.5rem" }}
        withBosonStyle
      >
        Commit <small>Step 1/2</small>
      </BosonButton>
    );
  };
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
  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: offer.id
  });
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  const OFFER_DETAIL_DATA_MODAL = useMemo(
    () =>
      getOfferDetailData(
        offer,
        undefined,
        convertedPrice,
        true,
        MODAL_TYPES,
        showModal,
        false,
        exchangePolicyCheckResult
      ),
    [offer, convertedPrice, showModal, exchangePolicyCheckResult]
  );
  const { data: sellers } = useSellers(
    {
      id: offer?.seller.id,
      includeFunds: true
    },
    {
      enabled: !!offer?.seller.id
    }
  );
  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(offer?.sellerDeposit || 0);
  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;
  const quantity = useMemo<number>(
    () => Number(offer?.quantityAvailable || 0),
    [offer?.quantityAvailable]
  );
  const isExpiredOffer = useMemo<boolean>(
    () => dayjs(getDateTimestamp(offer?.validUntilDate)).isBefore(dayjs()),
    [offer?.validUntilDate]
  );
  const isVoidedOffer = !!offer.voidedAt;
  const isBuyerInsufficientFunds: boolean = useMemo(
    () => !!exchangeTokenBalance && exchangeTokenBalance.lessThan(offer.price),
    [exchangeTokenBalance, offer.price]
  );
  const nowDate = dayjs();
  const isOfferNotValidYet = dayjs(
    getDateTimestamp(offer?.validFromDate)
  ).isAfter(nowDate);
  const isCommitDisabled =
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
  const BASE_MODAL_DATA = useMemo(
    () => ({
      data: OFFER_DETAIL_DATA_MODAL,
      animationUrl: offer.metadata.animationUrl || "",
      image,
      name
    }),
    [OFFER_DETAIL_DATA_MODAL, image, name, offer.metadata.animationUrl]
  );
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
        showModal(MODAL_TYPES.DETAIL_WIDGET, {
          title: "You have successfully committed!",
          message: "You now own the rNFT",
          type: "SUCCESS",
          id: exchangeId.toString(),
          state: "Committed",
          ...BASE_MODAL_DATA,
          exchange: createdExchange
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
  const onCommitError = async (
    error: Error,
    { txResponse }: { txResponse: providers.TransactionResponse | undefined }
  ) => {
    console.error("onError", error);
    setIsLoading(false);
    const hasUserRejectedTx = getHasUserRejectedTx(error);
    if (hasUserRejectedTx) {
      showModal("TRANSACTION_FAILED");
    } else {
      Sentry.captureException(error);
      showModal(MODAL_TYPES.DETAIL_WIDGET, {
        title: "An error occurred",
        message: await extractUserFriendlyError(error, {
          txResponse,
          provider: signer?.provider
        }),
        type: "ERROR",
        state: "Committed",
        ...BASE_MODAL_DATA
      });
    }
    setCommitType(null);
    removePendingTransaction("offerId", offer.id);
  };
  const handleOnGetSignerAddress = useCallback(
    (signerAddress: string | undefined) => {
      const isConnectWalletFromCommit = getItemFromStorage(
        "isConnectWalletFromCommit",
        false
      );
      if (
        isCommittingFromNotConnectedWallet &&
        address &&
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
    [address, isCommittingFromNotConnectedWallet]
  );
  const onClickrNFTTerms = () => {
    showModal("REDEEMABLE_NFT_TERMS", {
      offerData: offer.id ? undefined : offer,
      offerId: offer.id ? offer.id : undefined
    });
  };
  return (
    <ExternalDetailView
      providerProps={{
        ...CONFIG,
        envName: config.envName,
        configId: config.envConfig.configId,
        walletConnectProjectId: CONFIG.walletConnect.projectId,
        defaultCurrencySymbol: CONFIG.defaultCurrency.symbol,
        defaultCurrencyTicker: CONFIG.defaultCurrency.ticker,
        licenseTemplate: CONFIG.rNFTLicenseTemplate,
        minimumDisputeResolutionPeriodDays: CONFIG.minimumReturnPeriodInDays,
        contactSellerForExchangeUrl: ""
      }}
      selectedVariant={selectedVariant}
      hasMultipleVariants={false}
      isPreview={false}
      showBosonLogo={isCustomStoreFront}
      onExchangePolicyClick={({ exchangePolicyCheckResult }) => {
        showModal(MODAL_TYPES.EXCHANGE_POLICY_DETAILS, {
          title: "Exchange Policy Details",
          offerId: selectedVariant.offer.id,
          offerData: selectedVariant.offer,
          exchangePolicyCheckResult: exchangePolicyCheckResult
        });
      }}
      onPurchaseOverview={() => {
        showModal(MODAL_TYPES.WHAT_IS_REDEEM, {
          title: "Commit and Redeem"
        });
      }}
    >
      <CTAsGrid flexDirection="column" alignItems="center" margin="1.5rem 0">
        <CommitWrapper>
          <Grid flexDirection="column" alignItems="center">
            <CommitButtonWrapper
              style={{ width: "100%" }}
              role="button"
              $pointerEvents={!address ? "none" : "all"}
              onClick={() => {
                if (!address) {
                  saveItemInStorage("isConnectWalletFromCommit", true);
                  setIsCommittingFromNotConnectedWallet(true);
                  openConnectModal();
                }
              }}
            >
              {balanceLoading && address ? (
                <Button disabled>
                  <Spinner />
                </Button>
              ) : (
                <>
                  {showCommitProxyButton ? (
                    <CommitProxyButton />
                  ) : (
                    <CommitButton
                      coreSdkConfig={{
                        envName: config.envName,
                        configId: config.envConfig.configId,
                        web3Provider: signer?.provider as Provider,
                        metaTx: config.metaTx
                      }}
                      variant="primaryFill"
                      isPauseCommitting={!address}
                      buttonRef={commitButtonRef}
                      onGetSignerAddress={handleOnGetSignerAddress}
                      disabled={!!isCommitDisabled}
                      offerId={offer.id}
                      exchangeToken={offer.exchangeToken.address}
                      price={offer.price}
                      onError={onCommitError}
                      onPendingSignature={onCommitPendingSignature}
                      onPendingTransaction={onCommitPendingTransaction}
                      onSuccess={onCommitSuccess}
                      extraInfo="Step 1/2"
                      withBosonStyle
                    />
                  )}
                </>
              )}
            </CommitButtonWrapper>
            <Typography
              className="show-in-smaller-view"
              $fontSize="0.8rem"
              marginTop="0.25rem"
            >
              By proceeding to Commit, I agree to the{" "}
              <span
                style={{
                  fontSize: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                onClick={onClickrNFTTerms}
              >
                rNFT Terms
              </span>
              .
            </Typography>
          </Grid>
          <StyledRedeemButton
            coreSdkConfig={{
              envName: config.envConfig.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.envConfig.metaTx
            }}
            disabled
            withBosonStyle
            exchangeId="0"
            extraInfo="Step 2/2"
            variant="primaryFill"
            style={{ width: "100%" }}
          />
        </CommitWrapper>
        <Typography
          className="show-in-larger-view"
          $fontSize="0.8rem"
          marginTop="0.25rem"
        >
          By proceeding to Commit, I agree to the{" "}
          <span
            style={{
              fontSize: "inherit",
              cursor: "pointer",
              textDecoration: "underline"
            }}
            onClick={onClickrNFTTerms}
          >
            rNFT Terms
          </span>
          .
        </Typography>
      </CTAsGrid>
    </ExternalDetailView>
  );
};
