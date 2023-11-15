import { TransactionResponse } from "@bosonprotocol/common";
import {
  CoreSDK,
  Provider,
  subgraph,
  VoidButton
} from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumberish } from "ethers";
import { poll } from "lib/utils/promises";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { useSigner } from "../../../lib/utils/hooks/connection/connection";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import OfferVariation from "../../seller/products/OfferVariation";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const OfferWrapper = styled.div`
  width: 100%;
`;
const OverflowOfferWrapper = styled.div`
  max-height: 15rem;
  width: calc(100% + 2rem);
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
`;

const VoidButtonWrapper = styled.div`
  button {
    background: transparent;
    border-color: ${colors.orange};
    color: ${colors.orange};
    &:hover {
      background: ${colors.orange};
      border-color: ${colors.orange};
      color: ${colors.white};
    }
  }
`;

const StyledBatchVoidButton = styled(BosonButton)`
  background: transparent;
  border-color: ${colors.orange};
  color: ${colors.orange};
  &:hover {
    background: ${colors.orange};
    border-color: ${colors.orange};
    color: ${colors.white};
  }
`;

interface OfferProps {
  offer: Offer;
  single?: boolean;
}

function VoidProductOffer({ offer, single = false }: OfferProps) {
  const color = (
    offer.metadata as subgraph.ProductV1MetadataEntity
  )?.attributes?.find(
    (attribute) => attribute?.traitType?.toLowerCase() === "color"
  )?.value;
  const size = (
    offer.metadata as subgraph.ProductV1MetadataEntity
  )?.attributes?.find(
    (attribute) => attribute?.traitType?.toLowerCase() === "size"
  )?.value;
  return (
    <>
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid
            justifyContent="flex-start"
            gap="1rem"
            flexGrow="1"
            flexShrink="1"
            flexBasis="0%"
          >
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
              <Typography tag="h5" margin="0">
                <b>{offer.metadata?.name}</b>
              </Typography>
              <OfferVariation color={color} size={size} />
              <div style={{ marginTop: "0.5rem" }}>
                <SellerID
                  offer={offer}
                  buyerOrSeller={offer?.seller}
                  withProfileImage
                />
              </div>
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
            {!single && (
              <Typography
                tag="p"
                justifyContent="flex-end"
                margin="0"
                gap="0.5rem"
              >
                Qty:
                <b>
                  {offer.quantityAvailable}/{offer.quantityInitial}
                </b>
              </Typography>
            )}
          </div>
        </Grid>
      </OfferWrapper>
      {single && (
        <Grid flexDirection="column" gap="1rem">
          <Grid>
            <Typography tag="p" margin="0">
              <b>Quantity</b>&nbsp;&nbsp;(available/total)
            </Typography>
            <Typography tag="p" margin="0">
              <b>
                {offer.quantityAvailable}/{offer.quantityInitial}
              </b>
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}

async function voidOfferBatchWithMetaTx(
  coreSdk: CoreSDK,
  offerIds: BigNumberish[]
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxVoidOfferBatch({
      offerIds,
      nonce
    });
  return coreSdk.relayMetaTransaction({
    functionName,
    functionSignature,
    sigR: r,
    sigS: s,
    sigV: v,
    nonce
  });
}

interface Props {
  offer?: Offer;
  offers?: Array<Offer | null>;
  offerId?: string;
  refetch: () => void;
}
export default function VoidProduct({
  offerId,
  offer,
  offers,
  refetch
}: Props) {
  const { config } = useConfigContext();
  const { showModal } = useModal();
  const coreSdk = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signer = useSigner();
  const { hideModal } = useModal();

  const handleFinish = useCallback(() => {
    hideModal();
    refetch();
    setIsLoading(false);
  }, [hideModal, refetch, setIsLoading]);

  const voidPool = useCallback(
    async (id: BigNumberish) => {
      await poll(
        async () => {
          if (id) {
            const createdOffer = await coreSdk.getOfferById(id);
            return createdOffer.voided;
          }
        },
        (voided) => {
          return !voided;
        },
        500
      );
    },
    [coreSdk]
  );

  const batchVoidPool = useCallback(
    async (ids: BigNumberish[]) => {
      await poll(
        async () => {
          const createdOffers = await Promise.all(
            ids.map(async (id) => {
              return await coreSdk.getOfferById(id);
            })
          );
          return createdOffers;
        },
        (createdOffers) => {
          return !createdOffers?.every(({ voided }) => voided);
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
        offerId?: BigNumberish;
        offerIds?: BigNumberish[];
      }
    ) => {
      if (payload.offerId) {
        await voidPool(payload.offerId);
      } else if (payload.offerIds) {
        await batchVoidPool(payload.offerIds);
      }
      const text = offer
        ? `Voided offer: ${offer?.metadata.name}`
        : `Voided offers: ${payload.offerIds?.join(",")}`;
      toast((t) => (
        <SuccessTransactionToast
          t={t}
          action={text}
          url={config.envConfig.getTxExplorerUrl?.(receipt.transactionHash)}
        />
      ));
      handleFinish();
    },
    [batchVoidPool, handleFinish, offer, voidPool, config.envConfig]
  );

  const handleBatchVoid = useCallback(async () => {
    const offerIds: BigNumberish[] =
      offers?.map((offer) => offer?.id as BigNumberish) || [];

    try {
      setIsLoading(true);
      let txResponse: TransactionResponse;
      const isMetaTx = Boolean(coreSdk?.isMetaTxConfigSet && signer);
      if (isMetaTx) {
        txResponse = await voidOfferBatchWithMetaTx(coreSdk, offerIds);
      } else {
        txResponse = await coreSdk.voidOfferBatch(offerIds);
      }
      const txHash = txResponse.hash;
      await txResponse.wait();
      handleSuccess(
        {
          transactionHash: txHash
        },
        {
          offerIds
        }
      );
    } catch (error) {
      console.error("onError", error);
      Sentry.captureException(error);
    }
  }, [offers, coreSdk, signer, handleSuccess]);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <Grid flexDirection="column" gap="1rem">
        <div>
          <Typography tag="h6">What is Void?</Typography>
          <Typography tag="p" margin="0">
            {offers && offers.length
              ? "By voiding these items, it will no longer be possible for buyers to commit to these products however any existing exchanges will be unaffected."
              : "By voiding this item, it will no longer be possible for buyers to commit to this product however any existing exchanges will be unaffected."}
          </Typography>
        </div>
      </Grid>
      <Break />
      {offer && <VoidProductOffer offer={offer} single />}
      {offers && !!offers.length && (
        <OverflowOfferWrapper>
          {offers?.map(
            (o: Offer | null) =>
              o !== null && (
                <VoidProductOffer key={`offers_${o?.id}`} offer={o} />
              )
          )}
        </OverflowOfferWrapper>
      )}
      <Break />
      {offer && (
        <Grid justifyContent="center">
          <VoidButtonWrapper>
            <VoidButton
              variant="accentInverted"
              coreSdkConfig={{
                envName: config.envName,
                configId: config.envConfig.configId,
                web3Provider: signer?.provider as Provider,
                metaTx: config.metaTx
              }}
              offerId={offerId || 0}
              onError={async (error, { txResponse }) => {
                console.error("onError", error);
                const hasUserRejectedTx = getHasUserRejectedTx(error);
                if (hasUserRejectedTx) {
                  showModal("TRANSACTION_FAILED");
                } else {
                  Sentry.captureException(error);
                  showModal("TRANSACTION_FAILED", {
                    errorMessage: "Something went wrong",
                    detailedErrorMessage: await extractUserFriendlyError(
                      error,
                      {
                        txResponse,
                        provider: signer?.provider as Provider
                      }
                    )
                  });
                }
              }}
              onPendingSignature={() => {
                showModal("WAITING_FOR_CONFIRMATION");
              }}
              onPendingTransaction={(hash, isMetaTx) => {
                showModal("TRANSACTION_SUBMITTED", {
                  action: "Void",
                  txHash: hash
                });
                addPendingTransaction({
                  type: subgraph.EventType.OfferVoided,
                  hash,
                  isMetaTx,
                  accountType: "Seller",
                  offer: {
                    id: offer.id
                  }
                });
              }}
              onSuccess={handleSuccess}
            />
          </VoidButtonWrapper>
        </Grid>
      )}
      {offers && !!offers.length && (
        <Grid justifyContent="center">
          <StyledBatchVoidButton
            variant="accentInverted"
            loading={isLoading}
            disabled={isLoading}
            onClick={handleBatchVoid}
          >
            Batch Void
          </StyledBatchVoidButton>
        </Grid>
      )}
    </Grid>
  );
}
