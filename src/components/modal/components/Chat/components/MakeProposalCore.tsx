import { useFormikContext } from "formik";

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
  const { setFieldValue } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFormikContext<any>();

  const isDescribeProblemOK = Object.keys(formValues.errors).length === 0;

  const onSkipMethod = () => {
    setFieldValue(FormModel.formFields.proposalType.name, null, true);
    setActiveStep(activeStep + 1);
  };

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
          onSkip={() => {
            onSkipMethod();
          }}
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
