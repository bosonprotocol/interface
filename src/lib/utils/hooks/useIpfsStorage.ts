import { hooks } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";

export function useIpfsStorage() {
  const { config } = useConfigContext();
  const storage = hooks.useIpfsMetadataStorage(
    config.envName,
    config.envConfig.configId,
    config.ipfsMetadataStorageUrl,
    config.ipfsMetadataStorageHeaders
  );
  return storage;
}
