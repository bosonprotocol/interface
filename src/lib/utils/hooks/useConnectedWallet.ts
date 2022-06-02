import { useEffect, useState } from "react";

export function useConnectedWallet() {
  const [account, setAccount] = useState<string>("");
  useEffect(() => {
    function handleMessageFromIframe(e: MessageEvent) {
      const { target, message, wallet } = e.data || {};

      if (target === "boson" && message === "wallet-changed") {
        setAccount(wallet);
      }
    }
    window.addEventListener("message", handleMessageFromIframe);
    return () => window.removeEventListener("message", handleMessageFromIframe);
  }, []);
  return account;
}
