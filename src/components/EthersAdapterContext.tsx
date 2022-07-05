import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { createContext, useContext } from "react";

export const EthersAdapterContext = createContext<
  EthersAdapter | null | undefined
>(null);

export const useEthersAdapterFromContext = () =>
  useContext(EthersAdapterContext);
