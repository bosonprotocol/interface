import { Currency, Percent } from "@uniswap/sdk-core";
import Modal from "components/modal/Modal";
import { AutoColumn } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { TransactionStatus } from "graphqlData/__generated__/types-and-hooks";
import { getChainInfo } from "lib/constants/chainInfo";
import { USDT as USDT_MAINNET } from "lib/constants/tokens";
import { isL2ChainId } from "lib/utils/chains";
import { formatCurrencyAmount, NumberType } from "lib/utils/formatNumbers";
import { useChainId } from "lib/utils/hooks/connection/connection";
import useNativeCurrency from "lib/utils/hooks/useNativeCurrency";
import { Allowance, AllowanceState } from "lib/utils/hooks/usePermit2Allowance";
import { usePrevious } from "lib/utils/hooks/usePrevious";
import { SwapResult } from "lib/utils/hooks/useSwapCallback";
import useWrapCallback from "lib/utils/hooks/useWrapCallback";
import { didUserReject } from "lib/utils/swapErrorToUserReadableMessage";
import { tradeMeaningfullyDiffers } from "lib/utils/tradeMeaningFullyDiffer";
import { Wrapper } from "pages/dispute-resolver/DisputeResolver";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { InterfaceTrade, TradeFillType } from "state/routing/types";
import { Field } from "state/swap/actions";
import {
  useIsTransactionConfirmed,
  useSwapTransactionStatus
} from "state/transactions/hooks";
import styled from "styled-components";
import invariant from "tiny-invariant";

import {
  ErrorModalContent,
  PendingModalError
} from "./pendingModalContent/ErrorModalContent";
import {
  PendingConfirmModalState,
  PendingModalContent
} from "./pendingModalContent/index";
import SwapModalFooter from "./SwapModalFooter";
import SwapModalHeader from "./SwapModalHeader";

const BottomSection = styled(AutoColumn)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
function ConfirmationModalContent({
  title,
  bottomContent,
  topContent,
  headerContent
}: {
  title: ReactNode;
  topContent: ReactNode;
  bottomContent?: ReactNode;
  headerContent?: ReactNode;
}) {
  return (
    <Wrapper>
      <AutoColumn $gap="sm">
        <Grid>
          {headerContent}
          <Grid justifyContent="center" marginLeft="24px">
            <Typography>{title}</Typography>
          </Grid>
        </Grid>
        {topContent}
      </AutoColumn>
      {bottomContent && (
        <BottomSection $gap="12px">{bottomContent}</BottomSection>
      )}
    </Wrapper>
  );
}

export enum ConfirmModalState {
  REVIEWING,
  WRAPPING,
  RESETTING_USDT,
  APPROVING_TOKEN,
  PERMITTING,
  PENDING_CONFIRMATION
}
// TODO:styled(Badge)`
const StyledL2Badge = styled.div`
  padding: 6px 8px;
`;

const StyledL2Logo = styled.img`
  height: 16px;
  width: 16px;
`;

function isInApprovalPhase(confirmModalState: ConfirmModalState) {
  return (
    confirmModalState === ConfirmModalState.RESETTING_USDT ||
    confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
    confirmModalState === ConfirmModalState.PERMITTING
  );
}

function useConfirmModalState({
  trade,
  onSwap,
  allowance,
  doesTradeDiffer,
  onCurrencySelection
}: {
  trade: InterfaceTrade;
  onSwap: () => void;
  allowance: Allowance;
  doesTradeDiffer: boolean;
  onCurrencySelection: (field: Field, currency: Currency) => void;
}) {
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(
    ConfirmModalState.REVIEWING
  );
  const [approvalError, setApprovalError] = useState<PendingModalError>();
  const [pendingModalSteps, setPendingModalSteps] = useState<
    PendingConfirmModalState[]
  >([]);

  // This is a function instead of a memoized value because we do _not_ want it to update as the allowance changes.
  // For example, if the user needs to complete 3 steps initially, we should always show 3 step indicators
  // at the bottom of the modal, even after they complete steps 1 and 2.
  const generateRequiredSteps = useCallback(() => {
    const steps: PendingConfirmModalState[] = [];
    if (trade.fillType === TradeFillType.UniswapX && trade.wrapInfo.needsWrap) {
      steps.push(ConfirmModalState.WRAPPING);
    }
    // Any existing USDT allowance needs to be reset before we can approve the new amount (mainnet only).
    // See the `approve` function here: https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7#code
    if (
      allowance.state === AllowanceState.REQUIRED &&
      allowance.token.equals(USDT_MAINNET) &&
      allowance.allowedAmount.greaterThan(0)
    ) {
      steps.push(ConfirmModalState.RESETTING_USDT);
    }
    if (
      allowance.state === AllowanceState.REQUIRED &&
      allowance.needsSetupApproval
    ) {
      steps.push(ConfirmModalState.APPROVING_TOKEN);
    }
    if (
      allowance.state === AllowanceState.REQUIRED &&
      allowance.needsPermitSignature
    ) {
      steps.push(ConfirmModalState.PERMITTING);
    }
    steps.push(ConfirmModalState.PENDING_CONFIRMATION);
    return steps;
  }, [allowance, trade]);

  const chainId = useChainId();
  const nativeCurrency = useNativeCurrency(chainId);

  const [wrapTxHash, setWrapTxHash] = useState<string>();
  const { execute: onWrap } = useWrapCallback(
    nativeCurrency,
    trade.inputAmount.currency,
    formatCurrencyAmount(trade.inputAmount, NumberType.SwapTradeAmount)
  );
  const wrapConfirmed = useIsTransactionConfirmed(wrapTxHash);
  const prevWrapConfirmed = usePrevious(wrapConfirmed);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catchUserReject = async (e: any, errorType: PendingModalError) => {
    setConfirmModalState(ConfirmModalState.REVIEWING);
    if (didUserReject(e)) return;
    console.error(e);
    setApprovalError(errorType);
  };

  const performStep = useCallback(
    async (step: ConfirmModalState) => {
      switch (step) {
        case ConfirmModalState.WRAPPING:
          setConfirmModalState(ConfirmModalState.WRAPPING);
          onWrap?.()
            .then((wrapTxHash) => {
              setWrapTxHash(wrapTxHash);
              // After the wrap has succeeded, reset the input currency to be WETH
              // because the trade will be on WETH -> token
              onCurrencySelection(Field.INPUT, trade.inputAmount.currency);
            })
            .catch((e) => catchUserReject(e, PendingModalError.WRAP_ERROR));
          break;
        case ConfirmModalState.RESETTING_USDT:
          setConfirmModalState(ConfirmModalState.RESETTING_USDT);
          invariant(
            allowance.state === AllowanceState.REQUIRED,
            "Allowance should be required"
          );
          allowance
            .revoke()
            .catch((e) =>
              catchUserReject(e, PendingModalError.TOKEN_APPROVAL_ERROR)
            );
          break;
        case ConfirmModalState.APPROVING_TOKEN:
          setConfirmModalState(ConfirmModalState.APPROVING_TOKEN);
          invariant(
            allowance.state === AllowanceState.REQUIRED,
            "Allowance should be required"
          );
          allowance
            .approve()
            .catch((e) =>
              catchUserReject(e, PendingModalError.TOKEN_APPROVAL_ERROR)
            );
          break;
        case ConfirmModalState.PERMITTING:
          setConfirmModalState(ConfirmModalState.PERMITTING);
          invariant(
            allowance.state === AllowanceState.REQUIRED,
            "Allowance should be required"
          );
          allowance
            .permit()
            .catch((e) =>
              catchUserReject(e, PendingModalError.TOKEN_APPROVAL_ERROR)
            );
          break;
        case ConfirmModalState.PENDING_CONFIRMATION:
          setConfirmModalState(ConfirmModalState.PENDING_CONFIRMATION);
          try {
            onSwap();
          } catch (e) {
            catchUserReject(e, PendingModalError.CONFIRMATION_ERROR);
          }
          break;
        default:
          setConfirmModalState(ConfirmModalState.REVIEWING);
          break;
      }
    },
    [allowance, onSwap, onWrap, trade, onCurrencySelection]
  );

  const startSwapFlow = useCallback(() => {
    const steps = generateRequiredSteps();
    setPendingModalSteps(steps);
    performStep(steps[0]);
  }, [generateRequiredSteps, performStep]);

  const previousSetupApprovalNeeded = usePrevious(
    allowance.state === AllowanceState.REQUIRED
      ? allowance.needsSetupApproval
      : undefined
  );

  useEffect(() => {
    // If the wrapping step finished, trigger the next step (allowance or swap).
    if (wrapConfirmed && !prevWrapConfirmed) {
      // moves on to either approve WETH or to swap submission
      performStep(pendingModalSteps[1]);
    }
  }, [pendingModalSteps, performStep, prevWrapConfirmed, wrapConfirmed]);

  useEffect(() => {
    if (
      allowance.state === AllowanceState.REQUIRED &&
      allowance.needsPermitSignature &&
      // If the token approval switched from missing to fulfilled, trigger the next step (permit2 signature).
      !allowance.needsSetupApproval &&
      previousSetupApprovalNeeded
    ) {
      performStep(ConfirmModalState.PERMITTING);
    }
  }, [allowance, performStep, previousSetupApprovalNeeded]);

  const previousRevocationPending = usePrevious(
    allowance.state === AllowanceState.REQUIRED && allowance.isRevocationPending
  );
  useEffect(() => {
    if (
      allowance.state === AllowanceState.REQUIRED &&
      previousRevocationPending &&
      !allowance.isRevocationPending
    ) {
      performStep(ConfirmModalState.APPROVING_TOKEN);
    }
  }, [allowance, performStep, previousRevocationPending]);

  useEffect(() => {
    // Automatically triggers the next phase if the local modal state still thinks we're in the approval phase,
    // but the allowance has been set. This will automaticaly trigger the swap.
    if (
      isInApprovalPhase(confirmModalState) &&
      allowance.state === AllowanceState.ALLOWED
    ) {
      // Caveat: prevents swap if trade has updated mid approval flow.
      if (doesTradeDiffer) {
        setConfirmModalState(ConfirmModalState.REVIEWING);
        return;
      }
      performStep(ConfirmModalState.PENDING_CONFIRMATION);
    }
  }, [allowance, confirmModalState, doesTradeDiffer, performStep]);

  const onCancel = () => {
    setConfirmModalState(ConfirmModalState.REVIEWING);
    setApprovalError(undefined);
  };

  return {
    startSwapFlow,
    onCancel,
    confirmModalState,
    approvalError,
    pendingModalSteps,
    wrapTxHash
  };
}

export default function ConfirmSwapModal({
  trade,
  inputCurrency,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  allowance,
  onConfirm,
  onDismiss,
  onCurrencySelection,
  swapError,
  swapResult
}: {
  trade: InterfaceTrade;
  inputCurrency?: Currency;
  originalTrade?: InterfaceTrade;
  swapResult?: SwapResult;
  allowedSlippage: Percent;
  allowance: Allowance;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapError?: Error;
  onDismiss: () => void;
  onCurrencySelection: (field: Field, currency: Currency) => void;
  fiatValueInput: { data?: number; isLoading: boolean };
  fiatValueOutput: { data?: number; isLoading: boolean };
}) {
  const chainId = useChainId();
  const doesTradeDiffer =
    originalTrade &&
    tradeMeaningfullyDiffers(trade, originalTrade, allowedSlippage);
  const {
    startSwapFlow,
    onCancel,
    confirmModalState,
    approvalError,
    pendingModalSteps,
    wrapTxHash
  } = useConfirmModalState({
    trade,
    onSwap: onConfirm,
    onCurrencySelection,
    allowance,
    doesTradeDiffer: Boolean(doesTradeDiffer)
  });

  const swapStatus = useSwapTransactionStatus(swapResult);

  // Swap was reverted onchain.
  const swapReverted = swapStatus === TransactionStatus.Failed;
  // Swap failed locally and was not broadcast to the blockchain.
  const localSwapFailure = Boolean(swapError) && !didUserReject(swapError);
  const swapFailed = localSwapFailure || swapReverted;
  useEffect(() => {
    // Reset the modal state if the user rejected the swap.
    if (swapError && !swapFailed) {
      onCancel();
    }
  }, [onCancel, swapError, swapFailed]);

  const showAcceptChanges = Boolean(
    trade &&
      doesTradeDiffer &&
      confirmModalState !== ConfirmModalState.PENDING_CONFIRMATION
  );

  const [lastExecutionPrice, setLastExecutionPrice] = useState(
    trade?.executionPrice
  );
  useEffect(() => {
    if (
      lastExecutionPrice &&
      !trade.executionPrice.equalTo(lastExecutionPrice)
    ) {
      setLastExecutionPrice(trade.executionPrice);
    }
  }, [lastExecutionPrice, setLastExecutionPrice, trade]);

  const onModalDismiss = useCallback(() => {
    onDismiss();
    setTimeout(() => {
      // Reset local state after the modal dismiss animation finishes, to avoid UI flicker as it dismisses
      onCancel();
      // TODO:     }, MODAL_TRANSITION_DURATION);
    }, 0);
  }, [onCancel, onDismiss]);

  const modalHeader = useMemo(() => {
    if (
      confirmModalState !== ConfirmModalState.REVIEWING &&
      !showAcceptChanges
    ) {
      return null;
    }
    return (
      <SwapModalHeader
        inputCurrency={inputCurrency}
        trade={trade}
        allowedSlippage={allowedSlippage}
      />
    );
  }, [
    allowedSlippage,
    confirmModalState,
    showAcceptChanges,
    trade,
    inputCurrency
  ]);

  const modalBottom = useMemo(() => {
    if (
      confirmModalState === ConfirmModalState.REVIEWING ||
      showAcceptChanges
    ) {
      return (
        <SwapModalFooter
          onConfirm={startSwapFlow}
          trade={trade}
          allowedSlippage={allowedSlippage}
          disabledConfirm={showAcceptChanges}
          showAcceptChanges={showAcceptChanges}
          onAcceptChanges={onAcceptChanges}
          swapErrorMessage={swapFailed ? swapError?.message : undefined}
        />
      );
    }
    return (
      <PendingModalContent
        hideStepIndicators={pendingModalSteps.length === 1}
        steps={pendingModalSteps}
        currentStep={confirmModalState}
        trade={trade}
        swapResult={swapResult}
        wrapTxHash={wrapTxHash}
        tokenApprovalPending={
          allowance.state === AllowanceState.REQUIRED &&
          allowance.isApprovalPending
        }
        revocationPending={
          allowance.state === AllowanceState.REQUIRED &&
          allowance.isRevocationPending
        }
      />
    );
  }, [
    confirmModalState,
    showAcceptChanges,
    pendingModalSteps,
    trade,
    swapResult,
    wrapTxHash,
    allowance,
    allowedSlippage,
    onAcceptChanges,
    swapFailed,
    swapError?.message,
    startSwapFlow
  ]);

  const l2Badge = useMemo(() => {
    if (
      isL2ChainId(chainId) &&
      confirmModalState !== ConfirmModalState.REVIEWING
    ) {
      const info = getChainInfo(chainId);
      return (
        <StyledL2Badge data-testid="l2-badge">
          <Grid data-testid="confirmation-modal-chain-icon" gap="sm">
            <StyledL2Logo src={info.logoUrl} />
            <Typography>{info.label}</Typography>
          </Grid>
        </StyledL2Badge>
      );
    }
    return undefined;
  }, [chainId, confirmModalState]);

  return (
    <Modal
      hideModal={onModalDismiss}
      modalType={"CONFIRM_SWAP"}
      maxWidths={{
        m: "35rem"
      }}
      size="auto"
    >
      {approvalError || swapFailed ? (
        <ErrorModalContent
          errorType={approvalError ?? PendingModalError.CONFIRMATION_ERROR}
          onRetry={startSwapFlow}
        />
      ) : (
        <ConfirmationModalContent
          title={
            confirmModalState === ConfirmModalState.REVIEWING ? (
              <>Review swap</>
            ) : undefined
          }
          topContent={modalHeader}
          bottomContent={modalBottom}
          headerContent={l2Badge}
        />
      )}
    </Modal>
  );
}
