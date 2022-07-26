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
  const [proposal, setProposal] = useState<ProposalMessage["value"]>(
    {} as ProposalMessage["value"]
  );
  if (![0, 1, 2].includes(activeStep)) {
    return <p>Please close the modal and open it again</p>;
  }
  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <p>activeStep: {activeStep}</p>
      <button onClick={() => activeStep}>activeStep: {activeStep}</button>
      {activeStep === 0 ? (
        <DescribeProblemStep onNextClick={() => setActiveStep(1)} />
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
