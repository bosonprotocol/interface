import { hooks } from "@bosonprotocol/react-kit";

import { CONFIG } from "../../config";

export function useIpfsStorage() {
  const storage = hooks.useIpfsMetadataStorage(
    CONFIG.ipfsMetadataStorageUrl,
    CONFIG.ipfsMetadataStorageHeaders
  );
  return storage;
}
