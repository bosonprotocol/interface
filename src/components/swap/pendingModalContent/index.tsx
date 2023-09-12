import { ChainId, Currency } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import Column, { ColumnCenter } from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { TransactionStatus } from "graphql/data/__generated__/types-and-hooks";
import { getExplorerLink } from "lib/utils/getExplorerLink";
import { ExplorerDataType } from "lib/utils/getExplorerLink";
import { UniswapXOrderStatus } from "lib/utils/hooks/orders/types";
import { SwapResult } from "lib/utils/hooks/useSwapCallback";
import { useUnmountingAnimation } from "lib/utils/hooks/useUnmountingAnimation";
import { ReactNode, useMemo, useRef } from "react";
import { InterfaceTrade, TradeFillType } from "state/routing/types";
import { useOrder } from "state/signatures/hooks";
import { UniswapXOrderDetails } from "state/signatures/types";
import {
  useIsTransactionConfirmed,
  useSwapTransactionStatus
} from "state/transactions/hooks";
import styled, { css, keyframes } from "styled-components";

import { ConfirmModalState } from "../ConfirmSwapModal";
import {
  AnimatedEntranceConfirmationIcon,
  AnimatedEntranceSubmittedIcon,
  AnimationType,
  CurrencyLoader,
  LoadingIndicatorOverlay,
  LogoContainer,
  PaperIcon
} from "./Logos";
import { TradeSummary } from "./TradeSummary";

export const PendingModalContainer = styled(ColumnCenter)`
  margin: 48px 0 8px;
`;

const HeaderContainer = styled(ColumnCenter)<{ $disabled?: boolean }>`
  ${({ $disabled }) => $disabled && `opacity: 0.5;`}
  padding: 0 32px;
  overflow: visible;
`;

const StepCircle = styled.div<{ active: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  /* background-color: {({ theme, active }) =>
    active ? colors.secondary : theme.textTertiary};
  outline: 3px solid
    {({ theme, active }) =>
    active ? theme.accentActionSoft : theme.accentTextLightTertiary}; */
  transition: background-color 250ms ease-in-out;
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(40px) }
  to { opacity: 1; transform: translateX(0px) }
`;
const slideInAnimation = css`
  animation: ${slideIn} 250ms ease-in-out;
`;
const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0px) }
  to { opacity: 0; transform: translateX(-40px) }
`;
const slideOutAnimation = css`
  animation: ${slideOut} 250ms ease-in-out;
`;

const AnimationWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 72px;
  display: flex;
  flex-grow: 1;
`;

const StepTitleAnimationContainer = styled(Column)<{
  disableEntranceAnimation?: boolean;
}>`
  position: absolute;
  width: 100%;
  align-items: center;
  transition: display ${({ theme }) => `250ms ease-in-out`};
  ${({ disableEntranceAnimation }) =>
    !disableEntranceAnimation &&
    css`
      ${slideInAnimation}
    `}

  &.${AnimationType.EXITING} {
    ${slideOutAnimation}
  }
`;

// This component is used for all steps after ConfirmModalState.REVIEWING
export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING
  | ConfirmModalState.PENDING_CONFIRMATION
  | ConfirmModalState.WRAPPING
  | ConfirmModalState.RESETTING_USDT
>;

interface PendingModalStep {
  title: ReactNode;
  subtitle?: ReactNode;
  bottomLabel?: ReactNode;
  logo?: ReactNode;
  button?: ReactNode;
}

interface PendingModalContentProps {
  steps: PendingConfirmModalState[];
  currentStep: PendingConfirmModalState;
  trade?: InterfaceTrade;
  swapResult?: SwapResult;
  wrapTxHash?: string;
  hideStepIndicators?: boolean;
  tokenApprovalPending?: boolean;
  revocationPending?: boolean;
}

interface ContentArgs {
  approvalCurrency?: Currency;
  trade?: InterfaceTrade;
  swapConfirmed: boolean;
  swapPending: boolean;
  wrapPending: boolean;
  tokenApprovalPending: boolean;
  revocationPending: boolean;
  swapResult?: SwapResult;
  chainId?: number;
  order?: UniswapXOrderDetails;
}

function getPendingConfirmationContent({
  swapConfirmed,
  swapPending,
  trade,
  chainId,
  swapResult
}: Pick<
  ContentArgs,
  "swapConfirmed" | "swapPending" | "trade" | "chainId" | "swapResult"
>): PendingModalStep {
  const title = swapPending
    ? `Swap submitted`
    : swapConfirmed
    ? `Swap success!`
    : `Confirm Swap`;
  const tradeSummary = trade ? <TradeSummary trade={trade} /> : null;
  if (swapPending && trade?.fillType === TradeFillType.UniswapX) {
    return {
      title,
      subtitle: tradeSummary,
      bottomLabel: (
        <a
          href="https://support.uniswap.org/hc/en-us/articles/17515415311501"
          color="textSecondary"
        >
          <>Learn more about swapping with UniswapX</>
        </a>
      )
    };
  } else if (
    (swapPending || swapConfirmed) &&
    chainId &&
    swapResult?.type === TradeFillType.Classic
  ) {
    const explorerLink = (
      <a
        href={getExplorerLink(
          chainId,
          swapResult.response.hash,
          ExplorerDataType.TRANSACTION
        )}
        color="textSecondary"
      >
        <>View on Explorer</>
      </a>
    );
    if (swapPending) {
      // On Mainnet, we show a "submitted" state while the transaction is pending confirmation.
      return {
        title,
        subtitle: chainId === ChainId.MAINNET ? explorerLink : tradeSummary,
        bottomLabel:
          chainId === ChainId.MAINNET ? `Transaction pending...` : explorerLink
      };
    } else {
      return {
        title,
        subtitle: explorerLink,
        bottomLabel: null
      };
    }
  } else {
    return {
      title,
      subtitle: tradeSummary,
      bottomLabel: `Proceed in your wallet`
    };
  }
}

function useStepContents(
  args: ContentArgs
): Record<PendingConfirmModalState, PendingModalStep> {
  const {
    wrapPending,
    approvalCurrency,
    swapConfirmed,
    swapPending,
    tokenApprovalPending,
    revocationPending,
    trade,
    swapResult,
    chainId
  } = args;

  return useMemo(
    () => ({
      [ConfirmModalState.WRAPPING]: {
        title: `Wrap ETH`,
        subtitle: (
          <a href="https://support.uniswap.org/hc/en-us/articles/16015852009997">
            <>Why is this required?</>
          </a>
        ),
        bottomLabel: wrapPending ? `Pending...` : `Proceed in your wallet`
      },
      [ConfirmModalState.RESETTING_USDT]: {
        title: `Reset USDT`,
        subtitle: `USDT requires resetting approval when spending limits are too low.`,
        bottomLabel: revocationPending ? `Pending...` : `Proceed in your wallet`
      },
      [ConfirmModalState.APPROVING_TOKEN]: {
        title: `Enable spending ${
          approvalCurrency?.symbol ?? "this token"
        } on Uniswap`,
        subtitle: (
          <a href="https://support.uniswap.org/hc/en-us/articles/8120520483085">
            <>Why is this required?</>
          </a>
        ),
        bottomLabel: tokenApprovalPending
          ? `Pending...`
          : `Proceed in your wallet`
      },
      [ConfirmModalState.PERMITTING]: {
        title: `Allow ${
          approvalCurrency?.symbol ?? "this token"
        } to be used for swapping`,
        subtitle: (
          <a href="https://support.uniswap.org/hc/en-us/articles/8120520483085">
            <>Why is this required?</>
          </a>
        ),
        bottomLabel: `Proceed in your wallet`
      },
      [ConfirmModalState.PENDING_CONFIRMATION]: getPendingConfirmationContent({
        chainId,
        swapConfirmed,
        swapPending,
        swapResult,
        trade
      })
    }),
    [
      approvalCurrency?.symbol,
      chainId,
      revocationPending,
      swapConfirmed,
      swapPending,
      swapResult,
      tokenApprovalPending,
      trade,
      wrapPending
    ]
  );
}

export function PendingModalContent({
  steps,
  currentStep,
  trade,
  swapResult,
  wrapTxHash,
  hideStepIndicators,
  tokenApprovalPending = false,
  revocationPending = false
}: PendingModalContentProps) {
  const { chainId } = useWeb3React();

  const swapStatus = useSwapTransactionStatus(swapResult);
  const order = useOrder(
    swapResult?.type === TradeFillType.UniswapX
      ? swapResult.response.orderHash
      : ""
  );

  const swapConfirmed =
    swapStatus === TransactionStatus.Confirmed ||
    order?.status === UniswapXOrderStatus.FILLED;
  const wrapConfirmed = useIsTransactionConfirmed(wrapTxHash);

  const swapPending = swapResult !== undefined && !swapConfirmed;
  const wrapPending = wrapTxHash != undefined && !wrapConfirmed;

  const stepContents = useStepContents({
    approvalCurrency: trade?.inputAmount.currency,
    swapConfirmed,
    swapPending,
    wrapPending,
    tokenApprovalPending,
    revocationPending,
    swapResult,
    trade,
    chainId
  });

  const currentStepContainerRef = useRef<HTMLDivElement>(null);
  useUnmountingAnimation(currentStepContainerRef, () => AnimationType.EXITING);

  if (steps.length === 0) {
    return null;
  }

  // On mainnet, we show a different icon when the transaction is submitted but pending confirmation.
  const showSubmitted =
    swapPending && !swapConfirmed && chainId === ChainId.MAINNET;
  const showSuccess =
    swapConfirmed || (chainId !== ChainId.MAINNET && swapPending);

  const transactionPending =
    revocationPending || tokenApprovalPending || wrapPending || swapPending;

  return (
    <PendingModalContainer gap="lg">
      <LogoContainer>
        {/* Shown during the setup approval step, and fades out afterwards. */}
        {currentStep === ConfirmModalState.APPROVING_TOKEN && <PaperIcon />}
        {/* Shown during the setup approval step as a small badge. */}
        {/* Scales up once we transition from setup approval to permit signature. */}
        {/* Fades out after the permit signature. */}
        {currentStep !== ConfirmModalState.PENDING_CONFIRMATION && (
          <CurrencyLoader
            currency={trade?.inputAmount.currency}
            asBadge={currentStep === ConfirmModalState.APPROVING_TOKEN}
          />
        )}
        {/* Shown only during the final step under "success" conditions, and scales in. */}
        {currentStep === ConfirmModalState.PENDING_CONFIRMATION &&
          showSuccess && <AnimatedEntranceConfirmationIcon />}
        {/* Shown only during the final step on mainnet, when the transaction is sent but pending confirmation. */}
        {currentStep === ConfirmModalState.PENDING_CONFIRMATION &&
          showSubmitted && <AnimatedEntranceSubmittedIcon />}
        {/* Scales in for any step that waits for an onchain transaction, while the transaction is pending. */}
        {/* On the last step, appears while waiting for the transaction to be signed too. */}
        {((currentStep !== ConfirmModalState.PENDING_CONFIRMATION &&
          transactionPending) ||
          (currentStep === ConfirmModalState.PENDING_CONFIRMATION &&
            !showSuccess &&
            !showSubmitted)) && <LoadingIndicatorOverlay />}
      </LogoContainer>
      <HeaderContainer gap="md" $disabled={transactionPending}>
        <AnimationWrapper>
          {steps.map((step) => {
            // We only render one step at a time, but looping through the array allows us to keep
            // the exiting step in the DOM during its animation.
            return (
              Boolean(step === currentStep) && (
                <StepTitleAnimationContainer
                  disableEntranceAnimation={steps[0] === currentStep}
                  gap="md"
                  key={step}
                  ref={
                    step === currentStep ? currentStepContainerRef : undefined
                  }
                >
                  <Typography
                    textAlign="center"
                    data-testid="pending-modal-content-title"
                  >
                    {stepContents[step].title}
                  </Typography>
                  <Typography textAlign="center">
                    {stepContents[step].subtitle}
                  </Typography>
                </StepTitleAnimationContainer>
              )
            );
          })}
        </AnimationWrapper>
        <Grid
          justifyContent="center"
          marginTop="32px"
          style={{ minHeight: "24px" }}
        >
          <Typography color="textSecondary">
            {stepContents[currentStep].bottomLabel}
          </Typography>
        </Grid>
      </HeaderContainer>
      {stepContents[currentStep].button && (
        <Grid justifyContent="center">{stepContents[currentStep].button}</Grid>
      )}

      {!hideStepIndicators && !showSuccess && (
        <Grid gap="14px" justifyContent="center">
          {steps.map((_, i) => {
            return (
              <StepCircle key={i} active={steps.indexOf(currentStep) === i} />
            );
          })}
        </Grid>
      )}
    </PendingModalContainer>
  );
}
