/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useWeb3React } from "@web3-react/core";

export function useEthersSigner() {
  const { provider } = useWeb3React();

  return provider?.getSigner();
}
