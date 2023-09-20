import { Magic } from "magic-sdk";
export const getProvider = (magic: Magic | undefined | null) => {
  return magic?.wallet.getProvider();
};
