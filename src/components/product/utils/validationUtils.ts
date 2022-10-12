import * as Yup from "yup";

import { FileProps } from "../../form/Upload/Upload";

export const validationOfRequiredImage = () =>
  Yup.mixed<FileProps[]>().test(
    "fileUploaded",
    "You need to upload an image",
    (value) => !value || (value && value.length !== 0)
  );
export const validationOfImage = () => Yup.mixed<FileProps[]>().nullable();
