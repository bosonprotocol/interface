import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { colors } from "../../../lib/styles/colors";
import bytesToSize from "../../../lib/utils/bytesToSize";
import { useSaveImageToIpfs } from "../../../lib/utils/hooks/useSaveImageToIpfs";
import { getImageMetadata } from "../../../lib/utils/images";
import { getVideoMetadata } from "../../../lib/utils/videos";
import { SUPPORTED_FILE_FORMATS } from "../../product/utils";
import ErrorToast from "../../toasts/common/ErrorToast";
import Typography from "../../ui/Typography";
import { UploadProps } from "../types";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export interface FileProps {
  src: string;
  name?: string; // for example: "redeemeum.png"
  size?: number;
  type: string; // for example: "image/png"
  width?: number | null;
  height?: number | null;
}
type UseSaveImageToIpfs = ReturnType<typeof useSaveImageToIpfs>;
export interface WithUploadToIpfsProps {
  supportFormats: string[];
  saveToIpfs: (
    files: File[] | null
  ) => Promise<false | FileProps[] | undefined>;
  loadMedia: UseSaveImageToIpfs["loadMedia"];
  removeFile: UseSaveImageToIpfs["removeFile"];
}
export function WithUploadToIpfs<P extends WithUploadToIpfsProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithUploadToIpfs = (
    props: Omit<P & UploadProps, keyof WithUploadToIpfsProps>
  ) => {
    const withUpload = props?.withUpload || false;

    const { saveFile, loadMedia, removeFile } = useSaveImageToIpfs();

    const saveToIpfs: WithUploadToIpfsProps["saveToIpfs"] = useCallback(
      async (filesArray: File[] | null) => {
        if (!filesArray) {
          return;
        }
        const filesErrors: string[] = [];

        for (const file of filesArray) {
          const sizeValidation = Number(props.maxSize) || MAX_FILE_SIZE;
          const formatValidation = props.accept
            ? props.accept.split(",").map((acc) => acc.trim())
            : SUPPORTED_FILE_FORMATS;

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
          const fileProps: FileProps = {
            src: `ipfs://${cid}`,
            name: file.name,
            size: file.size,
            type: file.type
          };
          const isImage = file.type.startsWith("image");
          const isVideo = file.type.startsWith("video");
          if (isImage) {
            const { width, height } = await getImageMetadata(file);
            fileProps.width = width;
            fileProps.height = height;
          } else if (isVideo) {
            const { width, height } = await getVideoMetadata(file);
            fileProps.width = width;
            fileProps.height = height;
          }
          ipfsArray.push(fileProps);
        }

        return ipfsArray as FileProps[];
      },
      [props.accept, props.maxSize, saveFile]
    );

    const newProps = useMemo(
      () => ({
        maxSize: MAX_FILE_SIZE,
        supportFormats: SUPPORTED_FILE_FORMATS,
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
