import { BigNumber, constants } from "ethers";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";

import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { getNumberWithoutDecimals } from "../../../../pages/account/funds/FundItem";
import useDepositFunds from "../../../../pages/account/funds/useDepositFunds";
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

interface Props {
  protocolBalance: string;
  symbol: string;
  accountId: string;
  tokenDecimals: string;
  exchangeToken: string;
  reload: () => void;
}

export default function FinanceDeposit({
  protocolBalance,
  symbol,
  accountId,
  exchangeToken,
  tokenDecimals,
  reload
}: Props) {
  const [amountToDepositTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToDeposit, setAmountToDeposit] = useState<string>("0");
  const [isBeingDeposit, setIsBeingDeposit] = useState<boolean>(false);
  const [isDepositInvalid, setIsDepositInvalid] = useState<boolean>(true);
  const [depositError, setDepositError] = useState<unknown>(null);

  const { address } = useAccount();
  const { data: dataBalance } = useBalance({
    addressOrName: address
  });

  const { hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const depositFunds = useDepositFunds({
    accountId,
    amount:
      isDepositInvalid || !Number(amountToDeposit)
        ? BigNumber.from("0")
        : BigNumber.from(
            getNumberWithoutDecimals(amountToDeposit, tokenDecimals)
          ),
    tokenAddress: exchangeToken
  });

  const tokenStep = 10 ** -Number(tokenDecimals);
  const step = 0.01;

  const handleChangeDepositAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmountToDepositTouched(true);
    const valueStr = e.target.value;
    const value = e.target.valueAsNumber || 0;
    setIsDepositInvalid(false);
    setDepositError(null);
    if (value < tokenStep || value > Number.MAX_SAFE_INTEGER) {
      setIsDepositInvalid(true);
    }
    setAmountToDeposit(valueStr);
  };

  const approveToken = async (value: string) => {
    const isNativeCoin = constants.AddressZero === exchangeToken;
    if (isNativeCoin) {
      return;
    }
    const allowance = await coreSDK.getExchangeTokenAllowance(exchangeToken);

    if (Number(allowance) < Number(value)) {
      const tx = await coreSDK.approveExchangeToken(
        exchangeToken,
        constants.MaxInt256
      );
      await tx.wait();
    }
  };

  const handleSubmitDeposit = async () => {
    {
      try {
        setDepositError(null);
        setIsBeingDeposit(true);
        await approveToken(amountToDeposit);
        const tx = await depositFunds();
        await tx?.wait();
        setAmountToDeposit("0");
        setIsDepositInvalid(true);
        reload();
        hideModal();
      } catch (error) {
        console.error(error);
        setDepositError(error);
        reload();
      } finally {
        setIsBeingDeposit(false);
      }
    }
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Protocol Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
        Choose Amount To Deposit:
      </Typography>
      <AmountWrapper>
        <InputWrapper
          $hasError={
            !!depositError || (isDepositInvalid && amountToDepositTouched)
          }
        >
          <Input
            type="number"
            step={step}
            min={0}
            onChange={handleChangeDepositAmount}
            value={amountToDeposit}
            disabled={isBeingDeposit}
          />
          <div>
            <Typography
              $fontSize="0.875rem"
              margin="0"
              fontWeight="bold"
              textAlign="right"
              style={{
                display: "block"
              }}
            >
              {symbol}
            </Typography>
            <Typography $fontSize="0.625rem" margin="0">
              Balance {dataBalance?.formatted}
            </Typography>
          </div>
        </InputWrapper>
      </AmountWrapper>
      <Grid>
        <CTAButton
          theme="primary"
          size="small"
          onClick={handleSubmitDeposit}
          disabled={isBeingDeposit || isDepositInvalid}
        >
          {isBeingDeposit ? (
            <Spinner size={20} />
          ) : (
            <Typography
              tag="p"
              margin="0"
              $fontSize="0.75rem"
              fontWeight="bold"
            >
              Deposit {symbol}
            </Typography>
          )}
        </CTAButton>
      </Grid>
    </Grid>
  );
}
