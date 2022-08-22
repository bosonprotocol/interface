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
}

export default function MakeProposalCore({
  exchange,
  setActiveStep,
  activeStep
}: Props) {
  const formValues = useCreateForm();
  // TODO: remove any
  const isDescribeProblemOK = Object.keys(formValues.errors).length === 0;

  const isReturnProposal = !!formValues.values[
    FormModel.formFields.proposalsTypes.name
  ].find(
    (proposal: { label: string; value: string }) => proposal.value === "return"
  );
  const isRefundProposal = !!formValues.values[
    FormModel.formFields.proposalsTypes.name
  ].find(
    (proposal: { label: string; value: string }) => proposal.value === "refund"
  );
  const isMakeAProposalOK =
    (isRefundProposal &&
      !formValues.errors[FormModel.formFields.refundPercentage.name]) ||
    (!isRefundProposal && isReturnProposal);
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
          onBackClick={() => setActiveStep(activeStep - 1)}
          onNextClick={() => setActiveStep(activeStep + 1)}
          isValid={isMakeAProposalOK}
          exchange={exchange}
        />
      ) : (
        <ReviewAndSubmitStep
          onBackClick={() => setActiveStep(activeStep - 1)}
          isValid={isFormValid}
          exchange={exchange}
        />
      )}
    </>
  );
}
