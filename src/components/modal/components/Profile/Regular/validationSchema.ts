import * as Yup from "yup";

import { validationOfRequiredIpfsImage } from "../../../../product/utils/validationUtils";
import { getCommonFieldsValidation } from "../validationSchema";

export const createYourProfileSchema = Yup.object({
  logo: validationOfRequiredIpfsImage(),
  coverPicture: validationOfRequiredIpfsImage(),
  ...getCommonFieldsValidation({ withMaxLengthValidation: true })
});

export const createYourProfileValidationSchema = Yup.object({
  createYourProfile: createYourProfileSchema
});
