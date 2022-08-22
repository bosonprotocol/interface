import * as Yup from "yup";

import { FileWithEncodedData } from "../../../../../lib/utils/files";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { validationOfFile } from "../../../../../pages/chat/components/UploadForm/const";
import { NewProposal } from "../../../../../pages/chat/types";
import { useCreateForm } from "../../../../product/utils/useCreateForm";
import { FormModel } from "../MakeProposal/MakeProposalFormModel";
import DescribeProblemStep from "../MakeProposal/steps/DescribeProblemStep";
import MakeAProposalStep from "../MakeProposal/steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "../MakeProposal/steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  sendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => void;
  setActiveStep: (step: number) => void;
}

const validationSchemaPerStep = [
  Yup.object({
    [FormModel.formFields.description.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.description.requiredErrorMessage),
    [FormModel.formFields.upload.name]: validationOfFile({ isOptional: true })
  }),
  Yup.object({
    [FormModel.formFields.refundPercentage.name]: Yup.number()
      .moreThan(0, FormModel.formFields.refundPercentage.moreThanErrorMessage)
      .max(100, FormModel.formFields.refundPercentage.maxErrorMessage)
      .defined(FormModel.formFields.refundPercentage.emptyErrorMessage)
  }),
  Yup.object({})
];

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
