import * as Yup from "yup";

import { validationMessage } from "../../../../lib/const/validationMessage";
import { websitePattern } from "../../../../lib/validation/regex/url";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../product/utils";

const METADATA_LENGTH_LIMIT = 2048;
const contactPreferences = OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.map(
  ({ value }) => value
);

const maxLengthErrorMessage = `Maximum length is ${METADATA_LENGTH_LIMIT} characters`;
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
      .email("Must be an e-mail");
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
