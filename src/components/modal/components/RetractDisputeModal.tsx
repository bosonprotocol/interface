import { subgraph } from "@bosonprotocol/react-kit";
import { useState } from "react";
import toast from "react-hot-toast";

import { CONFIG } from "../../../lib/config";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import SimpleError from "../../error/SimpleError";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
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

export function RetractDisputeModal({
  hideModal,
  exchangeId,
  offerName,
  disputeId,
  refetch
}: Props) {
  const coreSDK = useCoreSDK();
  const { showModal } = useModal();
  const [retractDisputeError, setRetractDisputeError] = useState<Error | null>(
    null
  );
  console.log(disputeId, "disputeId");
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
        <Button
          theme="primary"
          onClick={async () => {
            try {
              setRetractDisputeError(null);
              showModal("WAITING_FOR_CONFIRMATION");
              const tx = await coreSDK.retractDispute(exchangeId);
              await tx.wait();
              showModal("TRANSACTION_SUBMITTED", {
                action: "Retract dispute",
                txHash: tx.hash
              });
              if (disputeId) {
                let retractedDispute: subgraph.DisputeFieldsFragment;
                await poll(
                  async () => {
                    retractedDispute = await coreSDK.getDisputeById(disputeId);
                    return retractedDispute.retractedDate;
                  },
                  (retractedDate) => {
                    return !retractedDate;
                  },
                  500
                );
              }
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Raised dispute: ${offerName}`}
                  url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                />
              ));
              refetch();
              hideModal();
            } catch (error) {
              console.error(error);
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("CONFIRMATION_FAILED");
              }
              setRetractDisputeError(error as Error);
            }
          }}
        >
          Confirm Retract
        </Button>
        <Button theme="blank" onClick={hideModal}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
