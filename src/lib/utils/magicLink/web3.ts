import { Magic } from "magic-sdk";
import Web3 from "web3";

import { getProvider } from "./provider";

export const getWeb3 = async (magic: Magic | undefined | null) => {
  if (!magic) {
    return;
  }
  const provider = await getProvider(magic);
  return new Web3(provider);
};
