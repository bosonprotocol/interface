import * as Yup from "yup";

import bytesToSize from "../../../lib/utils/bytesToSize";
import { FileProps } from "../../form/Upload/WithUploadToIpfs";
import { SUPPORTED_FILE_FORMATS } from "./const";

export const validationOfRequiredIpfsImage = () =>
  Yup.mixed<FileProps[]>().test("fileUploaded", function (value) {
    console.log("YUP value", value);
    if (!value || (value && value.length !== 0)) {
      throw this.createError({
        path: this.path,
        message: "You need to upload file!"
      });
    }
    return true;
  });

export const validationOfIpfsImage = () => Yup.mixed<FileProps[]>();

export const validationOfRequiredImage = (size: number) =>
  Yup.mixed<File[]>()
    .test(
      "fileUploaded",
      "You need to upload an image",
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
    .nullable()
    .test(
      "fileSize",
      `File size cannot exceed more than ${bytesToSize(size)}!`,
      (value) =>
        !(value && value.length > 0) ||
        (value && value.length !== 0 && value[0].size <= size)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format!",
      (value) =>
        !(value && value.length > 0) ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
    );
