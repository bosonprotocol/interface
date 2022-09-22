import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import { FormModel } from "../MakeProposal/MakeProposalFormModel";
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
  const formValues = useCreateForm();
  const isDescribeProblemOK = Object.keys(formValues.errors).length === 0;

  const isMakeAProposalOK =
    !formValues.errors[FormModel.formFields.refundPercentage.name];
  const isFormValid = isDescribeProblemOK && isMakeAProposalOK;

  return (
    <>
      {activeStep === 2 ? (
        <DescribeProblemStep
          onNextClick={() => setActiveStep(activeStep + 1)}
          isValid={isDescribeProblemOK}
        />
      ) : activeStep === 3 ? (
        <MakeAProposalStep
          onNextClick={() => setActiveStep(activeStep + 1)}
          isValid={isMakeAProposalOK}
          exchange={exchange}
        />
      ) : (
        <ReviewAndSubmitStep
          isValid={isFormValid}
          exchange={exchange}
          submitError={submitError}
        />
      )}
    </>
  );
}
