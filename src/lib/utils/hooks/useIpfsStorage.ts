import { hooks } from "@bosonprotocol/react-kit";

import { CONFIG } from "../../config";

export function useIpfsStorage() {
  return hooks.useIpfsMetadataStorage(CONFIG.chainId);
}
