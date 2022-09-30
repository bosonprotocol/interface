import * as Yup from "yup";

import { validationMessage } from "../../../../../lib/const/validationMessage";
import { MAX_LOGO_SIZE } from "../../../../product/utils";
import { validationOfRequiredImage } from "../../../../product/utils/validationUtils";

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: Yup.object({
    logo: validationOfRequiredImage(MAX_LOGO_SIZE),
    name: Yup.string().trim().required(validationMessage.required),
    email: Yup.string().trim().required(validationMessage.required),
    description: Yup.string().trim().required(validationMessage.required),
    website: Yup.string().trim().required(validationMessage.required)
  })
});
