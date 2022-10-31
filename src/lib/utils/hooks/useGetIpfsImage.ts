import { useEffect, useState } from "react";

import { ProgressStatus } from "../../types/progressStatus";
import { fetchIpfsBase64Media } from "../base64";
import { useIpfsStorage } from "./useIpfsStorage";

export function useGetIpfsImage(src: string) {
  const ipfsMetadataStorage = useIpfsStorage();
  const [imageStatus, setImageStatus] = useState<ProgressStatus>(
    ProgressStatus.IDLE
  );
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (!src) {
      return;
    }
    async function fetchData(src: string) {
      if (ipfsMetadataStorage && !src?.includes("undefined")) {
        setImageStatus(ProgressStatus.LOADING);
        try {
          const [base64str] = await fetchIpfsBase64Media(
            [src],
            ipfsMetadataStorage
          );
          setImageSrc(base64str as string);
          setImageStatus(ProgressStatus.SUCCESS);
        } catch (error) {
          console.error("error in useGetIpfsImage", error);
          setImageStatus(ProgressStatus.ERROR);
        }
      } else {
        setImageStatus(ProgressStatus.ERROR);
      }
    }
    if (
      [ProgressStatus.IDLE, ProgressStatus.LOADING].includes(imageStatus) &&
      !imageSrc
    ) {
      if (src?.includes("ipfs://")) {
        const newString = src.split("//");
        const CID = newString[newString.length - 1];
        fetchData(`ipfs://${CID}`);
      } else if (src?.startsWith("undefined") && src?.length > 9) {
        const CID = src.replace("undefined", "");
        fetchData(`ipfs://${CID}`);
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
