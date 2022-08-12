import { useField } from "formik";
import { Image, Trash } from "phosphor-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { colors } from "../../../lib/styles/colors";
import bytesToSize from "../../../lib/utils/bytesToSize";
import { useLocalStorage } from "../../../lib/utils/hooks/useLocalStorage";
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

export default function Upload({
  name,
  accept = "image/*",
  disabled,
  maxSize,
  multiple = false,
  trigger,
  onFilesSelect,
  placeholder,
  files: initialFiles,
  wrapperProps,
  ...props
}: UploadProps) {
  const fileName = useMemo(() => `create-product-image_${name}`, [name]);
  const [preview, setPreview, removePreview] = useLocalStorage<string | null>(
    fileName,
    null
  );

  const [field, meta, helpers] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    onFilesSelect?.(files);
    helpers.setValue(files);

    if (!multiple && accept === "image/*" && files.length !== 0) {
      const reader = new FileReader();
      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        const prev = e.target?.result?.toString() || null;
        setPreview(prev);
      };
      reader.readAsDataURL(files[0]);
    }
  }, [files]); // eslint-disable-line

  const handleChooseFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setPreview(null);
    removePreview(fileName);
  };

  const handleRemoveFile = (index: number) => {
    const newArray = files.filter((i, k) => k !== index);
    setFiles(newArray);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }

    if (!e.target.files) {
      return;
    }
    const { files } = e.target;
    const filesArray = Object.values(files);
    for (const file of filesArray) {
      if (maxSize) {
        if (file.size > maxSize) {
          // TODO: change to notification
          console.error(
            `File size cannot exceed more than ${bytesToSize(maxSize)}`
          );
          return;
        }
      }
    }
    setFiles(filesArray);
  };

  return (
    <>
      <FieldFileUploadWrapper {...wrapperProps}>
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
        />
        {trigger ? (
          <Button onClick={handleChooseFile} theme="primary">
            {trigger}
          </Button>
        ) : (
          <FileUploadWrapper
            choosen={files !== null}
            data-disabled={disabled}
            onClick={handleChooseFile}
            error={errorMessage}
          >
            {field.value && field.value?.length !== 0 && preview !== null && (
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
        {field.value && field.value?.length !== 0 && preview !== null && (
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
