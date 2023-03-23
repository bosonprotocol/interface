import { subgraph } from "@bosonprotocol/react-kit";
import { Provider, WithdrawFundsButton } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance, useSigner } from "wagmi";

import { CONFIG, config } from "../../../../lib/config";
import { colors } from "../../../../lib/styles/colors";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import {
  getNumberWithDecimals,
  getNumberWithoutDecimals
} from "../../../../pages/account/funds/FundItem";
import { poll } from "../../../../pages/create-product/utils";
import { Spinner } from "../../../loading/Spinner";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
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

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const addPendingTransaction = useAddPendingTransaction();

  const { data: dataBalance, refetch } = useBalance(
    exchangeToken !== ethers.constants.AddressZero
      ? {
          addressOrName: address,
          token: exchangeToken
        }
      : { addressOrName: address }
  );
  const { showModal, hideModal } = useModal();

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

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Withdrawable Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
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
            <Typography $fontSize="0.875rem" margin="0" fontWeight="600">
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
          <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
            Wallet Balance: {dataBalance?.formatted} {dataBalance?.symbol}
          </Typography>
        ) : (
          <div />
        )}
        <WithdrawFundsButton
          accountId={accountId}
          tokensToWithdraw={[
            {
              address: exchangeToken,
              amount:
                isWithdrawInvalid || !Number(amountToWithdraw)
                  ? BigNumber.from("0")
                  : BigNumber.from(
                      getNumberWithoutDecimals(amountToWithdraw, tokenDecimals)
                    )
            }
          ]}
          envName={config.envName}
          disabled={isBeingWithdrawn || isWithdrawInvalid}
          web3Provider={signer?.provider as Provider}
          metaTx={CONFIG.metaTx}
          onPendingSignature={() => {
            setWithdrawError(null);
            setIsBeingWithdrawn(true);
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          onPendingTransaction={(hash, isMetaTx) => {
            showModal("TRANSACTION_SUBMITTED", {
              action: "Finance withdraw",
              txHash: hash
            });
            addPendingTransaction({
              type: subgraph.EventType.FundsWithdrawn,
              hash: hash,
              isMetaTx: isMetaTx,
              accountType: "Account"
            });
          }}
          onSuccess={async () => {
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
            setAmountToWithdraw("0");
            setIsWithdrawInvalid(true);
            hideModal();
            reload();
            setIsBeingWithdrawn(false);
          }}
          onError={(error) => {
            console.error("onError", error);
            Sentry.captureException(error);
            const hasUserRejectedTx =
              "code" in error &&
              (error as unknown as { code: string }).code === "ACTION_REJECTED";
            if (hasUserRejectedTx) {
              showModal("TRANSACTION_FAILED");
            } else {
              showModal("TRANSACTION_FAILED", {
                errorMessage: "Something went wrong"
              });
            }
            setWithdrawError(error);
            reload();
            setIsBeingWithdrawn(false);
          }}
        >
          {isBeingWithdrawn ? (
            <Spinner size={20} />
          ) : (
            <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
              Withdraw {symbol}
            </Typography>
          )}
        </WithdrawFundsButton>
      </Grid>
    </Grid>
  );
}
