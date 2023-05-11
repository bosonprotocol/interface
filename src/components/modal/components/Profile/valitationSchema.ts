import * as Yup from "yup";

import { validationMessage } from "../../../../lib/const/validationMessage";
import { websitePattern } from "../../../../lib/validation/regex/url";
import { OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE } from "../../../product/utils";

const contactPreferences = OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.map(
  ({ value }) => value
);

export const commonFieldsValidation = {
  name: Yup.string().trim().required(validationMessage.required),
  email: Yup.string()
    .trim()
    .required(validationMessage.required)
    .email("Must be an e-mail"),
  description: Yup.string().trim().required(validationMessage.required),
  website: Yup.string()
    .trim()
    .matches(new RegExp(websitePattern), "This is not a URL")
    .required(validationMessage.required),
  legalTradingName: Yup.string().trim(),
  contactPreference: Yup.object({
    value: Yup.mixed<typeof contactPreferences[number]>()
      .required(validationMessage.required)
      .oneOf(contactPreferences),
    label: Yup.string()
  })
};
