/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useWeb3React } from "@web3-react/core";
import { useUser } from "components/magicLink/UserContext";
import { useMemo } from "react";
import { useMutation } from "react-query";

import { useIsMagicLoggedIn, useMagicProvider } from "../magic";

export function useProvider() {
  const { provider } = useWeb3React();
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  return isMagicLoggedIn
    ? magicProvider ?? provider
    : provider ?? magicProvider;
}

export function useSigner() {
  const provider = useProvider();
  const signer = useMemo(() => {
    return provider?.getSigner();
  }, [provider]);
  return signer;
}

export function useAccount() {
  const { account } = useWeb3React();
  const { user } = useUser();
  return useMemo(() => ({ account: account ?? user }), [account, user]);
}

type UseSignMessageProps = {
  message: string;
};
export function useSignMessage() {
  const signer = useSigner();
  return useMutation(
    async (
      { message }: UseSignMessageProps = { message: "" }
    ): Promise<string | undefined> => {
      if (!signer) {
        return;
      }
      return signer?.signMessage(message);
    }
  );
}

export function useChainId() {
  const { provider, chainId } = useWeb3React();
  const magicProvider = useMagicProvider();
  return (
    chainId ?? provider?._network?.chainId ?? magicProvider?._network?.chainId
  );
}
