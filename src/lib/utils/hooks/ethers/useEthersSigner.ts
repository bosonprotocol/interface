/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { useMutation } from "react-query";

export function useEthersSigner() {
  const { provider } = useWeb3React();
  const signer = useMemo(() => {
    return provider?.getSigner();
  }, [provider]);
  return signer;
}

type UseSignMessageProps = {
  message: string;
};
export function useSignMessage() {
  const signer = useEthersSigner();
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
