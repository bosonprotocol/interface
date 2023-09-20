/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useWeb3React } from "@web3-react/core";
import { useUser } from "components/magicLink/UserContext";
import { ethers } from "ethers";
import { useMagic } from "lib/utils/magicLink/magic";
import { useMemo } from "react";

export function useSigner() {
  const { provider } = useWeb3React();
  const magic = useMagic();
  const magicProvider = magic
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new ethers.providers.Web3Provider(magic.rpcProvider as any)
    : null;

  return provider?.getSigner() || magicProvider?.getSigner();
}

export function useAccount() {
  const { account } = useWeb3React();
  const { user } = useUser();
  return useMemo(() => ({ account: account ?? user }), [account, user]);
}
