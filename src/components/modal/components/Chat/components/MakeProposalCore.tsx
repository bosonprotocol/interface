import { useDisputeForm } from "pages/dispute-centre/const";

import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import DescribeProblemStep from "../MakeProposal/steps/DescribeProblemStep";
import MakeAProposalStep from "../MakeProposal/steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "../MakeProposal/steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  setActiveStep: (step: number) => void;
  submitError: Error | null;
}

export default function MakeProposalCore({
  exchange,
  setActiveStep,
  activeStep,
  submitError
}: Props) {
  const formValues = useDisputeForm();

  const isDescribeProblemOK = Object.keys(formValues.errors).length === 0;

  return (
    <>
      {activeStep === 2 ? (
        <DescribeProblemStep
          onNextClick={() => setActiveStep(activeStep + 1)}
          isValid={isDescribeProblemOK}
        />
      ) : activeStep === 3 ? (
        <MakeAProposalStep
          onNextClick={() => {
            setActiveStep(activeStep + 1);
          }}
          isValid={isDescribeProblemOK}
          exchange={exchange}
        />
      ) : (
        <ReviewAndSubmitStep
          isValid={isDescribeProblemOK}
          exchange={exchange}
          submitError={submitError}
        />
      )}
    </>
  );
}
