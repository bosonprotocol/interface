import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { colors } from "../../../lib/styles/colors";
import bytesToSize from "../../../lib/utils/bytesToSize";
import { useSaveImageToIpfs } from "../../../lib/utils/hooks/useSaveImageToIpfs";
import ErrorToast from "../../toasts/common/ErrorToast";
import Typography from "../../ui/Typography";
import { UploadProps } from "../types";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];

export interface FileProps {
  src: string;
  name?: string;
  size?: number;
  type?: string;
}
export interface WithUploadToIpfsProps {
  saveToIpfs: (e: React.ChangeEvent<HTMLInputElement>) => FileProps[];
  loadMedia: (src: string) => string;
  removeFile: (src: string) => void;
}
export function WithUploadToIpfs<P extends WithUploadToIpfsProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithUploadToIpfs = (
    props: Omit<P & UploadProps, keyof WithUploadToIpfsProps>
  ) => {
    const withUpload = props?.withUpload || false;

    const { saveFile, loadMedia, removeFile } = useSaveImageToIpfs();

    const saveToIpfs = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
          return;
        }
        const { files } = e.target;
        const filesArray = Object.values(files);
        const filesErrors: string[] = [];

        for (const file of filesArray) {
          const sizeValidation = Number(props.maxSize) || MAX_FILE_SIZE;
          const formatValidation = props.accept
            ? props.accept.split(",").map((acc) => acc.trim())
            : SUPPORTED_FORMATS;

          if (file?.size > sizeValidation) {
            const err = `File ${
              file?.name
            } size cannot exceed more than ${bytesToSize(sizeValidation)}!`;
            filesErrors.push(err);
          }
          if (!formatValidation.includes(file?.type)) {
            const err = `Uploaded file has unsupported format of ${file?.type}!`;
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

        return ipfsArray as FileProps[];
      },
      [props.accept, props.maxSize, saveFile]
    );

    const newProps = useMemo(
      () => ({
        maxSize: MAX_FILE_SIZE,
        supportFormats: SUPPORTED_FORMATS,
        saveToIpfs,
        loadMedia,
        removeFile
      }),
      [saveToIpfs, loadMedia, removeFile]
    );

    if (withUpload) {
      return <WrappedComponent {...newProps} {...(props as P)} />;
    }
    return <WrappedComponent {...(props as P)} />;
  };

  return ComponentWithUploadToIpfs;
}
