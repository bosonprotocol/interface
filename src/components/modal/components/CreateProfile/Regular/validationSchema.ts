import * as Yup from "yup";

import { validationMessage } from "../../../../../lib/const/validationMessage";
import { validationOfRequiredIpfsImage } from "../../../../product/utils/validationUtils";

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: Yup.object({
    logo: validationOfRequiredIpfsImage(),
    name: Yup.string().trim().required(validationMessage.required),
    email: Yup.string()
      .trim()
      .required(validationMessage.required)
      .email("Must be an e-mail"),
    description: Yup.string().trim().required(validationMessage.required),
    website: Yup.string().trim().required(validationMessage.required)
  })
});
