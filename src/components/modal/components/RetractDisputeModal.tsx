import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, subgraph } from "@bosonprotocol/react-kit";
import { BigNumberish } from "ethers";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import SimpleError from "../../error/SimpleError";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import BosonButton from "../../ui/BosonButton";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { ModalProps } from "../ModalContext";
import { useModal } from "../useModal";

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  exchangeId: string;
  offerName: string;
  disputeId: string;
  refetch: () => void;
}

async function retractDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxRetractDispute({
      exchangeId,
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

export default function RetractDisputeModal({
  hideModal,
  exchangeId,
  offerName,
  disputeId,
  refetch
}: Props) {
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { showModal } = useModal();
  const { address } = useAccount();
  const [retractDisputeError, setRetractDisputeError] = useState<Error | null>(
    null
  );
  return (
    <Grid flexDirection="column" gap="5rem">
      <div>
        <Typography fontWeight="600">What is Retract?</Typography>
        <Typography>
          If you Cancel your rNFT you default on your commitment to exchange, at
          no fault of the seller. This will result in the return of the item
          price minus the buyer cancelation penalty.
        </Typography>
        {retractDisputeError && <SimpleError />}
      </div>
      <Grid justifyContent="space-between">
        <BosonButton
          variant="primaryFill"
          onClick={async () => {
            try {
              setRetractDisputeError(null);
              let tx: TransactionResponse;
              showModal("WAITING_FOR_CONFIRMATION");
              const isMetaTx = Boolean(coreSDK?.isMetaTxConfigSet && address);
              if (isMetaTx) {
                tx = await retractDisputeWithMetaTx(coreSDK, exchangeId);
              } else {
                tx = await coreSDK.retractDispute(exchangeId);
              }
              showModal("TRANSACTION_SUBMITTED", {
                action: "Retract dispute",
                txHash: tx.hash
              });
              addPendingTransaction({
                type: subgraph.EventType.DisputeRetracted,
                hash: tx.hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchangeId
                }
              });
              await tx.wait();
              await poll(
                async () => {
                  const retractedDispute = await coreSDK.getDisputeById(
                    disputeId
                  );
                  return retractedDispute.retractedDate;
                },
                (retractedDate) => {
                  return !retractedDate;
                },
                500
              );
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Retracted dispute: ${offerName}`}
                  url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                />
              ));
              hideModal();
              refetch();
            } catch (error) {
              console.error(error);
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
              setRetractDisputeError(error as Error);
            }
          }}
        >
          Confirm Retract
        </BosonButton>
        <Button theme="blank" onClick={hideModal}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
