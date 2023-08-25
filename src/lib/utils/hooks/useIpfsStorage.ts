import { hooks } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";

import { CONFIG } from "../../config";

export function useIpfsStorage() {
  const { config } = useConfigContext();
  const storage = hooks.useIpfsMetadataStorage(
    CONFIG.envName,
    config.envConfig.configId,
    config.ipfsMetadataStorageUrl,
    config.ipfsMetadataStorageHeaders
  );
  return storage;
}
