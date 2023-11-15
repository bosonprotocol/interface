import { subgraph } from "@bosonprotocol/react-kit";
import { DepositFundsButton, Provider } from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumber } from "ethers";
import { useExchangeTokenBalance } from "lib/utils/hooks/offer/useExchangeTokenBalance";
import { getNumberWithoutDecimals } from "lib/utils/number";
import { useState } from "react";

import { useSigner } from "../../../../lib/utils/hooks/connection/connection";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
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
  const { config } = useConfigContext();
  const [amountToDepositTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToDeposit, setAmountToDeposit] = useState<string>("0");
  const [isBeingDeposit, setIsBeingDeposit] = useState<boolean>(false);
  const [isDepositInvalid, setIsDepositInvalid] = useState<boolean>(true);
  const [depositError, setDepositError] = useState<unknown>(null);

  const signer = useSigner();
  const { balance: exchangeTokenBalance } = useExchangeTokenBalance({
    address: exchangeToken,
    decimals: tokenDecimals
  });
  const { showModal, hideModal } = useModal();
  const addPendingTransaction = useAddPendingTransaction();

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

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Protocol Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
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
              fontWeight="600"
              textAlign="right"
              style={{
                display: "block"
              }}
            >
              {symbol}
            </Typography>
            <Typography $fontSize="0.625rem" margin="0">
              Balance{" "}
              {exchangeTokenBalance?.toSignificant(Number(tokenDecimals))}
            </Typography>
          </div>
        </InputWrapper>
      </AmountWrapper>
      <Grid>
        <div />
        <DepositFundsButton
          exchangeToken={exchangeToken}
          accountId={accountId}
          amountToDeposit={
            isDepositInvalid || !Number(amountToDeposit)
              ? BigNumber.from("0")
              : BigNumber.from(
                  getNumberWithoutDecimals(amountToDeposit, tokenDecimals)
                )
          }
          coreSdkConfig={{
            envName: config.envName,
            configId: config.envConfig.configId,
            web3Provider: signer?.provider as Provider,
            metaTx: config.metaTx
          }}
          disabled={isBeingDeposit || isDepositInvalid}
          onPendingSignature={() => {
            setDepositError(null);
            setIsBeingDeposit(true);
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          onPendingTransaction={(hash, isMetaTx, actionName) => {
            switch (actionName) {
              case "approveExchangeToken":
                showModal("TRANSACTION_SUBMITTED", {
                  action: "Approve ERC20 Token",
                  txHash: hash
                });
                break;
              case "depositFunds":
                showModal("TRANSACTION_SUBMITTED", {
                  action: "Finance deposit",
                  txHash: hash
                });
                addPendingTransaction({
                  type: subgraph.EventType.FundsDeposited,
                  hash: hash,
                  isMetaTx,
                  accountType: "Seller"
                });
                break;
              default:
                Sentry.captureException(actionName);
                break;
            }
          }}
          onSuccess={async () => {
            // TODO: test if this is necessary
            // await poll(
            //   async () => {
            //     const balance = await refetch();
            //     return balance;
            //   },
            //   (balance) => {
            //     return dataBalance?.formatted === balance.data?.formatted;
            //   },
            //   500
            // );
            setAmountToDeposit("0");
            setIsDepositInvalid(true);
            reload();
            setIsBeingDeposit(false);
            hideModal();
          }}
          onError={async (error, { txResponse }) => {
            console.error("onError", error);
            const hasUserRejectedTx = getHasUserRejectedTx(error);
            if (hasUserRejectedTx) {
              showModal("TRANSACTION_FAILED");
            } else {
              Sentry.captureException(error);
              showModal("TRANSACTION_FAILED", {
                errorMessage: "Something went wrong",
                detailedErrorMessage: await extractUserFriendlyError(error, {
                  txResponse,
                  provider: signer?.provider as Provider
                })
              });
            }
            setDepositError(error);
            reload();
            setIsBeingDeposit(false);
          }}
        >
          {isBeingDeposit ? (
            <Spinner size={20} />
          ) : (
            <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
              Deposit {symbol}
            </Typography>
          )}
        </DepositFundsButton>
      </Grid>
    </Grid>
  );
}
