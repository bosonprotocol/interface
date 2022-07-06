import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { BigNumber, utils } from "ethers";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import { colors } from "../../../lib/styles/colors";
import useDepositFunds from "./useDepositFunds";
import useWithdrawFunds from "./useWithdrawFunds";

export const fundsBorderRadius = "0.3125rem";

export const shakeKeyframes = `
  @keyframes shake {
    0% { transform: translate(0.0625rem, 0.0625rem) rotate(0deg); }
    10% { transform: translate(-0.0625rem, -0.125rem) rotate(-1deg); }
    20% { transform: translate(-0.1875rem, 0) rotate(1deg); }
    30% { transform: translate(0.1875rem, 0.125rem) rotate(0deg); }
    40% { transform: translate(0.0625rem, -0.0625rem) rotate(1deg); }
    50% { transform: translate(-0.0625rem, 0.125rem) rotate(-1deg); }
    60% { transform: translate(-0.1875rem, 0.0625rem) rotate(0deg); }
    70% { transform: translate(0.1875rem, 0.0625rem) rotate(-1deg); }
    80% { transform: translate(-0.0625rem, -0.0625rem) rotate(1deg); }
    90% { transform: translate(0.0625rem, 0.125rem) rotate(0deg); }
    100% { transform: translate(0.0625rem, -0.125rem) rotate(-1deg); }
  }
`;

const Table = styled.div<{ $isHighlighted: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 0.3125rem;
  ${({ $isHighlighted }) =>
    $isHighlighted &&
    `* {
    animation: shake 0.1s; 
    ${shakeKeyframes}
  }`}
`;

export const Cell = styled.div<{
  $hasBorder?: boolean;
  $flexBasis: number;
}>`
  ${({ $hasBorder }) =>
    $hasBorder &&
    `
    border: 0.0625rem solid black;
    border-radius: ${fundsBorderRadius};
    `}

  gap: 0.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: ${({ $flexBasis }) => `${$flexBasis}%`};
  flex-grow: 0;
  flex-shrink: 1;
  overflow: hidden;
  padding: 0 0.0625rem;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 75%;
  height: 100%;
  font-size: 1rem;
  background: transparent;
  border-radius: ${fundsBorderRadius};
  padding: 0 0.625rem;
  border: 0.0625rem solid ${colors.darkGrey};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;

  :disabled {
    cursor: not-allowed;
  }

  ${({ $hasError }) =>
    $hasError &&
    `
    border: 0.0625rem solid ${colors.red};
    animation: shake 0.1s; 
    `}

  ${shakeKeyframes}
`;

export const CustomButton = styled(Button)`
  border-radius: ${fundsBorderRadius};
  width: 25%;
  justify-content: center;
  display: flex;
`;

const InputMaxWrapper = styled.div<{ $hasError?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: ${fundsBorderRadius};
  border: 0.0625rem solid ${colors.darkGrey};
  ${({ $hasError }) =>
    $hasError &&
    `
    border: 0.0625rem solid ${colors.red};
    animation: shake 0.1s; 
    `}

  input {
    border: none;
    flex: 1 1 100%;
  }
`;

const MaxButton = styled.button.attrs({
  type: "button"
})`
  all: unset;
  cursor: pointer;
  padding-left: 0.625rem;
  text-decoration: underline;
`;

const Spinner = styled(ImSpinner2)`
  animation: spin 2s infinite linear;
  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }
`;

interface Props {
  accountId: string;
  fund: FundsEntityFieldsFragment;
  isHighlighted: boolean;
  isAllFundsBeingWithdrawn: boolean;
  sellerFlexBasisCells: [number, number, number, number];
  buyerFlexBasisCells: [number, number, number];
  reload: () => void;
  isTabSellerSelected: boolean;
}

const getNumberWithoutDecimals = (value: string, decimals: string): string => {
  const valueAsNumber = Number(value);
  if (!Number.isInteger(valueAsNumber)) {
    return (valueAsNumber * 10 ** Number(decimals)).toString();
  }
  return BigNumber.from(value)
    .mul(BigNumber.from(10).pow(BigNumber.from(decimals)))
    .toString();
};

const getNumberWithDecimals = (value: string, decimals: string): number => {
  return Number(value) * 10 ** -Number(decimals);
};

export default function FundItem({
  accountId,
  fund,
  buyerFlexBasisCells,
  isTabSellerSelected,
  sellerFlexBasisCells,
  isHighlighted,
  isAllFundsBeingWithdrawn,
  reload
}: Props) {
  const [isBeingWithdrawn, setIsBeingWithdrawn] = useState<boolean>(false);
  const [isWithdrawInvalid, setIsWithdrawInvalid] = useState<boolean>(false);
  const [hasWithdrawError, setHasWithdrawError] = useState<boolean>(false);
  const [isBeingDeposit, setIsBeingDeposit] = useState<boolean>(false);
  const [isDepositInvalid, setIsDepositInvalid] = useState<boolean>(false);
  const [hasDepositError, setHasDepositError] = useState<boolean>(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("0");
  const [amountToDeposit, setAmountToDeposit] = useState<string>("0");
  const withdrawFunds = useWithdrawFunds({
    accountId,
    tokensToWithdraw: [
      {
        address: fund.token.address,
        amount:
          isWithdrawInvalid || !Number(amountToWithdraw)
            ? BigNumber.from("0")
            : BigNumber.from(
                getNumberWithoutDecimals(amountToWithdraw, fund.token.decimals)
              )
      }
    ]
  });
  const depositFunds = useDepositFunds({
    accountId,
    amount:
      isDepositInvalid || !Number(amountToDeposit)
        ? BigNumber.from("0")
        : BigNumber.from(
            getNumberWithoutDecimals(amountToDeposit, fund.token.decimals)
          ),
    tokenAddress: fund.token.address
  });

  const tokenStep = 10 ** -Number(fund.token.decimals);

  const flexBasisCells = isTabSellerSelected
    ? sellerFlexBasisCells
    : buyerFlexBasisCells;

  const formattedTotalFunds = utils.formatUnits(
    BigNumber.from(fund.availableAmount),
    Number(fund.token.decimals)
  );

  return (
    <Table $isHighlighted={isHighlighted}>
      <Cell $hasBorder $flexBasis={flexBasisCells[0]}>
        {fund.token.symbol}
      </Cell>
      <Cell $hasBorder $flexBasis={flexBasisCells[1]}>
        {formattedTotalFunds}
        {(isBeingDeposit || isBeingWithdrawn || isAllFundsBeingWithdrawn) && (
          <Spinner />
        )}
      </Cell>
      <Cell $hasBorder={false} $flexBasis={flexBasisCells[2]}>
        <InputMaxWrapper $hasError={hasWithdrawError || isWithdrawInvalid}>
          {!Number(amountToWithdraw) && (
            <MaxButton
              onClick={() => {
                setAmountToWithdraw(formattedTotalFunds);
                setIsWithdrawInvalid(false);
              }}
            >
              max
            </MaxButton>
          )}
          <Input
            type="number"
            onChange={(e) => {
              const valueStr = e.target.value;
              const value = e.target.valueAsNumber || 0;
              setIsWithdrawInvalid(false);

              const availableFundsBig = getNumberWithDecimals(
                fund.availableAmount,
                fund.token.decimals
              );

              if (value < tokenStep || value > availableFundsBig) {
                setIsWithdrawInvalid(true);
              }

              setAmountToWithdraw(valueStr);
            }}
            value={amountToWithdraw}
            disabled={isBeingWithdrawn}
            step={tokenStep}
            min={0}
          ></Input>
        </InputMaxWrapper>
        <CustomButton
          onClick={async () => {
            try {
              setHasWithdrawError(false);
              setIsBeingWithdrawn(true);
              const tx = await withdrawFunds();
              await tx?.wait();
              setAmountToWithdraw("0");
            } catch (error) {
              console.error(error);
              setHasWithdrawError(true);
            } finally {
              setIsBeingWithdrawn(false);
              reload();
            }
          }}
          theme="secondary"
          size="small"
          disabled={isBeingWithdrawn || isWithdrawInvalid}
        >
          Withdraw
        </CustomButton>
      </Cell>
      {isTabSellerSelected && (
        <Cell $hasBorder={false} $flexBasis={sellerFlexBasisCells[3]}>
          <Input
            type="number"
            step={tokenStep}
            min={0}
            onChange={(e) => {
              const valueStr = e.target.value;
              const value = e.target.valueAsNumber || 0;
              setIsDepositInvalid(false);

              if (value < tokenStep || value > Number.MAX_SAFE_INTEGER) {
                setIsDepositInvalid(true);
              }
              setAmountToDeposit(valueStr);
            }}
            value={amountToDeposit}
            $hasError={hasDepositError || isDepositInvalid}
            disabled={isBeingDeposit}
          ></Input>
          <CustomButton
            onClick={async () => {
              try {
                setHasDepositError(false);
                setIsBeingDeposit(true);
                const tx = await depositFunds();
                await tx?.wait();
                setAmountToDeposit("0");
              } catch (error) {
                console.error(error);
                setHasDepositError(true);
              } finally {
                setIsBeingDeposit(false);
                reload();
              }
            }}
            theme="secondary"
            size="small"
            disabled={isBeingDeposit || isDepositInvalid}
          >
            Deposit
          </CustomButton>
        </Cell>
      )}
    </Table>
  );
}
