import { hooks } from "@bosonprotocol/react-kit";

import { CONFIG } from "../../config";

export function useIpfsStorage() {
  const storage = hooks.useIpfsMetadataStorage(
    CONFIG.chainId,
    CONFIG.ipfsMetadataStorageHeaders
  );
  return storage;
}
