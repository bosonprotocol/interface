import * as Yup from "yup";

import { FileProps } from "./../../../../components/form/Upload/Upload";

export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf"
];

export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export const validationOfFile = ({ isOptional }: { isOptional: boolean }) => {
  return Yup.mixed()
    .nullable(isOptional ? true : undefined)
    .test(
      "numFiles",
      `Please upload one file`,
      (files: File[] | FileProps[]) => {
        return isOptional ? true : !!(files || []).length;
      }
    );
};
