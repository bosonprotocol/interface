import { hooks } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";

export function useIpfsStorage() {
  const { config } = useConfigContext();
  const storage = hooks.useIpfsMetadataStorage(
    config.envName,
    config.envConfig.configId,
    config.ipfsMetadataStorageUrl,
    CONFIG.ipfsMetadataStorageHeaders
  );
  return storage;
}
