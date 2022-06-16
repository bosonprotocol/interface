import { getDefaultProvider } from "ethers";
import { useEffect, useState } from "react";

export function useEnsName(address: string) {
  const [ensName, setEnsName] = useState<string | null>("");
  useEffect(() => {
    if (address) {
      getDefaultProvider()
        .lookupAddress(address)
        .then((name) => setEnsName(name))
        .catch(console.error);
    }
  }, [address]);
  return ensName;
}
