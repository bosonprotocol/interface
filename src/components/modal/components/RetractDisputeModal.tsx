import { useState } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import SimpleError from "../../error/SimpleError";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { ModalProps } from "../ModalContext";

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  exchangeId: string;
}

export function RetractDisputeModal({ hideModal, exchangeId }: Props) {
  const coreSDK = useCoreSDK();
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
        <Button
          theme="primary"
          onClick={async () => {
            try {
              setRetractDisputeError(null);
              const tx = await coreSDK.retractDispute(exchangeId);
              await tx.wait();
              hideModal();
            } catch (error) {
              console.error(error);
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
