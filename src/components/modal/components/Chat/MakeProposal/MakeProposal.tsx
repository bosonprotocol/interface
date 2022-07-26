import { ReactNode, useState } from "react";

import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { ProposalMessage } from "../../../../../pages/chat/types";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import ExchangePreview from "../components/ExchangePreview";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep from "./steps/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  headerComponent: ReactNode;
  setActiveStep: (step: number) => void;
}

export default function MakeProposal({
  exchange,
  hideModal,
  setActiveStep,
  activeStep
}: Props) {
  const [proposal, setProposal] = useState<ProposalMessage["value"]>({
    title: `Proposal`,
    description: "",
    additionalInformation: "",
    proposals: [],
    additionalInformationFiles: []
  });

  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      {activeStep === 0 ? (
        <DescribeProblemStep
          onNextClick={() => setActiveStep(1)}
          setProposal={setProposal}
          proposal={proposal}
        />
      ) : activeStep === 1 ? (
        <MakeAProposalStep onNextClick={() => setActiveStep(2)} />
      ) : (
        <ReviewAndSubmitStep
          onBackClick={() => setActiveStep(1)}
          onSubmit={() => console.log("submit")}
        />
      )}
    </>
  );
}
