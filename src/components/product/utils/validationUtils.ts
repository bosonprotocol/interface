import * as Yup from "yup";

import bytesToSize from "../../../lib/utils/bytesToSize";
import { FileProps } from "../../form/Upload/WithUploadToIpfs";
import { SUPPORTED_FILE_FORMATS } from "./const";

export const validationOfRequiredIpfsImage = () =>
  Yup.mixed<FileProps[]>().test(
    "fileUploaded",
    "You need to upload an image",
    function (value) {
      return !!(value && value?.[0]?.src);
    }
  );

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
      `Image size cannot exceed more than ${bytesToSize(size)}!`,
      (value) =>
        !value || (value && value.length !== 0 && value[0].size <= size)
    )
    .test(
      "FILE_FORMAT",
      "Image has unsupported format!",
      (value) =>
        !value ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
    );

export const validationOfImageFormatIfPresent = () =>
  Yup.mixed<File[]>()
    .test(
      "fileUploaded",
      "You need to upload an image",
      (value) => !value || (value && value.length !== 0)
    )
    .test("FILE_FORMAT", "Image has unsupported format!", (value) => {
      return (
        !(value && value.length > 0) ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
      );
    });

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
      "File has unsupported format!",
      (value) =>
        !(value && value.length > 0) ||
        (value &&
          value.length !== 0 &&
          SUPPORTED_FILE_FORMATS.includes(value[0].type))
    );
