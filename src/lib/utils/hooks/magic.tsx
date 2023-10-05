import { useConfigContext } from "components/config/ConfigContext";
import { CONFIG } from "lib/config";
import { RPC_URLS } from "lib/constants/networks";
import { Magic } from "magic-sdk";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useQuery } from "react-query";

const MagicContext = createContext<
  | (Magic & {
      uuid: string;
    })
  | null
>(null);

export const MagicProvider = ({ children }: { children: ReactNode }) => {
  const { config } = useConfigContext();
  const chainId = config.envConfig.chainId;
  const magic = useMemo(() => {
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
  return (
    <MagicContext.Provider value={magic}>{children}</MagicContext.Provider>
  );
};

export const useMagic = () => {
  const context = useContext(MagicContext);
  if (!context) {
    throw new Error("useMagic must be used within MagicContext");
  }
  return context;
};

export const useWalletInfo = () => {
  const magic = useMagic();
  return useQuery(["wallet-info", magic?.uuid], async () => {
    if (!magic) {
      return;
    }
    const walletInfo = await magic.wallet.getInfo();
    return walletInfo;
  });
};
