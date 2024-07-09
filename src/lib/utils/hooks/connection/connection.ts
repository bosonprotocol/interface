/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { hooks, useUser } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { BrowserProvider } from "ethers-v6";
import { useMemo } from "react";
import { useMutation, useQuery } from "react-query";

export function useProvider() {
  const { provider } = useWeb3React();
  const magicProvider = hooks.useMagicProvider();
  const isMagicLoggedIn = hooks.useIsMagicLoggedIn();
  return useMemo(() => {
    return isMagicLoggedIn
      ? magicProvider ?? provider
      : provider ?? magicProvider;
  }, [provider, magicProvider, isMagicLoggedIn]);
}

export function useSigner() {
  const provider = useProvider();
  const signer = useMemo(() => {
    return provider?.getSigner();
  }, [provider]);
  return signer;
}

export function useSignerV6() {
  const providerV5 = useProvider();
  const url = providerV5?.connection?.url;
  return useQuery(["signer", url], async () => {
    const providerV6 = providerV5toV6(providerV5);
    return await providerV6?.getSigner();
  });
}

function providerV5toV6(
  providerV5: providers.Web3Provider
): BrowserProvider | undefined {
  return providerV5
    ? new BrowserProvider({
        request: async (request: {
          method: string;
          params?: Array<any> | Record<string, any>;
        }) => {
          const params = request.params
            ? Array.isArray(request.params)
              ? (request.params as Array<any>)
              : Array.from(request.params.values())
            : [];
          return providerV5.send(request.method, params);
        }
      })
    : undefined;
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
  const { provider: web3ReactProvider, chainId: web3ReactChainId } =
    useWeb3React();
  const magicChainId = hooks.useMagicChainId();
  const chainIdToReturn =
    web3ReactChainId ?? web3ReactProvider?._network?.chainId ?? magicChainId;
  return chainIdToReturn;
}
