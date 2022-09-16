import { useEffect, useState } from "react";

import { blobToBase64 } from "../base64ImageConverter";
import { useIpfsStorage } from "./useIpfsStorage";

type ImageStatus = "idle" | "loading" | "success" | "error";

export function useGetIpfsImage(src: string) {
  const ipfsMetadataStorage = useIpfsStorage();
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle");
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    async function fetchData(src: string) {
      setImageStatus("loading");
      const fetchPromises = await ipfsMetadataStorage.get(src, false);
      const [image] = await Promise.all([fetchPromises]);
      const base64str = await blobToBase64(new Blob([image as BlobPart]));

      if (!String(base64str).includes("base64")) {
        setImageStatus("error");
      } else {
        setImageSrc(base64str as string);
        setImageStatus("success");
      }
    }
    if (["idle", "loading"].includes(imageStatus) && !imageSrc) {
      if (src?.includes("ipfs://")) {
        fetchData(src);
      } else {
        setImageSrc(src);
        setImageStatus("success");
      }
    }
  }, []); // eslint-disable-line
  return {
    imageStatus,
    imageSrc
  };
}
