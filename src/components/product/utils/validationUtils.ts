import * as Yup from "yup";

import bytesToSize from "../../../lib/utils/bytesToSize";
import { SUPPORTED_FILE_FORMATS } from "./const";

export const validationOfRequiredImage = (size: number) =>
  Yup.mixed()
    .test(
      "fileUploaded",
      "You need to provide a logo",
      (value) => !value || (value && value.length !== 0)
    )
    .test(
      "fileSize",
      `File size cannot exceed more than ${bytesToSize(size)}!`,
      (value) =>
        !value || (value && value.length !== 0 && value[0].size <= size)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format!",
      (value) =>
        !value ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
    );

export const validationOfImage = (size: number) =>
  Yup.mixed()
    .test(
      "fileSize",
      `File size cannot exceed more than ${bytesToSize(size)}!`,
      (value) =>
        !value || (value && value.length !== 0 && value[0].size <= size)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format!",
      (value) =>
        !value ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
    );
