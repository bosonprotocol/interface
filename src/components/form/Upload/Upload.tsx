import { useField } from "formik";
import { Image, Trash } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { colors } from "../../../lib/styles/colors";
import bytesToSize from "../../../lib/utils/bytesToSize";
import { useSaveImageToIpfs } from "../../../lib/utils/hooks/useSaveImageToIpfs";
import ErrorToast from "../../toasts/common/ErrorToast";
import Button from "../../ui/Button";
import Typography from "../../ui/Typography";
import Error from "../Error";
import {
  FieldFileUploadWrapper,
  FieldInput,
  FileUploadWrapper,
  ImagePreview
} from "../Field.styles";
import type { UploadProps } from "../types";
import UploadedFiles from "./UploadedFiles";

export const MAX_FILE_SIZE = 600 * 1024;
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf"
];

export interface FileProps {
  src: string;
  name?: string;
  size?: number;
  type?: string;
}
export default function Upload({
  name,
  accept = "image/*",
  disabled,
  maxSize,
  supportFormats,
  multiple = false,
  trigger,
  onFilesSelect,
  placeholder,
  wrapperProps,
  onLoadSinglePreviewImage,
  ...props
}: UploadProps) {
  const [field, meta, helpers] = useField(name);
  const { saveFile, loadImage, removeFile } = useSaveImageToIpfs();
  const [preview, setPreview] = useState<string | null>();
  const [files, setFiles] = useState<FileProps[]>(field.value || []);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   if (field.value.length > 0 && files.length === 0) {
  //     setFiles(field.value);
  //   }
  // }, [field.value]); // eslint-disable-line

  useEffect(() => {
    onFilesSelect?.(files);
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(files);
    if (!multiple && accept === "image/*" && files && files?.length !== 0) {
      loadImagePreview(files[0]);
    }
  }, [files]); // eslint-disable-line

  const loadImagePreview = async (file: FileProps) => {
    if (!file.src) {
      return false;
    }
    const imagePreview = await loadImage(file?.src);
    setPreview(imagePreview);
    onLoadSinglePreviewImage?.(imagePreview as string);
  };

  const handleChooseFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleRemoveAllFiles = async () => {
    if (disabled) {
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          await removeFile(file?.src);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFiles([]);
    }
  };

  const handleRemoveFile = async (index: number) => {
    try {
      const file = files.find((i, k) => k === index);
      if (file) {
        await removeFile(file?.src);
      }
    } catch (e) {
      console.error(e);
    } finally {
      const newArray = files.filter((i, k) => k !== index);
      setFiles(newArray);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const { files } = e.target;
    const filesArray = Object.values(files);
    const filesErrors: string[] = [];

    for (const file of filesArray) {
      const sizeValidation = maxSize || MAX_FILE_SIZE;
      const formatValidation = supportFormats || SUPPORTED_FORMATS;
      if (file.size > sizeValidation) {
        const err = `File ${
          file.name
        } size cannot exceed more than ${bytesToSize(sizeValidation)}!`;
        // helpers.setError(err);
        filesErrors.push(err);
      }
      if (!formatValidation.includes(file.type)) {
        const err = `Uploaded file has unsupported format of ${file.type}!`;
        // helpers.setError(err);
        filesErrors.push(err);
      }
    }

    if (filesErrors.length > 0) {
      toast((t) => (
        <ErrorToast t={t}>
          <Typography tag="p" color={colors.red}>
            {filesErrors?.map((fileError) => `${fileError}\n`)}
          </Typography>
        </ErrorToast>
      ));
      return false;
    }

    const ipfsArray = [];
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const cid = await saveFile(file);
      ipfsArray.push({
        src: `ipfs://${cid}`,
        name: file.name,
        size: file.size,
        type: file.type
      } as FileProps);
    }
    setFiles(ipfsArray as FileProps[]);
  };

  return (
    <>
      <FieldFileUploadWrapper {...wrapperProps} $disabled={!!disabled}>
        <FieldInput
          {...props}
          hidden
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          ref={(ref) => {
            inputRef.current = ref;
          }}
          disabled={disabled}
        />
        {trigger ? (
          <Button onClick={handleChooseFile} theme="secondary">
            {trigger}
          </Button>
        ) : (
          <FileUploadWrapper
            choosen={files !== null}
            data-disabled={disabled}
            onClick={handleChooseFile}
            error={errorMessage}
          >
            {field.value && field.value?.length !== 0 && preview && (
              <ImagePreview src={preview} />
            )}
            <Image size={24} />
            {placeholder && (
              <Typography tag="p" style={{ marginBottom: "0" }}>
                {placeholder}
              </Typography>
            )}
          </FileUploadWrapper>
        )}
        {!disabled && field.value && field.value?.length !== 0 && preview && (
          <div onClick={handleRemoveAllFiles} data-remove>
            <Trash size={24} color={colors.white} />
          </div>
        )}
        {multiple && (
          <UploadedFiles files={files} handleRemoveFile={handleRemoveFile} />
        )}
      </FieldFileUploadWrapper>
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
