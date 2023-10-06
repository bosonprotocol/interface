import { MagicContext } from "components/magicLink/MagicContext";
import { useUser } from "components/magicLink/UserContext";
import { ethers } from "ethers";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

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

export function useMagicProvider() {
  const magic = useMagic();
  const magicProvider = useMemo(
    () =>
      magic
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new ethers.providers.Web3Provider(magic.rpcProvider as any)
        : null,
    [magic]
  );
  return magicProvider;
}

export function useMagicChainId() {
  const magicProvider = useMagicProvider();
  return magicProvider?._network?.chainId;
}

export function useIsMagicLoggedIn() {
  const { user } = useUser();
  const isMagicLoggedIn = !!user;
  return isMagicLoggedIn;
}
