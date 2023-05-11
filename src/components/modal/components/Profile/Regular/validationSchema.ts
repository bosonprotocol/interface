import * as Yup from "yup";

import { validationOfRequiredIpfsImage } from "../../../../product/utils/validationUtils";
import { commonFieldsValidation } from "../valitationSchema";

export const createYourProfileSchema = Yup.object({
  logo: validationOfRequiredIpfsImage(),
  coverPicture: validationOfRequiredIpfsImage(),
  ...commonFieldsValidation
});

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: createYourProfileSchema
});
