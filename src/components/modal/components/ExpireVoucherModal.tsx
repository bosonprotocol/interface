import { ExpireButton, Provider, subgraph } from "@bosonprotocol/react-kit";
import qs from "query-string";
import { useState } from "react";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { AccountQueryParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { getBuyerCancelPenalty } from "../../../lib/utils/getPrices";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import DetailTable from "../../detail/DetailTable";
import SimpleError from "../../error/SimpleError";
import { Spinner } from "../../loading/Spinner";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
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
  border-top: 1px solid ${colors.lightGrey};
  padding-top: 2rem;
`;
const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;
const ConvertedValueWrapper = styled.span`
  margin-left: 0.15rem;
  font-weight: normal;
`;
interface Props {
  exchange: Exchange;
}
export default function ExpireVoucherModal({ exchange }: Props) {
  const coreSDK = useCoreSDK();
  const {
    addPendingTransaction,
    removePendingTransaction,
    reconcilePendingTransactions
  } = useAddPendingTransaction();
  const { hideModal, showModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expireError, setExpireError] = useState<Error | null>(null);
  const { data: signer } = useSigner();
  const navigate = useKeepQueryParamsNavigate();
  const convertedPrice = useConvertedPrice({
    value: exchange.offer.price,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: exchange.offer.exchangeToken.symbol
  });
  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(exchange.offer, convertedPrice);

  const refund =
    Number(exchange.offer.price) -
    (Number(exchange.offer.price) * buyerCancelationPenalty) / 100;

  const convertedRefund = useConvertedPrice({
    value: refund.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: exchange.offer.exchangeToken.symbol
  });
  const showConvertedPrice = !!convertedPrice?.converted;
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
          fontWeight="bold"
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
          color={colors.darkGrey}
          $width="100%"
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
              {
                name: "Item price",
                value: (
                  <>
                    {convertedPrice.price} {exchange.offer.exchangeToken.symbol}
                    {showConvertedPrice && (
                      <ConvertedValueWrapper>
                        ({convertedPrice.currency?.symbol}
                        {convertedPrice?.converted})
                      </ConvertedValueWrapper>
                    )}
                  </>
                )
              },
              {
                name: "Buyer Cancel. Penalty",
                value: (
                  <>
                    -{buyerCancelationPenalty}%
                    {showConvertedPrice && (
                      <ConvertedValueWrapper>
                        ({convertedRefund.currency?.symbol}
                        {convertedBuyerCancelationPenalty})
                      </ConvertedValueWrapper>
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
              {
                name: "Your refund",
                value: (
                  <>
                    {convertedRefund.price}{" "}
                    {exchange.offer.exchangeToken.symbol}
                    {showConvertedPrice && (
                      <ConvertedValueWrapper>
                        ({convertedPrice.currency?.symbol}
                        {convertedRefund?.converted})
                      </ConvertedValueWrapper>
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
            envName={CONFIG.envName}
            disabled={isLoading}
            onError={(error) => {
              console.error(error);
              setExpireError(error);
              setIsLoading(false);
              const hasUserRejectedTx =
                "code" in error &&
                (error as unknown as { code: string }).code ===
                  "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("CONFIRMATION_FAILED");
              }
              reconcilePendingTransactions();
            }}
            onPendingSignature={() => {
              setIsLoading(true);
              setExpireError(null);
              showModal("WAITING_FOR_CONFIRMATION");
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Expire",
                txHash: hash
              });
              addPendingTransaction({
                type: subgraph.EventType.VoucherExpired,
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
                  const expiredExchange = await coreSDK.getExchangeById(
                    exchangeId
                  );
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
              removePendingTransaction(_?.transactionHash);
              navigate({
                pathname: `${BosonRoutes.YourAccount}`,
                search: qs.stringify({
                  [AccountQueryParameters.manageFunds]: "true"
                })
              });
            }}
            web3Provider={signer?.provider as Provider}
            metaTx={CONFIG.metaTx}
          >
            <Grid gap="0.5rem">
              Expire Voucher
              {isLoading && <Spinner size="20" />}
            </Grid>
          </ExpireButton>
          <Button theme="blankOutline" onClick={hideModal}>
            Back
          </Button>
        </Grid>
      </ButtonsWrapper>
    </>
  );
}
