import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/react-kit";
import { BigNumberish, utils } from "ethers";
import { Info as InfoComponent } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { ProposalItem } from "../../../../pages/chat/types";
import { poll } from "../../../../pages/create-product/utils";
import SimpleError from "../../../error/SimpleError";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../ui/BosonButton";
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

async function resolveDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish,
  buyerPercent: BigNumberish,
  counterpartySig: {
    r: string;
    s: string;
    v: number;
  }
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxResolveDispute({
      exchangeId,
      buyerPercent,
      counterpartySig,
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

export default function ResolveDisputeModal({
  exchange,
  hideModal,
  proposal
}: Props) {
  const { showModal } = useModal();
  const coreSDK = useCoreSDK();
  const { address } = useAccount();
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
        <BosonButton
          variant="primaryFill"
          onClick={async () => {
            try {
              setResolveDisputeError(null);
              const signature = utils.splitSignature(proposal.signature);
              let tx: TransactionResponse;
              showModal("WAITING_FOR_CONFIRMATION");
              const isMetaTx = Boolean(coreSDK?.isMetaTxConfigSet && address);
              if (isMetaTx) {
                tx = await resolveDisputeWithMetaTx(
                  coreSDK,
                  exchange.id,
                  proposal.percentageAmount,
                  signature
                );
              } else {
                tx = await coreSDK.resolveDispute({
                  exchangeId: exchange.id,
                  buyerPercentBasisPoints: proposal.percentageAmount,
                  sigR: signature.r,
                  sigS: signature.s,
                  sigV: signature.v
                });
              }
              showModal("TRANSACTION_SUBMITTED", {
                action: "Raise dispute",
                txHash: tx.hash
              });
              await tx.wait();
              await poll(
                async () => {
                  const resolvedDispute = await coreSDK.getDisputeById(
                    exchange.dispute?.id as BigNumberish
                  );
                  return resolvedDispute.resolvedDate;
                },
                (resolvedDate) => {
                  return !resolvedDate;
                },
                500
              );
              hideModal();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Raised dispute: ${exchange.offer.metadata.name}`}
                  url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                />
              ));
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
        </BosonButton>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
