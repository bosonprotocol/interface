import { FundsEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { BigNumber, utils } from "ethers";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import { colors } from "../../../lib/styles/colors";
import useDepositFunds from "./useDepositFunds";
import useWithdrawFunds from "./useWithdrawFunds";

export const shakeKeyframes = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;

const Table = styled.div<{ $isHighlighted: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 5px;
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
  ${({ $hasBorder }) => $hasBorder && "border: 1px solid black;"}
  border-radius: 10px;
  gap: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: ${({ $flexBasis }) => `${$flexBasis}%`};
  flex-grow: 0;
  flex-shrink: 1;
  overflow: hidden;
  padding: 0 1px;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 50%;
  font-size: 16px;
  background: transparent;
  border-radius: 5px;
  padding: 0 10px;
  border: 1px solid ${colors.darkGrey};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  ${({ $hasError }) => $hasError && `border: 1px solid ${colors.red};`}
`;

export const CustomButton = styled(Button)`
  border-radius: 10px;
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
  flexBasisCells: [number, number, number, number];
  reload: () => void;
}

const getNumberWithoutDecimals = (value: string, decimals: string) => {
  return Number(value) * 10 ** Number(decimals);
};

const getNumberWithDecimals = (value: string, decimals: string) => {
  return Number(value) * 10 ** -Number(decimals);
};

export default function FundItem({
  accountId,
  fund,
  flexBasisCells,
  isHighlighted,
  isAllFundsBeingWithdrawn,
  reload
}: Props) {
  const [isBeingWithdrawn, setIsBeingWithdrawn] = useState<boolean>(false);
  const [isBeingDeposit, setIsBeingDeposit] = useState<boolean>(false);
  const formattedTotalFunds = utils.formatUnits(
    BigNumber.from(fund.availableAmount),
    Number(fund.token.decimals)
  );
  const [amountToWithdraw, setAmountToWithdraw] =
    useState<string>(formattedTotalFunds);
  // const withdrawAmount = getNumberWithoutDecimals(
  //   amountToWithdraw,
  //   fund.token.decimals
  // );

  const withdrawNoDecimals = getNumberWithoutDecimals(
    amountToWithdraw,
    fund.token.decimals
  );
  // const formattedToWithdraw = utils.formatUnits(
  //   BigNumber.from(withdrawNoDecimals + ""),
  //   Number(fund.token.decimals)
  // );
  const [amountToDeposit, setAmountToDeposit] = useState<string>("0");

  const withdrawFunds = useWithdrawFunds({
    accountId,
    tokensToWithdraw: [
      {
        address: fund.token.address,
        amount: BigNumber.from(withdrawNoDecimals + "")
      }
    ]
  });
  const depositAmount = getNumberWithoutDecimals(
    amountToDeposit,
    fund.token.decimals
  );
  const depositFunds = useDepositFunds({
    accountId,
    amount: BigNumber.from(depositAmount + ""),
    tokenAddress: fund.token.address
  });
  const tokenStep = 10 ** -Number(fund.token.decimals);
  return (
    <Table $isHighlighted={isHighlighted}>
      <Cell $hasBorder $flexBasis={flexBasisCells[0]}>
        {fund.token.name}
      </Cell>
      <Cell $hasBorder $flexBasis={flexBasisCells[1]}>
        {formattedTotalFunds}
        {(isBeingDeposit || isBeingWithdrawn || isAllFundsBeingWithdrawn) && (
          <Spinner />
        )}
      </Cell>
      <Cell $hasBorder={false} $flexBasis={flexBasisCells[2]}>
        <Input
          type="number"
          onChange={(e) => {
            const v = Math.min(
              Number(e.target.value),
              getNumberWithDecimals(fund.availableAmount, fund.token.decimals)
            );
            setAmountToWithdraw(v + "");
          }}
          value={amountToWithdraw}
          step={tokenStep}
          min={0}
        ></Input>
        <CustomButton
          style={{ width: "50%", justifyContent: "center", display: "flex" }}
          onClick={async () => {
            try {
              setIsBeingWithdrawn(true);
              const tx = await withdrawFunds();
              await tx?.wait();
            } catch (error) {
              console.error(error);
            } finally {
              setIsBeingWithdrawn(false);
              reload();
            }
          }}
          theme="secondary"
          size="small"
          disabled={isBeingWithdrawn}
        >
          Withdraw
        </CustomButton>
      </Cell>
      <Cell $hasBorder={false} $flexBasis={flexBasisCells[3]}>
        <Input
          type="number"
          step={tokenStep}
          min={0}
          onChange={(e) => {
            setAmountToDeposit(e.target.value);
          }}
          value={amountToDeposit}
        ></Input>
        <CustomButton
          style={{ width: "50%", justifyContent: "center", display: "flex" }}
          onClick={async () => {
            try {
              setIsBeingDeposit(true);
              const tx = await depositFunds();
              await tx?.wait();
            } catch (error) {
              console.error(error);
            } finally {
              setIsBeingDeposit(false);
              reload();
            }
          }}
          theme="secondary"
          size="small"
          disabled={isBeingDeposit}
        >
          Deposit
        </CustomButton>
      </Cell>
    </Table>
  );
}
