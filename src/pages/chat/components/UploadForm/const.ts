import * as Yup from "yup";

import bytesToSize from "../../../../lib/utils/bytesToSize";

export const SUPPORTED_FILE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf"
] as const;

export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export const validationOfFile = ({
  isOptional,
  maxFileSizeInB,
  supportedFormats
}: {
  isOptional: boolean;
  maxFileSizeInB?: number;
  supportedFormats?: string[];
}) => {
  const formats = supportedFormats || SUPPORTED_FILE_FORMATS;
  let schema = Yup.mixed();
  if (isOptional) {
    schema = schema.nullable();
  }
  return schema
    .test("numFiles", `Please upload one file`, (files: File[]) => {
      return isOptional ? true : !!(files || []).length;
    })
    .test(
      "fileSize",
      `File size cannot exceed ${bytesToSize(
        maxFileSizeInB || MAX_FILE_SIZE
      )} (for each file)`,
      (files: File[]) => {
        return (files || []).every(
          (file) => file.size <= (maxFileSizeInB || MAX_FILE_SIZE)
        );
      }
    )
    .test(
      "FILE_FORMAT",
      `Uploaded files have unsupported format. Supported formats are: ${formats.join(
        ","
      )}`,
      (files: File[]) => {
        return (files || []).every((file) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formats.includes(file.type as any)
        );
      }
    );
};
