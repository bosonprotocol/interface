import { subgraph } from "@bosonprotocol/react-kit";
import { BigNumber, constants, ethers } from "ethers";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";

import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { getNumberWithoutDecimals } from "../../../../pages/account/funds/FundItem";
import useDepositFunds from "../../../../pages/account/funds/useDepositFunds";
import { poll } from "../../../../pages/create-product/utils";
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
  const { data: dataBalance, refetch } = useBalance(
    exchangeToken !== ethers.constants.AddressZero
      ? {
          addressOrName: address,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token: exchangeToken as any
        }
      : { addressOrName: address }
  );

  const { showModal, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
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

    try {
      if (Number(allowance) < Number(value)) {
        let approveTx;
        // If metaTx, then call metaTx for approval
        const isMetaTx = Boolean(
          coreSDK.checkMetaTxConfigSet({ contractAddress: exchangeToken }) &&
            address
        );
        if (isMetaTx) {
          const { r, s, v, functionSignature } =
            await coreSDK.signNativeMetaTxApproveExchangeToken(
              exchangeToken,
              constants.MaxInt256
            );
          approveTx = await coreSDK.relayNativeMetaTransaction(exchangeToken, {
            functionSignature,
            sigR: r,
            sigS: s,
            sigV: v
          });
        } else {
          approveTx = await coreSDK.approveExchangeToken(
            exchangeToken,
            constants.MaxInt256
          );
        }
        // TODO: add pending approve token tx if even type supported by subgraph
        showModal("TRANSACTION_SUBMITTED", {
          action: "Approve ERC20 Token",
          txHash: approveTx.hash
        });
        await approveTx.wait();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("error->", error);
      // show error in all cases
      showModal("CONFIRMATION_FAILED");
      throw error; // do not go on with the deposit
    }
  };

  const handleSubmitDeposit = async () => {
    {
      try {
        setDepositError(null);
        setIsBeingDeposit(true);
        showModal("WAITING_FOR_CONFIRMATION");
        await approveToken(amountToDeposit);
        const tx = await depositFunds();
        showModal("TRANSACTION_SUBMITTED", {
          action: "Finance deposit",
          txHash: tx.hash
        });
        addPendingTransaction({
          type: subgraph.EventType.FundsDeposited,
          hash: tx.hash,
          isMetaTx: false, // TODO: use correct value if meta tx supported
          accountType: "Seller"
        });
        await tx?.wait();
        await poll(
          async () => {
            const balance = await refetch();
            return balance;
          },
          (balance) => {
            return dataBalance?.formatted === balance.data?.formatted;
          },
          500
        );
        setAmountToDeposit("0");
        setIsDepositInvalid(true);
        hideModal();
      } catch (error) {
        console.error(error);
        const hasUserRejectedTx =
          (error as unknown as { code: string }).code === "ACTION_REJECTED";
        if (hasUserRejectedTx) {
          showModal("CONFIRMATION_FAILED");
        }
        setDepositError(error);
      } finally {
        reload();
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
        <div />
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
