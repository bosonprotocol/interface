import { useEffect, useState } from "react";

import { ProgressStatus } from "../../types/progressStatus";
import { blobToBase64 } from "../base64ImageConverter";
import { useIpfsStorage } from "./useIpfsStorage";

export function useGetIpfsImage(src: string) {
  const ipfsMetadataStorage = useIpfsStorage();
  const [imageStatus, setImageStatus] = useState<ProgressStatus>(
    ProgressStatus.IDLE
  );
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    async function fetchData(src: string) {
      if (ipfsMetadataStorage) {
        setImageStatus(ProgressStatus.LOADING);
        const fetchPromises = await ipfsMetadataStorage.get(src, false);
        const [image] = await Promise.all([fetchPromises]);
        const base64str = await blobToBase64(new Blob([image as BlobPart]));

        if (!String(base64str).includes("base64")) {
          setImageStatus(ProgressStatus.ERROR);
        } else {
          setImageSrc(base64str as string);
          setImageStatus(ProgressStatus.SUCCESS);
        }
      }
    }
    if (
      [ProgressStatus.IDLE, ProgressStatus.LOADING].includes(imageStatus) &&
      !imageSrc
    ) {
      if (src?.includes("ipfs://")) {
        fetchData(src);
      } else {
        setImageSrc(src);
        setImageStatus(ProgressStatus.SUCCESS);
      }
    }
  }, []); // eslint-disable-line
  return {
    imageStatus,
    imageSrc
  };
}
