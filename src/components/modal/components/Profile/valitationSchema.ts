import * as Yup from "yup";

import { validationMessage } from "../../../../lib/constants/validationMessage";
import { websitePattern } from "../../../../lib/validation/regex/url";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../product/utils";
import { maxLengthErrorMessage, METADATA_LENGTH_LIMIT } from "./const";

const contactPreferences = OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.map(
  ({ value }) => value
);

export const getCommonFieldsValidation = ({
  withMaxLengthValidation
}: {
  withMaxLengthValidation?: boolean;
}) => ({
  name: (() => {
    const validation = Yup.string().trim().required(validationMessage.required);
    return withMaxLengthValidation
      ? validation.max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      : validation;
  })(),
  description: (() => {
    const validation = Yup.string().trim().required(validationMessage.required);
    return withMaxLengthValidation
      ? validation.max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      : validation;
  })(),
  email: (() => {
    const validation = Yup.string()
      .trim()
      .required(validationMessage.required)
      .email("Must be an email");
    return withMaxLengthValidation
      ? validation.max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      : validation;
  })(),
  website: (() => {
    const validation = Yup.string()
      .trim()
      .matches(new RegExp(websitePattern), "This is not a URL")
      .required(validationMessage.required);
    return withMaxLengthValidation
      ? validation.max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      : validation;
  })(),
  legalTradingName: (() => {
    const validation = Yup.string().trim();
    return withMaxLengthValidation
      ? validation.max(METADATA_LENGTH_LIMIT, maxLengthErrorMessage)
      : validation;
  })(),
  contactPreference: Yup.object({
    value: Yup.mixed<typeof contactPreferences[number]>()
      .required(validationMessage.required)
      .oneOf(contactPreferences),
    label: Yup.string()
  })
});
