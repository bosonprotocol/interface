import * as Yup from "yup";

import { CONFIG } from "../../../../../lib/config";
import { validationMessage } from "../../../../../lib/const/validationMessage";
import { FileProps } from "../../../../form/Upload/types";
import { validationOfRequiredIpfsImage } from "../../../../product/utils/validationUtils";
import { getCommonFieldsValidation } from "../valitationSchema";

// const MAX_LOGO_SIZE = 300 * 1024; // 300 KB
const maxLensHandleLength = 31 - CONFIG.lens.lensHandleExtension.length;

const commonLensValidationSchema = {
  handle: Yup.string()
    .trim()
    .required(validationMessage.required)
    .matches(
      new RegExp(`^[a-z0-9_-]{5,${maxLensHandleLength}}\\s{0}$`),
      `Handle only supports lower case characters, numbers, - and _.\nHandle must be minimum of 5 length and maximum of ${maxLensHandleLength} length`
    )
};

export const viewLensProfileValidationSchema = Yup.object({
  logo: validationOfRequiredIpfsImage(),
  coverPicture: validationOfRequiredIpfsImage<
    FileProps & { fit?: string; position?: string }
  >(),
  ...getCommonFieldsValidation({ withMaxLengthValidation: true }),
  ...commonLensValidationSchema
});

export type LensProfileType = Yup.InferType<
  typeof viewLensProfileValidationSchema
>;
