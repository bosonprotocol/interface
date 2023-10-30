import * as Yup from "yup";

import { MIN_VALUE } from "../../../../../lib/constants/percentages";
import { validationMessage } from "../../../../../lib/constants/validationMessage";
import { validationOfFile } from "../../../../../pages/chat/components/UploadForm/const";

export const FormModel = {
  formFields: {
    description: {
      name: "description",
      requiredErrorMessage: "This field is required"
    },
    proposalType: {
      name: "proposalType"
    },
    refundAmount: {
      name: "refundAmount"
    },
    refundPercentage: {
      name: "refundPercentage",
      moreThanErrorMessage: (minValue: string | number) =>
        `This percentage must be greater than or equal to ${minValue}`,
      maxErrorMessage: "This percentage should be less than or equal to 100",
      emptyErrorMessage: "This field cannot be left empty"
    },
    upload: {
      name: "upload"
    }
  }
} as const;

export const validationSchemaPerStep = [
  Yup.object({
    [FormModel.formFields.description.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.description.requiredErrorMessage),
    [FormModel.formFields.upload.name]: validationOfFile({ isOptional: true })
  }),
  Yup.object({
    [FormModel.formFields.proposalType.name]: Yup.object({
      label: Yup.string().required(validationMessage.required),
      value: Yup.string().required(validationMessage.required)
    })
      .nullable()
      .default({ label: "", value: "" }),
    [FormModel.formFields.refundPercentage.name]: Yup.number()
      .min(
        MIN_VALUE,
        FormModel.formFields.refundPercentage.moreThanErrorMessage(MIN_VALUE)
      )
      .max(100, FormModel.formFields.refundPercentage.maxErrorMessage)
      .defined(FormModel.formFields.refundPercentage.emptyErrorMessage)
  }),
  Yup.object({})
] as const;
