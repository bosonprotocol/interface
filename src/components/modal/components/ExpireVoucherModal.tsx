import { ExpireButton, Provider, subgraph } from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { poll } from "lib/utils/promises";
import qs from "query-string";
import { useState } from "react";
import styled from "styled-components";

import { AccountQueryParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { displayFloat } from "../../../lib/utils/calcPrice";
import { useSigner } from "../../../lib/utils/hooks/connection/connection";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import useRefundData from "../../../lib/utils/hooks/useRefundData";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import DetailTable from "../../detail/DetailTable";
import SimpleError from "../../error/SimpleError";
import { Spinner } from "../../loading/Spinner";
import Button from "../../ui/Button";
import { Grid } from "../../ui/Grid";
import { Typography } from "../../ui/Typography";
import { useModal } from "../useModal";

const Content = styled.div`
  width: 100%;
  margin-top: 0.75rem;
  margin-bottom: 1.9375rem;
  strong {
    margin-right: 0.2rem;
  }
  tbody {
    tr td:first-child {
      width: auto;
    }
    tr td:last-child {
      width: auto;
    }
  }
`;

const ButtonsWrapper = styled.div`
  border-top: 1px solid ${colors.greyLight};
  padding-top: 2rem;
`;
const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;

interface Props {
  exchange: Exchange;
}
export default function ExpireVoucherModal({ exchange }: Props) {
  const { config } = useConfigContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expireError, setExpireError] = useState<Error | null>(null);

  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { hideModal, showModal } = useModal();
  const signer = useSigner();
  const navigate = useKeepQueryParamsNavigate();

  const { currency, price, penalty, refund } = useRefundData(
    exchange,
    exchange.offer.price
  );

  return (
    <>
      <Grid
        flexDirection="column"
        style={{
          padding: "0 2rem"
        }}
      >
        <Typography
          tag="p"
          fontWeight="600"
          textAlign="left"
          margin="0 0 0.25rem 0"
          style={{
            width: "100%"
          }}
        >
          What does this mean?
        </Typography>
        <Typography
          tag="p"
          textAlign="left"
          margin="0"
          color={colors.greyDark}
          width="100%"
          style={{
            width: "100%"
          }}
        >
          Your rNFT is no longer redeemable. In order to withdraw your refunded
          amount, the exchange state must be updated to “Expired”. Upon
          completion, you will be redirected to a page where your funds can be
          withdrawn.
        </Typography>
        <Content>
          <DetailTable
            noBorder
            data={[
              price && {
                name: "Item price",
                value: (
                  <>
                    {displayFloat(price.value)} {currency}
                    {price.show ? (
                      <small>
                        ({price.converted.currency}{" "}
                        {displayFloat(price.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              penalty && {
                name: "Buyer Cancel. Penalty",
                value: (
                  <>
                    -{displayFloat(penalty.value)}%
                    {penalty.show ? (
                      <small>
                        ({penalty.converted.currency}{" "}
                        {displayFloat(penalty.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
          <Line />
          <DetailTable
            noBorder
            tag="strong"
            data={[
              refund && {
                name: "Your refund",
                value: (
                  <>
                    {displayFloat(refund.value)} {currency}
                    {refund.show ? (
                      <small>
                        ({refund.converted.currency}{" "}
                        {displayFloat(refund.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
          {expireError && <SimpleError />}
        </Content>
      </Grid>
      <ButtonsWrapper>
        <Grid
          justifyContent="space-between"
          style={{
            padding: "0 2rem"
          }}
        >
          <ExpireButton
            variant="primaryFill"
            exchangeId={exchange.id}
            coreSdkConfig={{
              envName: config.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.metaTx
            }}
            disabled={isLoading}
            onError={async (error, { txResponse }) => {
              console.error(error);
              setExpireError(error);
              setIsLoading(false);
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
            }}
            onPendingSignature={() => {
              setIsLoading(true);
              setExpireError(null);
              showModal(
                "WAITING_FOR_CONFIRMATION",
                undefined,
                "auto",
                undefined,
                {
                  xs: "400px"
                }
              );
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Expire",
                txHash: hash
              });
              addPendingTransaction({
                type: subgraph.EventType.VOUCHER_EXPIRED,
                hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchange.id
                }
              });
            }}
            onSuccess={async (_, { exchangeId }) => {
              await poll(
                async () => {
                  const expiredExchange =
                    await coreSDK.getExchangeById(exchangeId);
                  return expiredExchange.expired;
                },
                (expired) => {
                  return !expired;
                },
                500
              );
              setIsLoading(false);
              hideModal();
              setExpireError(null);
              navigate({
                pathname: `${BosonRoutes.YourAccount}`,
                search: qs.stringify({
                  [AccountQueryParameters.manageFunds]: "true"
                })
              });
            }}
          >
            <Grid gap="0.5rem">
              Expire Voucher
              {isLoading && <Spinner size="20" />}
            </Grid>
          </ExpireButton>
          <Button themeVal="blankOutline" onClick={hideModal}>
            Back
          </Button>
        </Grid>
      </ButtonsWrapper>
    </>
  );
}
