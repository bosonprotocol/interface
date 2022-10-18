import { ethers } from "ethers";
import * as Yup from "yup";

import { CONFIG } from "../../../../../lib/config";
import { validationMessage } from "../../../../../lib/const/validationMessage";
import { websitePattern } from "../../../../../lib/validation/regex/url";
import { validationOfRequiredImage } from "../../../../product/utils/validationUtils";

const MAX_LOGO_SIZE = 300 * 1024; // 300 KB
const maxLensHandleLength = 31 - CONFIG.lens.lensHandleExtension.length;

const commonFieldsValidation = {
  name: Yup.string().trim().required(validationMessage.required),
  handle: Yup.string()
    .trim()
    .required(validationMessage.required)
    .matches(
      new RegExp(`^[a-z0-9_-]{5,${maxLensHandleLength}}\\s{0}$`),
      `Handle only supports lower case characters, numbers, - and _.\nHandle must be minimum of 5 length and maximum of ${maxLensHandleLength} length`
    ),
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
export const lensProfileValidationSchema = Yup.object({
  logo: validationOfRequiredImage(MAX_LOGO_SIZE),
  coverPicture: validationOfRequiredImage(MAX_LOGO_SIZE),
  ...commonFieldsValidation
});

export const viewLensProfileValidationSchema = Yup.object({
  logo: Yup.mixed<File[]>(),
  coverPicture: Yup.mixed<File[]>(),
  ...commonFieldsValidation
});

export type LensProfileType = Yup.InferType<typeof lensProfileValidationSchema>;

export const bosonAccountValidationSchema = Yup.object({
  secondaryRoyalties: Yup.number()
    .min(0, "Must be greater than or equal to 0%")
    .max(10, "Must be less than or equal to 10%"),
  addressForRoyaltyPayment: Yup.string()
    .trim()
    .test("FORMAT", "Must be an address", (value) =>
      value ? ethers.utils.isAddress(value) : true
    )
});

export type BosonAccount = Yup.InferType<typeof bosonAccountValidationSchema>;
