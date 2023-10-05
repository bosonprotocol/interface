import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { RPC_URLS } from "lib/constants/networks";
import { Magic } from "magic-sdk";
import { useMemo } from "react";
import { useQuery } from "react-query";

export const useMagic = () => {
  const { config } = useConfigContext();
  const chainId = config.envConfig.chainId;
  return useMemo(() => {
    if (!chainId || !RPC_URLS[chainId as keyof typeof RPC_URLS]?.[0]) {
      return null;
    }
    const magic = new Magic(CONFIG.magicLinkKey, {
      network: {
        rpcUrl: RPC_URLS[chainId as keyof typeof RPC_URLS][0],
        chainId: chainId
      }
    });
    magic.uuid = window.crypto.randomUUID();
    return magic as typeof magic & { uuid: string };
  }, [chainId]);
};

export const useWalletInfo = () => {
  const magic = useMagic();
  return useQuery(["wallet-info", magic?.uuid], async () => {
    if (!magic) {
      return;
    }
    return await magic.wallet.getInfo();
  });
};
