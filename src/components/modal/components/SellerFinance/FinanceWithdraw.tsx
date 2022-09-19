import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance } from "wagmi";

import { colors } from "../../../../lib/styles/colors";
import {
  getNumberWithDecimals,
  getNumberWithoutDecimals
} from "../../../../pages/account/funds/FundItem";
import useWithdrawFunds from "../../../../pages/account/funds/useWithdrawFunds";
import { Spinner } from "../../../loading/Spinner";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
  CTAButton,
  Input,
  InputWrapper,
  ProtocolStrong
} from "./FinancesStyles";

const MaxLimitWrapper = styled.div`
  color: ${colors.grey};
  margin-top: 0.25rem;
`;

interface Props {
  protocolBalance: string;
  symbol: string;
  accountId: string;
  tokenDecimals: string;
  exchangeToken: string;
  availableAmount: string;
  reload: () => void;
}

export default function FinanceWithdraw({
  protocolBalance,
  symbol,
  accountId,
  exchangeToken,
  tokenDecimals,
  reload,
  availableAmount
}: Props) {
  const [amountToWithdrawTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("0");
  const [isBeingWithdrawn, setIsBeingWithdrawn] = useState<boolean>(false);
  const [isWithdrawInvalid, setIsWithdrawInvalid] = useState<boolean>(true);
  const [withdrawError, setWithdrawError] = useState<unknown>(null);

  const { address } = useAccount();

  const { data: dataBalance } = useBalance(
    exchangeToken !== ethers.constants.AddressZero
      ? {
          addressOrName: address,
          token: exchangeToken
        }
      : { addressOrName: address }
  );

  const { hideModal } = useModal();
  const withdrawFunds = useWithdrawFunds({
    accountId,
    tokensToWithdraw: [
      {
        address: exchangeToken,
        amount:
          isWithdrawInvalid || !Number(amountToWithdraw)
            ? BigNumber.from("0")
            : BigNumber.from(
                getNumberWithoutDecimals(amountToWithdraw, tokenDecimals)
              )
      }
    ]
  });

  const tokenStep = 10 ** -Number(tokenDecimals);
  const step = 0.01;

  const handleChangeWithdrawAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmountToDepositTouched(true);
    const valueStr = e.target.value;
    const value = e.target.valueAsNumber || 0;
    setIsWithdrawInvalid(false);

    const availableFundsBig = getNumberWithDecimals(
      availableAmount,
      tokenDecimals
    );

    if (value < tokenStep || value > availableFundsBig || !value) {
      setIsWithdrawInvalid(true);
    }

    setAmountToWithdraw(valueStr);
  };

  const handleWithdraw = async () => {
    {
      try {
        setWithdrawError(null);
        setIsBeingWithdrawn(true);
        const tx = await withdrawFunds();
        await tx?.wait();
        setAmountToWithdraw("0");
        setIsWithdrawInvalid(true);
        reload();
        hideModal();
      } catch (error) {
        console.error(error);
        setWithdrawError(error);
        reload();
        hideModal();
      } finally {
        setIsBeingWithdrawn(false);
      }
    }
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Withdrawable Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
        Enter Amount To Withdraw:
      </Typography>
      <AmountWrapper>
        <InputWrapper
          $hasError={
            !!withdrawError || (isWithdrawInvalid && amountToWithdrawTouched)
          }
        >
          <Input
            type="number"
            step={step}
            min={0}
            onChange={handleChangeWithdrawAmount}
            value={amountToWithdraw}
            disabled={isBeingWithdrawn}
          />
          <div>
            <Typography $fontSize="0.875rem" margin="0" fontWeight="bold">
              {symbol}
            </Typography>
          </div>
        </InputWrapper>
        <MaxLimitWrapper>
          <Typography tag="p" $fontSize="0.75rem" margin="0">
            (Max Limit {protocolBalance} {symbol})
          </Typography>
        </MaxLimitWrapper>
      </AmountWrapper>
      <Grid>
        {dataBalance ? (
          <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
            Wallet Balance: {dataBalance?.formatted} {dataBalance?.symbol}
          </Typography>
        ) : (
          <div />
        )}
        <CTAButton
          theme="primary"
          size="small"
          onClick={handleWithdraw}
          disabled={isBeingWithdrawn || isWithdrawInvalid}
        >
          {isBeingWithdrawn ? (
            <Spinner size={20} />
          ) : (
            <Typography
              tag="p"
              margin="0"
              $fontSize="0.75rem"
              fontWeight="bold"
            >
              Withdraw {symbol}
            </Typography>
          )}
        </CTAButton>
      </Grid>
    </Grid>
  );
}
