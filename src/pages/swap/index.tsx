import * as Sentry from "@sentry/browser";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Percent,
  Token
} from "@uniswap/sdk-core";
import { UNIVERSAL_ROUTER_ADDRESS } from "@uniswap/universal-router-sdk";
import { useWeb3React } from "@web3-react/core";
import AddressInputPanel from "components/addressInputPanel";
import { GrayCard } from "components/card";
import { useConfigContext } from "components/config/ConfigContext";
import SwapCurrencyInputPanel from "components/currencyInputPanel/SwapCurrencyInputPanel";
import { LinkWithQuery } from "components/customNavigation/LinkWithQuery";
import { useToggleAccountDrawer } from "components/header/accountDrawer";
import { NetworkAlert } from "components/networkAlert/NetworkAlert";
import confirmPriceImpactWithoutFee from "components/swap/confirmPriceImpactWithoutFee";
import ConfirmSwapModal from "components/swap/ConfirmSwapModal";
import PriceImpactModal from "components/swap/PriceImpactModal";
import PriceImpactWarning from "components/swap/PriceImpactWarning";
import { ArrowWrapper, PageWrapper, SwapWrapper } from "components/swap/styled";
import SwapDetailsDropdown from "components/swap/SwapDetailsDropdown";
import SwapHeader from "components/swap/SwapHeader";
import TokenSafetyModal from "components/tokenSafety/TokenSafetyModal";
import Button from "components/ui/Button";
import { AutoColumn } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import JSBI from "jsbi";
import { getChainInfo } from "lib/constants/chainInfo";
import { asSupportedChain, isSupportedChain } from "lib/constants/chains";
import { getSwapCurrencyId, TOKEN_SHORTHANDS } from "lib/constants/tokens";
import { BosonRoutes } from "lib/routing/routes";
import { colors } from "lib/styles/colors";
import { opacify } from "lib/styles/opacify";
import { PreventCustomStoreStyles } from "lib/styles/preventCustomStoreStyles";
import { computeFiatValuePriceImpact } from "lib/utils/computeFiatValuePriceImpact";
import { formatCurrencyAmount, NumberType } from "lib/utils/formatNumbers";
import { useAccount, useChainId } from "lib/utils/hooks/connection/connection";
import { useCurrency, useDefaultActiveTokens } from "lib/utils/hooks/Tokens";
import { useIsSwapUnsupported } from "lib/utils/hooks/useIsSwapUnsupported";
import { useMaxAmountIn } from "lib/utils/hooks/useMaxAmountIn";
import usePermit2Allowance, {
  AllowanceState
} from "lib/utils/hooks/usePermit2Allowance";
import { usePrevious } from "lib/utils/hooks/usePrevious";
import { SwapResult, useSwapCallback } from "lib/utils/hooks/useSwapCallback";
import { useSwitchChain } from "lib/utils/hooks/useSwitchChain";
import { useUSDPrice } from "lib/utils/hooks/useUSDPrice";
import useWrapCallback, {
  WrapErrorText,
  WrapType
} from "lib/utils/hooks/useWrapCallback";
import { maxAmountSpend } from "lib/utils/maxAmountSpend";
import { computeRealizedPriceImpact, warningSeverity } from "lib/utils/prices";
import { didUserReject } from "lib/utils/swapErrorToUserReadableMessage";
import { ArrowDown, ArrowLeft } from "phosphor-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { InterfaceTrade, TradeState } from "state/routing/types";
import { isClassicTrade, isUniswapXTrade } from "state/routing/utils";
import { Field, replaceSwapState } from "state/swap/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers
} from "state/swap/hooks";
import swapReducer, {
  initialState as initialSwapState,
  SwapState
} from "state/swap/reducer";
import styled from "styled-components";

// import { UniswapXOptIn } from "./UniswapXOptIn";

const CTAButton = styled(Button)`
  width: 100%;
  border-radius: 16px;
  margin-top: 4px;
`;

export const ArrowContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

const SwapSection = styled.div`
  /* background-color: ${colors.greyDark}; */
  border-radius: 16px;
  color: ${colors.greyLight};
  font-size: 0.875remå;
  font-weight: 500;
  height: 120px;
  line-height: 20px;
  padding: 16px;
  position: relative;

  &:before {
    box-sizing: border-box;
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    pointer-events: none;
    content: "";
    border: 1px solid ${colors.white};
  }

  &:hover:before {
    border-color: ${colors.white};
  }

  &:focus-within:before {
    /* border-color: ${opacify(24, colors.greyLight)}; */
  }
`;

const OutputSwapSection = styled(SwapSection)`
  border-bottom: 1px solid ${colors.white};
`;

function getIsValidSwapQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode
): boolean {
  return Boolean(!swapInputError && trade && tradeState === TradeState.VALID);
}

function largerPercentValue(a?: Percent, b?: Percent) {
  if (a && b) {
    return a.greaterThan(b) ? a : b;
  } else if (a) {
    return a;
  } else if (b) {
    return b;
  }
  return undefined;
}

export default function SwapPage({ className }: { className?: string }) {
  const { config } = useConfigContext();
  const connectedChainId = useChainId();
  const loadedUrlParams = useDefaultsFromURLSearch();

  const supportedChainId = asSupportedChain(connectedChainId);
  const location = useLocation();
  const { state } = location;
  const prevPath = (state as { prevPath: string })?.prevPath;
  return (
    <Grid flexDirection="column" justifyContent="center" alignItems="center">
      <PageWrapper>
        {prevPath?.includes(BosonRoutes.Products) && (
          <LinkWithQuery
            to={prevPath}
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <ArrowLeft size={14} /> Back to product page
          </LinkWithQuery>
        )}
        <ErrorBoundary
          FallbackComponent={() => (
            <Grid flexDirection="column" gap="1rem">
              <Typography fontWeight="600">
                Sorry, the swap page is unavailable right now, please try again
                later.
              </Typography>
            </Grid>
          )}
          onError={(error) => {
            Sentry.captureException(error);
          }}
        >
          <Swap
            className={className}
            chainId={
              (supportedChainId as ChainId) ??
              (config.envConfig.chainId as ChainId) ??
              ChainId.MAINNET
            }
            prefilledState={{
              [Field.INPUT]: {
                currencyId: loadedUrlParams?.[Field.INPUT]?.currencyId
              },
              [Field.OUTPUT]: {
                currencyId: loadedUrlParams?.[Field.OUTPUT]?.currencyId
              },
              typedValue: loadedUrlParams.typedValue
            }}
            disableTokenInputs={supportedChainId === undefined}
          />
          <NetworkAlert />
        </ErrorBoundary>
      </PageWrapper>
    </Grid>
  );
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  className,
  prefilledState = {},
  chainId,
  onCurrencyChange,
  disableTokenInputs = false
}: {
  className?: string;
  prefilledState?: Partial<SwapState>;
  chainId?: ChainId;
  onCurrencyChange?: (
    selected: Pick<SwapState, Field.INPUT | Field.OUTPUT>
  ) => void;
  disableTokenInputs?: boolean;
}) {
  const connectedChainId = useChainId();

  const { connector } = useWeb3React();
  const { account } = useAccount();

  // token warning stuff
  const prefilledInputCurrency = useCurrency(
    prefilledState?.[Field.INPUT]?.currencyId
  );
  const prefilledOutputCurrency = useCurrency(
    prefilledState?.[Field.OUTPUT]?.currencyId
  );

  const [loadedInputCurrency, setLoadedInputCurrency] = useState(
    prefilledInputCurrency
  );
  const [loadedOutputCurrency, setLoadedOutputCurrency] = useState(
    prefilledOutputCurrency
  );

  useEffect(() => {
    setLoadedInputCurrency(prefilledInputCurrency);
    setLoadedOutputCurrency(prefilledOutputCurrency);
  }, [prefilledInputCurrency, prefilledOutputCurrency]);

  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const [showPriceImpactModal, setShowPriceImpactModal] =
    useState<boolean>(false);

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useDefaultActiveTokens(chainId);
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens
        .filter((token: Token) => {
          return !(token.address in defaultTokens);
        })
        .filter((token: Token) => {
          // Any token addresses that are loaded from the shorthands map do not need to show the import URL
          const supported = asSupportedChain(chainId);
          if (!supported) return true;
          return !Object.keys(TOKEN_SHORTHANDS).some((shorthand) => {
            const shorthandTokenAddress =
              TOKEN_SHORTHANDS[shorthand][
                supported as keyof (typeof TOKEN_SHORTHANDS)[typeof shorthand]
              ];
            return (
              shorthandTokenAddress && shorthandTokenAddress === token.address
            );
          });
        }),
    [chainId, defaultTokens, urlLoadedTokens]
  );

  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer();

  // swap state
  const [state, dispatch] = useReducer(swapReducer, {
    ...initialSwapState,
    ...prefilledState
  });
  const { typedValue, recipient, independentField } = state;

  const previousConnectedChainId = usePrevious(connectedChainId);
  const previousPrefilledState = usePrevious(prefilledState);
  useEffect(() => {
    const combinedInitialState = { ...initialSwapState, ...prefilledState };
    const chainChanged =
      previousConnectedChainId && previousConnectedChainId !== connectedChainId;
    const prefilledInputChanged =
      previousPrefilledState &&
      previousPrefilledState?.[Field.INPUT]?.currencyId !==
        prefilledState?.[Field.INPUT]?.currencyId;
    const prefilledOutputChanged =
      previousPrefilledState &&
      previousPrefilledState?.[Field.OUTPUT]?.currencyId !==
        prefilledState?.[Field.OUTPUT]?.currencyId;
    if (chainChanged || prefilledInputChanged || prefilledOutputChanged) {
      dispatch(
        replaceSwapState({
          ...initialSwapState,
          ...prefilledState,
          field: combinedInitialState.independentField ?? Field.INPUT,
          inputCurrencyId: combinedInitialState.INPUT.currencyId ?? undefined,
          outputCurrencyId: combinedInitialState.OUTPUT.currencyId ?? undefined
        })
      );
      // reset local state
      setSwapState({
        tradeToConfirm: undefined,
        swapError: undefined,
        showConfirm: false,
        swapResult: undefined
      });
    }
  }, [
    connectedChainId,
    prefilledState,
    previousConnectedChainId,
    previousPrefilledState
  ]);

  const swapInfo = useDerivedSwapInfo(state, chainId);
  const {
    trade: { state: tradeState, trade },
    allowedSlippage,
    autoSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = swapInfo;

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount
          },
    [independentField, parsedAmount, showWrap, trade]
  );

  const fiatValueInput = useUSDPrice(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDPrice(parsedAmounts[Field.OUTPUT]);
  const showFiatValueInput = Boolean(parsedAmounts[Field.INPUT]);
  const showFiatValueOutput = Boolean(parsedAmounts[Field.OUTPUT]);

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [
      tradeState === TradeState.NO_ROUTE_FOUND,
      tradeState === TradeState.LOADING,
      tradeState === TradeState.LOADING && Boolean(trade)
    ],
    [trade, tradeState]
  );

  const fiatValueTradeInput = useUSDPrice(trade?.inputAmount);
  const fiatValueTradeOutput = useUSDPrice(trade?.outputAmount);
  const stablecoinPriceImpact = useMemo(
    () =>
      routeIsSyncing || !isClassicTrade(trade)
        ? undefined
        : computeFiatValuePriceImpact(
            fiatValueTradeInput.data,
            fiatValueTradeOutput.data
          ),
    [fiatValueTradeInput, fiatValueTradeOutput, routeIsSyncing, trade]
  );

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient
  } = useSwapActionHandlers(dispatch);
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const navigate = useNavigate();
  const swapIsUnsupported = useIsSwapUnsupported(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  );

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    navigate(BosonRoutes.Swap);
  }, [navigate]);

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapError, swapResult }, setSwapState] =
    useState<{
      showConfirm: boolean;
      tradeToConfirm?: InterfaceTrade;
      swapError?: Error;
      swapResult?: SwapResult;
    }>({
      showConfirm: false,
      tradeToConfirm: undefined,
      swapError: undefined,
      swapResult: undefined
    });

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ""
        : formatCurrencyAmount(
            parsedAmounts[dependentField],
            NumberType.SwapTradeAmount,
            ""
          )
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  );

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  const maximumAmountIn = useMaxAmountIn(trade, allowedSlippage);
  const allowance = usePermit2Allowance(
    maximumAmountIn ??
      (parsedAmounts[Field.INPUT]?.currency.isToken
        ? (parsedAmounts[Field.INPUT] as CurrencyAmount<Token>)
        : undefined),
    isSupportedChain(chainId) ? UNIVERSAL_ROUTER_ADDRESS(chainId) : undefined,
    trade?.fillType
  );

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  );
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) &&
      !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount)
  );

  const swapFiatValues = useMemo(() => {
    return {
      amountIn: fiatValueTradeInput.data,
      amountOut: fiatValueTradeOutput.data
    };
  }, [fiatValueTradeInput, fiatValueTradeOutput]);

  // the callback to execute the swap
  const swapCallback = useSwapCallback(
    trade,
    swapFiatValues,
    allowedSlippage,
    allowance.state === AllowanceState.ALLOWED
      ? allowance.permitSignature
      : undefined
  );

  const handleContinueToReview = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapError: undefined,
      showConfirm: true,
      swapResult: undefined
    });
  }, [trade]);

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (
      stablecoinPriceImpact &&
      !confirmPriceImpactWithoutFee(stablecoinPriceImpact)
    ) {
      return;
    }
    setSwapState((currentState) => ({
      ...currentState,
      swapError: undefined,
      swapResult: undefined
    }));
    swapCallback()
      .then((result) => {
        setSwapState((currentState) => ({
          ...currentState,
          swapError: undefined,
          swapResult: result
        }));
      })
      .catch((error) => {
        setSwapState((currentState) => ({
          ...currentState,
          swapError: error,
          swapResult: undefined
        }));
      });
  }, [swapCallback, stablecoinPriceImpact]);

  const handleOnWrap = useCallback(async () => {
    if (!onWrap) return;
    try {
      const txHash = await onWrap();
      setSwapState((currentState) => ({
        ...currentState,
        swapError: undefined,
        txHash
      }));
      onUserInput(Field.INPUT, "");
    } catch (error) {
      if (!didUserReject(error)) {
        // sendAnalyticsEvent(SwapEventName.SWAP_ERROR, {
        //   wrapType,
        //   input: currencies[Field.INPUT],
        //   output: currencies[Field.OUTPUT]
        // });
        // TODO: Sentry
      }
      console.error("Could not wrap/unwrap", error);
      setSwapState((currentState) => ({
        ...currentState,
        swapError: error as Error,
        txHash: undefined
      }));
    }
  }, [onUserInput, onWrap]);

  // warnings on the greater of fiat value price impact and execution price impact
  const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
    if (isUniswapXTrade(trade)) {
      return { priceImpactSeverity: 0, largerPriceImpact: undefined };
    }

    const marketPriceImpact = trade?.priceImpact
      ? computeRealizedPriceImpact(trade)
      : undefined;
    const largerPriceImpact = largerPercentValue(
      marketPriceImpact,
      stablecoinPriceImpact
    );
    return {
      priceImpactSeverity: warningSeverity(largerPriceImpact),
      largerPriceImpact
    };
  }, [stablecoinPriceImpact, trade]);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((currentState) => ({ ...currentState, showConfirm: false }));
    // If there was a swap, we want to clear the input
    if (swapResult) {
      onUserInput(Field.INPUT, "");
    }
  }, [onUserInput, swapResult]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState((currentState) => ({
      ...currentState,
      tradeToConfirm: trade
    }));
  }, [trade]);

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      onCurrencyChange?.({
        [Field.INPUT]: {
          currencyId: getSwapCurrencyId(inputCurrency)
        },
        [Field.OUTPUT]: state[Field.OUTPUT]
      });
    },
    [onCurrencyChange, onCurrencySelection, state]
  );

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      onCurrencyChange?.({
        [Field.INPUT]: state[Field.INPUT],
        [Field.OUTPUT]: {
          currencyId: getSwapCurrencyId(outputCurrency)
        }
      });
    },
    [onCurrencyChange, onCurrencySelection, state]
  );

  const showPriceImpactWarning =
    isClassicTrade(trade) && largerPriceImpact && priceImpactSeverity > 3;

  const showDetailsDropdown = Boolean(
    !showWrap &&
      userHasSpecifiedInputOutput &&
      (trade || routeIsLoading || routeIsSyncing)
  );

  const inputCurrency = currencies[Field.INPUT] ?? undefined;
  const switchChain = useSwitchChain();
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  // const showOptInSmall = !useScreenSize().navSearchInputVisible;

  const swapElement = (
    <SwapWrapper chainId={chainId} className={className} id="swap-page">
      <TokenSafetyModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokenAddress={importTokensNotInDefault[0]?.address}
        secondTokenAddress={importTokensNotInDefault[1]?.address}
        onContinue={handleConfirmTokenWarning}
        onCancel={handleDismissTokenWarning}
        showCancel={true}
      />
      <SwapHeader trade={trade} autoSlippage={autoSlippage} chainId={chainId} />
      {trade && showConfirm && allowance.state !== AllowanceState.LOADING && (
        <ConfirmSwapModal
          trade={trade}
          inputCurrency={inputCurrency}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          onCurrencySelection={onCurrencySelection}
          swapResult={swapResult}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          allowance={allowance}
          swapError={swapError}
          onDismiss={handleConfirmDismiss}
          fiatValueInput={fiatValueTradeInput}
          fiatValueOutput={fiatValueTradeOutput}
        />
      )}
      {showPriceImpactModal && showPriceImpactWarning && (
        <PriceImpactModal
          priceImpact={largerPriceImpact}
          onDismiss={() => setShowPriceImpactModal(false)}
          onContinue={() => {
            setShowPriceImpactModal(false);
            handleContinueToReview();
          }}
        />
      )}

      <div style={{ display: "relative" }}>
        <SwapSection>
          <SwapCurrencyInputPanel
            label={<>You pay</>}
            disabled={disableTokenInputs}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={showMaxButton}
            currency={currencies[Field.INPUT] ?? null}
            onUserInput={handleTypeInput}
            onMax={handleMaxInput}
            fiatValue={showFiatValueInput ? fiatValueInput : undefined}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            showCommonBases
            id={"CURRENCY_INPUT_PANEL"}
            loading={independentField === Field.OUTPUT && routeIsSyncing}
          />
        </SwapSection>
        <ArrowWrapper clickable={isSupportedChain(chainId)}>
          <ArrowContainer
            data-testid="swap-currency-button"
            onClick={() => {
              !disableTokenInputs && onSwitchTokens();
            }}
          >
            <ArrowDown size="16" color={colors.black} />
          </ArrowContainer>
        </ArrowWrapper>
      </div>
      <AutoColumn $gap="xs">
        <div>
          <OutputSwapSection>
            <SwapCurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              disabled={disableTokenInputs}
              onUserInput={handleTypeOutput}
              label={<>You receive</>}
              showMaxButton={false}
              hideBalance={false}
              fiatValue={showFiatValueOutput ? fiatValueOutput : undefined}
              priceImpact={stablecoinPriceImpact}
              currency={currencies[Field.OUTPUT] ?? null}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              showCommonBases
              id={"CURRENCY_OUTPUT_PANEL"}
              loading={independentField === Field.INPUT && routeIsSyncing}
            />
            {recipient !== null && !showWrap ? (
              <>
                <Grid
                  justifyContent="space-between"
                  style={{ padding: "0 1rem" }}
                >
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={colors.greyLight} />
                  </ArrowWrapper>
                  <Button
                    id="remove-recipient-button"
                    onClick={() => onChangeRecipient(null)}
                  >
                    <>- Remove recipient</>
                  </Button>
                </Grid>
                <AddressInputPanel
                  id="recipient"
                  value={recipient}
                  onChange={onChangeRecipient}
                />
              </>
            ) : null}
          </OutputSwapSection>
        </div>
        {showDetailsDropdown && (
          <SwapDetailsDropdown
            trade={trade}
            syncing={routeIsSyncing}
            loading={routeIsLoading}
            allowedSlippage={allowedSlippage}
          />
        )}
        {showPriceImpactWarning && (
          <PriceImpactWarning priceImpact={largerPriceImpact} />
        )}
        <div>
          {swapIsUnsupported ? (
            <CTAButton disabled={true}>
              <Typography marginBottom="4px">
                <>Unsupported Asset</>
              </Typography>
            </CTAButton>
          ) : switchingChain ? (
            <CTAButton disabled={true}>
              <>Connecting to {getChainInfo(switchingChain)?.label}</>
            </CTAButton>
          ) : !account ? (
            <CTAButton onClick={toggleWalletDrawer}>
              <Typography fontWeight={600}>Connect Wallet</Typography>
            </CTAButton>
          ) : chainId && chainId !== connectedChainId ? (
            <CTAButton
              onClick={async () => {
                try {
                  await switchChain(connector, chainId);
                } catch (error) {
                  if (didUserReject(error)) {
                    // Ignore error, which keeps the user on the previous chain.
                  } else {
                    // TODO(WEB-3306): This UX could be improved to show an error state.
                    throw error;
                  }
                }
              }}
            >
              Connect to {getChainInfo(chainId)?.label}
            </CTAButton>
          ) : showWrap ? (
            <CTAButton
              disabled={Boolean(wrapInputError)}
              onClick={handleOnWrap}
              data-testid="wrap-button"
            >
              <Typography fontWeight={600}>
                {wrapInputError ? (
                  <WrapErrorText wrapInputError={wrapInputError} />
                ) : wrapType === WrapType.WRAP ? (
                  <>Wrap</>
                ) : wrapType === WrapType.UNWRAP ? (
                  <>Unwrap</>
                ) : null}
              </Typography>
            </CTAButton>
          ) : routeNotFound &&
            userHasSpecifiedInputOutput &&
            !routeIsLoading &&
            !routeIsSyncing ? (
            <GrayCard style={{ textAlign: "center" }}>
              <Typography marginBottom="4px">
                <>Insufficient liquidity for this trade.</>
              </Typography>
            </GrayCard>
          ) : (
            <CTAButton
              onClick={() => {
                showPriceImpactWarning
                  ? setShowPriceImpactModal(true)
                  : handleContinueToReview();
              }}
              id="swap-button"
              data-testid="swap-button"
              disabled={!getIsValidSwapQuote(trade, tradeState, swapInputError)}
              style={{
                color:
                  !swapInputError &&
                  priceImpactSeverity > 2 &&
                  allowance.state === AllowanceState.ALLOWED
                    ? colors.red
                    : ""
              }}
            >
              <Typography fontSize={`20px`} fontWeight={600}>
                {swapInputError ? (
                  swapInputError
                ) : routeIsSyncing || routeIsLoading ? (
                  <>Swap</>
                ) : priceImpactSeverity > 2 ? (
                  <>Swap Anyway</>
                ) : (
                  <>Swap</>
                )}
              </Typography>
            </CTAButton>
          )}
        </div>
      </AutoColumn>
      {/* {!showOptInSmall && <UniswapXOptIn isSmall={false} swapInfo={swapInfo} />} */}
    </SwapWrapper>
  );

  return (
    <PreventCustomStoreStyles>
      {swapElement}
      {/* {showOptInSmall && <UniswapXOptIn isSmall swapInfo={swapInfo} />} */}
    </PreventCustomStoreStyles>
  );
}
