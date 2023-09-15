import { Currency, CurrencyAmount, Percent } from "@uniswap/sdk-core";
import { Pair } from "@uniswap/v2-sdk";
import { useWeb3React } from "@web3-react/core";
import { ReactComponent as DropDown } from "assets/images/dropdown.svg";
import PrefetchBalancesWrapper from "components/header/accountDrawer/PrefetchBalancesWrapper";
import { flexColumnNoWrap, flexRowNoWrap } from "components/header/styles";
import {
  LoadingOpacityContainer,
  loadingOpacityMixin
} from "components/loader/styled";
import CurrencyLogo from "components/logo/CurrencyLogo";
import Button from "components/ui/Button";
import { AutoColumn } from "components/ui/column/index";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { isSupportedChain } from "lib/constants/chains";
import { colors } from "lib/styles/colors";
import { opacify } from "lib/styles/opacify";
import { formatCurrencyAmount, NumberType } from "lib/utils/formatNumbers";
import { Lock } from "phosphor-react";
import { darken } from "polished";
import { ReactNode, useCallback, useState } from "react";
import { useCurrencyBalance } from "state/connection/hooks";
import styled from "styled-components";

import DoubleCurrencyLogo from "../logo/DoubleCurrencyLogo";
import { Input as NumericalInput } from "../numericalInput";
import CurrencySearchModal from "../searchModal/CurrencySearchModal";
import { FiatValue } from "./FiatValue";

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  transition: height 1s ease;
  will-change: height;
`;

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Container = styled.div<{ hideInput: boolean }>`
  min-height: 44px;
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
`;

const CurrencySelect = styled(Button)<{
  visible: boolean;
  selected: boolean;
  hideInput?: boolean;
  disabled?: boolean;
}>`
  min-width: 175px;
  align-items: center;
  background-color: ${({ selected }) =>
    selected ? colors.black : colors.secondary};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  box-shadow: ${({ selected }) =>
    selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)"};
  color: ${colors.white};
  cursor: pointer;
  height: unset;
  border-radius: 16px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 24px;
  font-weight: 500;
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  padding: ${({ selected }) =>
    selected ? "4px 8px 4px 4px" : "6px 6px 6px 8px"};
  gap: 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? "0" : "12px")};
  [data-child-wrapper-button] {
    width: 100%;

    > * > * {
      justify-content: space-around;
    }
  }
  &&& {
    svg {
      fill: none !important;
    }

    &:hover,
    &:active {
      background-color: ${({ selected }) =>
        selected ? colors.darkGrey : colors.secondary};
    }

    &:before {
      background-size: 100%;
      border-radius: inherit;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
      content: "";
    }

    &:hover:before {
      background-color: ${opacify(8, colors.darkGrey)};
    }

    &:active:before {
      background-color: ${opacify(24, colors.lightGrey)};
    }
  }

  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
`;

const LabelRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  color: ${colors.lightGrey};
  font-size: 0.75rem;
  line-height: 1rem;

  span:hover {
    cursor: pointer;
    color: ${darken(0.2, colors.lightGrey)};
  }
`;

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  min-height: 20px;
  padding: 8px 0px 0px 0px;
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;
  margin-left: 8px;
  && {
    stroke: ${colors.white};
  }

  path {
    stroke: ${({ selected }) => (selected ? colors.primary : colors.white)};
    stroke-width: 2px;
  }
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active ? "margin: 0 0.25rem 0 0.25rem;" : "margin: 0 0.25rem 0 0.25rem;"}
  font-size: 20px;
  font-weight: 600;
`;

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  color: ${colors.secondary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 4px 6px;
  pointer-events: ${({ disabled }) => (!disabled ? "initial" : "none")};

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`;

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
  font-size: 36px;
  line-height: 44px;
  font-variant: small-caps;
`;

interface SwapCurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label: ReactNode;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  fiatValue?: { data?: number; isLoading: boolean };
  priceImpact?: Percent;
  id: string;
  showCommonBases?: boolean;
  showCurrencyAmount?: boolean;
  disableNonToken?: boolean;
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode;
  locked?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export default function SwapCurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  loading = false,
  disabled = false,
  label,
  ...rest
}: SwapCurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account, chainId } = useWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const chainAllowed = isSupportedChain(chainId);

  return (
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      {locked && (
        <FixedContainer>
          <AutoColumn gap="sm" justify="center">
            <Lock />
            <Typography $fontSize="12px" textAlign="center" padding="0 12px">
              <>
                The market price is outside your specified price range.
                Single-asset deposit only.
              </>
            </Typography>
          </AutoColumn>
        </FixedContainer>
      )}
      <Container hideInput={hideInput}>
        <Typography color={colors.darkGrey}>{label}</Typography>
        <InputRow
          style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
        >
          {!hideInput && (
            <StyledNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={onUserInput}
              disabled={!chainAllowed || disabled}
              $loading={loading}
            />
          )}
          <PrefetchBalancesWrapper shouldFetchOnAccountUpdate={modalOpen}>
            <CurrencySelect
              disabled={!chainAllowed || disabled}
              visible={currency !== undefined}
              selected={!!currency}
              hideInput={hideInput}
              className="open-currency-select-button"
              onClick={() => {
                if (onCurrencySelect) {
                  setModalOpen(true);
                }
              }}
            >
              <Aligner>
                <Grid>
                  {pair ? (
                    <span style={{ marginRight: "0.5rem" }}>
                      <DoubleCurrencyLogo
                        currency0={pair.token0}
                        currency1={pair.token1}
                        size={24}
                        margin={true}
                      />
                    </span>
                  ) : currency ? (
                    <CurrencyLogo
                      style={{ marginRight: "2px" }}
                      currency={currency}
                      size="24px"
                    />
                  ) : null}
                  {pair ? (
                    <StyledTokenName className="pair-name-container">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </StyledTokenName>
                  ) : (
                    <StyledTokenName
                      className="token-symbol-container"
                      active={Boolean(currency && currency.symbol)}
                    >
                      {(currency &&
                      currency.symbol &&
                      currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          "..." +
                          currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length
                          )
                        : currency?.symbol) || <>Select token</>}
                    </StyledTokenName>
                  )}
                </Grid>
                {onCurrencySelect && <StyledDropDown selected={!!currency} />}
              </Aligner>
            </CurrencySelect>
          </PrefetchBalancesWrapper>
        </InputRow>
        {Boolean(!hideInput && !hideBalance) && (
          <FiatRow>
            <Grid justifyContent="space-between">
              <LoadingOpacityContainer $loading={loading}>
                {fiatValue && (
                  <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
                )}
              </LoadingOpacityContainer>
              {account ? (
                <Grid $height={"17px"} $width={"fit-content"}>
                  <Typography
                    data-testid="balance-text"
                    color="initial"
                    fontWeight={400}
                    $fontSize={`14px`}
                    style={{ display: "inline" }}
                  >
                    {!hideBalance && currency && selectedCurrencyBalance ? (
                      renderBalance ? (
                        renderBalance(selectedCurrencyBalance)
                      ) : (
                        <>
                          Balance:{" "}
                          {formatCurrencyAmount(
                            selectedCurrencyBalance,
                            NumberType.TokenNonTx
                          )}
                        </>
                      )
                    ) : null}
                  </Typography>
                  {showMaxButton && selectedCurrencyBalance ? (
                    <StyledBalanceMax onClick={onMax}>
                      <>Max</>
                    </StyledBalanceMax>
                  ) : null}
                </Grid>
              ) : (
                <span />
              )}
            </Grid>
          </FiatRow>
        )}
      </Container>
      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
        />
      )}
    </InputPanel>
  );
}
