import * as Yup from "yup";

import { validationMessage } from "../../../../lib/const/validationMessage";
import { websitePattern } from "../../../../lib/validation/regex/url";

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
  legalTradingName: Yup.string().trim()
};
