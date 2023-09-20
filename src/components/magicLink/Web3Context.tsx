import { useMagic } from "lib/utils/magicLink/magic";
import { getWeb3 } from "lib/utils/magicLink/web3";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Web3 } from "web3";
import { RegisteredSubscription } from "web3-eth";
export type SetWeb3 = Dispatch<
  SetStateAction<Web3<RegisteredSubscription> | undefined>
>;
const Web3Context = createContext<{
  web3: Web3<RegisteredSubscription> | undefined;
  setWeb3: Dispatch<SetStateAction<Web3<RegisteredSubscription> | undefined>>;
} | null>(null);

export const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const magic = useMagic();
  const [web3, setWeb3] = useState<Web3<RegisteredSubscription> | undefined>();

  const value = useMemo(
    () => ({
      web3,
      setWeb3
    }),
    [web3, setWeb3]
  );

  useEffect(() => {
    getWeb3(magic).then(setWeb3);
  }, [magic]);

  return (
    <Web3Context.Provider value={{ ...value }}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  const value = useContext(Web3Context);
  if (!value) {
    throw new Error("useWeb3 must be used under Web3ContextProvider");
  }
  return value;
}
