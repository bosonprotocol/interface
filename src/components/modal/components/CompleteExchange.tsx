import {
  BatchCompleteButton,
  CompleteButton,
  Provider,
  subgraph
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumberish } from "ethers";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import { Offer } from "../../../lib/types/offer";
import { useSigner } from "../../../lib/utils/hooks/ethers/connection";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const CompleteExchangeWrapper = styled.div`
  width: 100%;
`;
const OverflowCompleteExchangeWrapper = styled.div`
  max-height: 15rem;
  width: calc(100% + 2rem);
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
`;
const DescriptionInfo = styled.div`
  width: 100%;
`;

interface OfferProps {
  offer: Offer;
}

function CompleteOffer({ offer }: OfferProps) {
  return (
    <>
      <CompleteExchangeWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem" style={{ flex: "1 1" }}>
            <Image
              src={offer?.metadata?.image}
              showPlaceholderText={false}
              style={{
                width: "4rem",
                height: "4rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
            />
            <div>
              <Typography tag="h5">
                <b>{offer.metadata?.name}</b>
              </Typography>
              <SellerID
                offer={offer}
                buyerOrSeller={offer?.seller}
                withProfileImage
              />
            </div>
          </Grid>
          <div>
            {offer.exchangeToken && (
              <Price
                currencySymbol={offer.exchangeToken.symbol}
                value={offer.price}
                decimals={offer.exchangeToken.decimals}
              />
            )}
          </div>
        </Grid>
      </CompleteExchangeWrapper>
    </>
  );
}

interface Props {
  exchange?: Exchange;
  exchanges?: Array<Exchange | null>;
  refetch: () => void;
}
export default function CompleteExchange({
  exchange,
  exchanges,
  refetch
}: Props) {
  const { config } = useConfigContext();
  const coreSdk = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const signer = useSigner();
  const { hideModal, showModal } = useModal();

  const completeExchangePool = useCallback(
    async (id: BigNumberish) => {
      await poll(
        async () => {
          const batchedExchange = await coreSdk.getExchangeById(id);
          return batchedExchange.completedDate;
        },
        (completedDate) => {
          return !completedDate;
        },
        500
      );
    },
    [coreSdk]
  );

  const batchCompleteExchangePool = useCallback(
    async (ids: BigNumberish[]) => {
      await poll(
        async () => {
          const completedOffers = await Promise.all(
            ids.map(async (id) => {
              return await coreSdk.getExchangeById(id);
            })
          );
          return completedOffers;
        },
        (createdOffers) => {
          return !createdOffers?.every(({ completedDate }) => completedDate);
        },
        500
      );
    },
    [coreSdk]
  );

  const handleSuccess = useCallback(
    async (
      receipt: {
        transactionHash: string;
      },
      payload: {
        exchangeId?: BigNumberish;
        exchangeIds?: BigNumberish[];
      }
    ) => {
      if (payload.exchangeId) {
        await completeExchangePool(payload.exchangeId);
        toast((t) => (
          <SuccessTransactionToast
            t={t}
            action={`Completed exchange: ${exchange?.offer.metadata.name}`}
            url={config.envConfig.getTxExplorerUrl?.(receipt.transactionHash)}
          />
        ));
      } else if (payload.exchangeIds) {
        await batchCompleteExchangePool(payload.exchangeIds);
        toast((t) => (
          <SuccessTransactionToast
            t={t}
            action={`Completed exchanges: ${exchanges
              ?.map((exchange) => exchange?.id)
              .filter((exchange) => exchange)
              .join(",")}`}
            url={config.envConfig.getTxExplorerUrl?.(receipt.transactionHash)}
          />
        ));
      }
      hideModal();
      refetch();
    },
    [
      config.envConfig,
      completeExchangePool,
      exchange,
      exchanges,
      hideModal,
      refetch,
      batchCompleteExchangePool
    ]
  );

  const exchangeIds = useMemo(() => {
    return exchanges?.map((exchange) => exchange?.id as BigNumberish) || [];
  }, [exchanges]);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <Grid flexDirection="column" gap="1rem">
        <DescriptionInfo>
          <Typography tag="h6">What is Complete?</Typography>
          <Typography tag="p" margin="0">
            Exchange completion releases the funds involved in the exchange(s)
            to the relevant parties.
          </Typography>
        </DescriptionInfo>
      </Grid>
      <Break />
      {exchange && <CompleteOffer offer={exchange.offer} />}
      {exchanges && exchanges.length && (
        <OverflowCompleteExchangeWrapper>
          {exchanges?.map(
            (e: Exchange | null) =>
              e !== null && (
                <CompleteOffer
                  key={`exchange_offers_${e?.id}`}
                  offer={e.offer}
                />
              )
          )}
        </OverflowCompleteExchangeWrapper>
      )}
      <Break />
      {exchange?.id && (
        <Grid justifyContent="center">
          <CompleteButton
            variant="primaryFill"
            exchangeId={exchange.id}
            coreSdkConfig={{
              envName: config.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.metaTx
            }}
            onError={(error) => {
              console.error("onError", error);
              const hasUserRejectedTx =
                "code" in error &&
                (error as unknown as { code: string }).code ===
                  "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                Sentry.captureException(error);
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
            }}
            onPendingSignature={() => {
              showModal("WAITING_FOR_CONFIRMATION");
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Complete",
                txHash: hash
              });
              addPendingTransaction({
                type: subgraph.EventType.ExchangeCompleted,
                hash,
                isMetaTx,
                accountType: "Seller",
                exchange: {
                  id: exchange.id
                }
              });
            }}
            onSuccess={(receipt) => {
              handleSuccess(
                {
                  transactionHash: receipt.transactionHash
                },
                {
                  exchangeId: exchange.id
                }
              );
            }}
          />
        </Grid>
      )}
      {exchanges && exchanges.length && (
        <Grid justifyContent="center">
          <BatchCompleteButton
            variant="primaryFill"
            exchangeIds={exchangeIds}
            coreSdkConfig={{
              envName: config.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.metaTx
            }}
            onError={(error) => {
              console.error("onError", error);
              const hasUserRejectedTx =
                "code" in error &&
                (error as unknown as { code: string }).code ===
                  "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                Sentry.captureException(error);
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
            }}
            onPendingSignature={() => {
              showModal("WAITING_FOR_CONFIRMATION");
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Complete",
                txHash: hash
              });
              exchanges.forEach((exchange) => {
                if (exchange) {
                  addPendingTransaction({
                    type: subgraph.EventType.ExchangeCompleted,
                    hash,
                    isMetaTx,
                    accountType: "Seller",
                    exchange: {
                      id: exchange.id
                    }
                  });
                }
              });
            }}
            onSuccess={(receipt) => {
              handleSuccess(
                {
                  transactionHash: receipt.transactionHash
                },
                {
                  exchangeIds: exchangeIds
                }
              );
            }}
          >
            Batch Complete
          </BatchCompleteButton>
        </Grid>
      )}
    </Grid>
  );
}
