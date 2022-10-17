import { useCallback } from "react";

import { fetchIpfsImage } from "../base64";
import { useIpfsStorage } from "./useIpfsStorage";

export function useSaveImageToIpfs() {
  const ipfsMetadataStorage = useIpfsStorage();

  const saveFile = useCallback(
    async (file: File) => {
      if (!file && !ipfsMetadataStorage) {
        return;
      }
      const addPromise = await ipfsMetadataStorage.add(file);
      return addPromise;
    },
    [ipfsMetadataStorage]
  );

  const loadImage = useCallback(
    async (image: string) => {
      if (!image && !ipfsMetadataStorage) {
        return;
      }
      const loadPromise = await fetchIpfsImage(image, ipfsMetadataStorage);
      return loadPromise;
    },
    [ipfsMetadataStorage]
  );

  const removeFile = useCallback(
    async (fileUrl: string) => {
      if (!fileUrl && !ipfsMetadataStorage) {
        return;
      }
      const cid = fileUrl.replace("ipfs://", "");
      await ipfsMetadataStorage?.ipfsClient?.pin?.rm(cid);
    },
    [ipfsMetadataStorage]
  );

  return {
    saveFile,
    loadImage,
    removeFile
  };
}
