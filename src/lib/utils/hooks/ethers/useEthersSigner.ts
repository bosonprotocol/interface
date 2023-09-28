/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export function useEthersSigner() {
  const { provider } = useWeb3React();
  const signer = useMemo(() => {
    return provider?.getSigner();
  }, [provider]);
  return signer;
}
