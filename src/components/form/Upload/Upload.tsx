import { Button } from "@bosonprotocol/react-kit";
import { useField } from "formik";
import { Image, Trash } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { colors } from "../../../lib/styles/colors";
import { loadAndSetImage } from "../../../lib/utils/base64";
import bytesToSize from "../../../lib/utils/bytesToSize";
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
  wrapperProps,
  onLoadSinglePreviewImage,
  ...props
}: UploadProps) {
  // const fileName = useMemo(() => `create-product-image_${name}`, [name]);
  // const [preview, setPreview, removePreview] =
  //   useLocalStorage<GetItemFromStorageKey | null>(
  //     fileName as GetItemFromStorageKey,
  //     null
  //   );
  const [preview, setPreview] = useState<string | null>();

  const [field, meta, helpers] = useField(name);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const setFiles = useCallback(
    (value: unknown) => {
      helpers.setValue(value);
    },
    [helpers]
  );
  const files = field.value as File[];

  useEffect(() => {
    onFilesSelect?.(files);
    helpers.setValue(files);

    if (!multiple && accept === "image/*" && files && files?.length !== 0) {
      loadAndSetImage(files[0], (base64Uri) => {
        setPreview(base64Uri);
        onLoadSinglePreviewImage?.(base64Uri);
      });
    }
  }, [files]); // eslint-disable-line

  const handleChooseFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleRemoveAllFiles = () => {
    if (disabled) {
      return;
    }
    setFiles([]);
    setPreview(null);
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
          const error = `File size cannot exceed more than ${bytesToSize(
            maxSize
          )}`;
          // TODO: change to notification
          console.error(error);
        }
      }
    }
    setFiles(filesArray);
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
          <Button onClick={handleChooseFile} variant="accentInverted">
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
