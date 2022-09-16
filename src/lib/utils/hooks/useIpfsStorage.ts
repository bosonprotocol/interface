import { hooks } from "@bosonprotocol/react-kit";

import { CONFIG } from "../../config";

export function useIpfsStorage() {
  const storage = hooks.useIpfsMetadataStorage(
    CONFIG.ipfsMetadataStorageUrl
      ? { url: CONFIG.ipfsMetadataStorageUrl }
      : { envName: CONFIG.envName },
    CONFIG.ipfsMetadataStorageHeaders
  );
  return storage;
}
