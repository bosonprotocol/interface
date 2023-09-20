import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { RPC_URLS } from "lib/constants/networks";
import { Magic } from "magic-sdk";
import { useMemo } from "react";

export const useMagic = (): Magic | null => {
  const { config } = useConfigContext();
  const chainId = config.envConfig.chainId;
  return useMemo(() => {
    if (!chainId || !RPC_URLS[chainId as keyof typeof RPC_URLS]?.[0]) {
      return null;
    }
    return new Magic(CONFIG.magicLinkKey, {
      network: {
        rpcUrl: RPC_URLS[chainId as keyof typeof RPC_URLS][0],
        chainId: chainId
      }
    });
  }, [chainId]);
};
