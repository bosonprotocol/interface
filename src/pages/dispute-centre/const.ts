import { proposals } from "components/modal/components/Chat/MakeProposal/steps/MakeAProposalStep/MakeAProposalStep";
import { useFormikContext } from "formik";
import { validationMessage } from "lib/const/validationMessage";
import { MIN_VALUE } from "lib/constants/percentages";
import { validationOfFile } from "pages/chat/components/UploadForm/const";
import * as Yup from "yup";

export const disputeCentreInitialValues = {
  getStarted: "",
  tellUsMore: "",
  description: "",
  proposalType: proposals[0],
  refundAmount: "0",
  refundPercentage: 0,
  upload: [] as File[]
} as const;

export const disputeCentreValidationSchemaGetStarted = Yup.object({
  getStarted: Yup.string().required(validationMessage.required)
});

export const disputeCentreValidationSchemaTellUsMore = Yup.object({
  tellUsMore: Yup.string().required(validationMessage.required)
});

export const disputeCentreValidationSchemaAdditionalInformation = Yup.object({
  description: Yup.string().trim().required(validationMessage.required),
  upload: validationOfFile({ isOptional: true })
});

export const disputeCentreValidationSchemaMakeProposal = Yup.object({
  proposalType: Yup.object({
    label: Yup.string().required(validationMessage.required),
    value: Yup.string().required(validationMessage.required)
  }).nullable(),
  refundPercentage: Yup.number().when("proposalType", (proposalType) => {
    if (proposalType) {
      return Yup.number()
        .min(
          MIN_VALUE,
          `This percentage must be greater than or equal to ${MIN_VALUE}`
        )
        .max(100, "This percentage should be less than or equal to 100")
        .defined("This field cannot be left empty");
    } else {
      return Yup.number();
    }
  })
});

export const disputeCentreValidationSchemaProposalSummary = Yup.object({});

type DisputeForm = Yup.InferType<
  typeof disputeCentreValidationSchemaGetStarted
> &
  Yup.InferType<typeof disputeCentreValidationSchemaTellUsMore> &
  Yup.InferType<typeof disputeCentreValidationSchemaAdditionalInformation> &
  Yup.InferType<typeof disputeCentreValidationSchemaMakeProposal> &
  Yup.InferType<typeof disputeCentreValidationSchemaProposalSummary>;

export const useDisputeForm = () => useFormikContext<DisputeForm>();
