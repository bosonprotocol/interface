import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { colors } from "../../../lib/styles/colors";
import bytesToSize from "../../../lib/utils/bytesToSize";
import { useSaveImageToIpfs } from "../../../lib/utils/hooks/useSaveImageToIpfs";
import ErrorToast from "../../toasts/common/ErrorToast";
import Typography from "../../ui/Typography";

export const MAX_FILE_SIZE = 600 * 1024;
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
  loadImage: (src: string) => string;
  removeFile: (src: string) => void;
}
export function WithUploadToIpfs<P extends WithUploadToIpfsProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithUploadToIpfs = (
    props: Omit<P, keyof WithUploadToIpfsProps>
  ) => {
    // eslint-disable-next-line
    // @ts-ignore
    const { withUpload } = props;

    const { saveFile, loadImage, removeFile } = useSaveImageToIpfs();

    const saveToIpfs = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
          return;
        }
        const { files } = e.target;
        const filesArray = Object.values(files);
        const filesErrors: string[] = [];

        for (const file of filesArray) {
          const sizeValidation = MAX_FILE_SIZE;
          const formatValidation = SUPPORTED_FORMATS;

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
      [saveFile]
    );

    const newProps = useMemo(
      () => ({
        maxSize: MAX_FILE_SIZE,
        supportFormats: SUPPORTED_FORMATS,
        saveToIpfs,
        loadImage,
        removeFile
      }),
      [saveToIpfs, loadImage, removeFile]
    );

    if (withUpload) {
      return <WrappedComponent {...newProps} {...(props as P)} />;
    }
    return <WrappedComponent {...(props as P)} />;
  };

  return ComponentWithUploadToIpfs;
}
