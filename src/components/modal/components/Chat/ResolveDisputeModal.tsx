import { utils } from "ethers";
import { Info as InfoComponent } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import { CONFIG } from "../../../../lib/config";
import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { ProposalItem } from "../../../../pages/chat/types";
import SimpleError from "../../../error/SimpleError";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { ModalProps } from "../../ModalContext";
import { useModal } from "../../useModal";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";

interface Props {
  exchange: Exchange;
  proposal: ProposalItem;

  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const ProposedSolution = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoComponent)`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function ResolveDisputeModal({
  exchange,
  hideModal,
  proposal
}: Props) {
  const { showModal } = useModal();
  const coreSDK = useCoreSDK();
  const [resolveDisputeError, setResolveDisputeError] = useState<Error | null>(
    null
  );
  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute is resolved and the refund is
        implemented
      </Info>
      {resolveDisputeError && <SimpleError />}
      <ButtonsSection>
        <Button
          theme="primary"
          onClick={async () => {
            try {
              setResolveDisputeError(null);
              const signature = utils.splitSignature(proposal.signature);
              showModal("WAITING_FOR_CONFIRMATION");
              const tx = await coreSDK.resolveDispute({
                exchangeId: exchange.id,
                buyerPercent: proposal.percentageAmount,
                sigR: signature.r,
                sigS: signature.s,
                sigV: signature.v
              });
              showModal("TRANSACTION_SUBMITTED", {
                action: "Escalate dispute",
                txHash: tx.hash
              });
              await tx.wait();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Raised dispute: ${exchange.offer.metadata.name}`}
                  url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                />
              ));
              hideModal();
            } catch (error) {
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("CONFIRMATION_FAILED");
              }
              setResolveDisputeError(error as Error);
            }
          }}
        >
          Accept proposal
        </Button>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
