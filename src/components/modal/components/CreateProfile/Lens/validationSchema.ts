import * as Yup from "yup";

import { validationMessage } from "../../../../../lib/const/validationMessage";
import { websitePattern } from "../../../../../lib/validation/regex/url";
import { validationOfRequiredImage } from "../../../../product/utils/validationUtils";

const MAX_LOGO_SIZE = 300 * 1024; // 300 KB

export const lensProfileValidationSchema = Yup.object({
  logo: validationOfRequiredImage(MAX_LOGO_SIZE),
  coverPicture: validationOfRequiredImage(MAX_LOGO_SIZE),
  name: Yup.string().trim().required(validationMessage.required),
  handle: Yup.string()
    .trim()
    .required(validationMessage.required)
    .matches(
      new RegExp("[a-z0-9_-]{5,31}$"),
      "Handle only supports lower case characters, numbers, - and _. Handle must be minimum of 5 length and maximum of 31 length"
    ),
  email: Yup.string().trim().required(validationMessage.required),
  description: Yup.string().trim().required(validationMessage.required),
  website: Yup.string()
    .trim()
    .matches(new RegExp(websitePattern), "This is not a URL")
    .required(validationMessage.required),
  legalTradingName: Yup.string().trim().required(validationMessage.required)
});

export type LensProfileType = Yup.InferType<typeof lensProfileValidationSchema>;

export const bosonAccountValidationSchema = Yup.object({
  secondaryRoyalties: Yup.number().min(0).max(10),
  addressForRoyaltyPayment: Yup.string().trim()
});

export type BosonAccount = Yup.InferType<typeof bosonAccountValidationSchema>;