import * as Sentry from "@sentry/browser";
import { useField } from "formik";
import { Image, Trash, VideoCamera } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { colors } from "../../../lib/styles/colors";
import { loadAndSetMedia } from "../../../lib/utils/base64";
import bytesToSize from "../../../lib/utils/bytesToSize";
import BosonButton from "../../ui/BosonButton";
import Loading from "../../ui/Loading";
import Typography from "../../ui/Typography";
import Error from "../Error";
import {
  FieldFileUploadWrapper,
  FieldInput,
  FileUploadWrapper,
  ImagePreview,
  VideoPreview
} from "../Field.styles";
import type { UploadProps } from "../types";
import UploadedFiles from "./UploadedFiles";
import {
  FileProps,
  WithUploadToIpfs,
  WithUploadToIpfsProps
} from "./WithUploadToIpfs";

export type UploadFileType = File | FileProps;

function Upload({
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
  withUpload,
  saveToIpfs,
  loadMedia,
  onLoading,
  ...props
}: UploadProps & WithUploadToIpfsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>();
  const [field, meta, helpers] = useField(name);

  const handleLoading = useCallback(
    (loadingValue: boolean) => {
      onLoading?.(loadingValue);
      setIsLoading(loadingValue);
    },
    [onLoading]
  );

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

  const files = field.value as UploadFileType[];
  const mimetypes = accept.split(",").map((acc) => acc.trim());
  const isImageOnly = mimetypes.every((mimetype) =>
    mimetype.startsWith("image/")
  );
  const isVideoOnly = mimetypes.every((mimetype) =>
    mimetype.startsWith("video/")
  );

  useEffect(() => {
    onFilesSelect?.(files);
    helpers.setValue(files);

    if (!multiple && files && files?.length !== 0) {
      if (isImageOnly) {
        if (withUpload) {
          loadIpfsImagePreview(files[0] as FileProps);
        } else {
          loadAndSetMedia(files[0] as File, (base64Uri) => {
            setPreview(base64Uri);
            onLoadSinglePreviewImage?.(base64Uri);
          });
        }
      } else if (isVideoOnly) {
        if (withUpload) {
          loadIpfsVideo(files[0] as FileProps);
        } else {
          loadAndSetMedia(files[0] as File, (base64Uri) => {
            setPreview(base64Uri);
          });
        }
      }
    }
  }, [files]); // eslint-disable-line

  const loadIpfsVideo = async (file: FileProps) => {
    const fileSrc = file && file?.src ? file?.src : false;
    if (!fileSrc) {
      return false;
    }
    handleLoading(true);
    try {
      const imagePreview = await loadMedia(fileSrc || "");
      if (imagePreview) {
        setPreview(imagePreview);
      } else {
        console.warn(
          `imagePreview ${imagePreview} is falsy in loadIpfsImagePreview`
        );
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    } finally {
      handleLoading(false);
    }
  };

  const loadIpfsImagePreview = async (file: FileProps) => {
    const fileSrc = file && file?.src ? file?.src : false;
    if (!fileSrc) {
      return false;
    }
    try {
      handleLoading(true);
      const imagePreview = await loadMedia(fileSrc || "");
      if (imagePreview) {
        setPreview(imagePreview);
        onLoadSinglePreviewImage?.(imagePreview);
      } else {
        console.warn(
          `imagePreview ${imagePreview} is falsy in loadIpfsImagePreview`
        );
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    } finally {
      handleLoading(false);
    }
  };

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
    const newArray = files.filter(
      (i: File | FileProps, k: number) => k !== index
    );
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

  const handleSave = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      handleLoading(true);
      const files = await saveToIpfs(e);
      if (files) {
        setFiles(files);
      } else {
        console.warn(`files ${files} is falsy in handleSave`);
      }
    },
    [saveToIpfs, setFiles, handleLoading]
  );

  return (
    <>
      <FieldFileUploadWrapper {...wrapperProps} $disabled={!!disabled}>
        <FieldInput
          {...props}
          hidden
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={withUpload ? handleSave : handleChange}
          ref={(ref) => {
            inputRef.current = ref;
          }}
          disabled={disabled}
        />
        {trigger ? (
          <BosonButton
            onClick={handleChooseFile}
            variant="accentInverted"
            type="button"
          >
            {trigger}
          </BosonButton>
        ) : (
          <FileUploadWrapper
            choosen={files !== null}
            data-disabled={disabled}
            onClick={handleChooseFile}
            error={errorMessage}
          >
            {isLoading ? (
              <Loading size={2} />
            ) : (
              <>
                {field.value && field.value?.length !== 0 && preview ? (
                  <>
                    {isVideoOnly ? (
                      <VideoPreview
                        src={
                          "data:video/mp4;base64," +
                          preview?.substring(
                            "data:application/octet-stream;base64,".length
                          )
                        }
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <ImagePreview src={preview} />
                    )}
                  </>
                ) : isVideoOnly ? (
                  <VideoCamera size={24} />
                ) : (
                  <Image size={24} />
                )}
                {placeholder && (
                  <Typography tag="p" style={{ marginBottom: "0" }}>
                    {placeholder}
                  </Typography>
                )}
              </>
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

export default WithUploadToIpfs(Upload);
