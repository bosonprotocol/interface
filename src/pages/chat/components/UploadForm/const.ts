import * as Yup from "yup";

import bytesToSize from "../../../../lib/utils/bytesToSize";

export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf"
];

export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export const validationOfFile = ({ isOptional }: { isOptional: boolean }) =>
  Yup.mixed()
    .nullable(isOptional ? true : undefined)
    .test("numFiles", `Please upload one file`, (files: File[]) => {
      return isOptional ? true : !!files.length;
    })
    .test(
      "fileSize",
      `File size cannot exceed ${bytesToSize(MAX_FILE_SIZE)} (for each file)`,
      (files: File[]) => {
        return files.every((file) => file.size <= MAX_FILE_SIZE);
      }
    )
    .test(
      "FILE_FORMAT",
      "Uploaded files have unsupported format",
      (files: File[]) => {
        return files.every((file) =>
          SUPPORTED_FILE_FORMATS.includes(file.type)
        );
      }
    );
