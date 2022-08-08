import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { ReactNode, useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { Context } from "./ChatContext";

interface Props {
  children: ReactNode;
}

const envName = "local-df"; // TODO: change
export default function ChatProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const [initialize, setInitialized] = useState<boolean>(false);
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  useEffect(() => {
    if (signer && initialize) {
      BosonXmtpClient.initialise(signer, envName)
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, initialize]);
  return (
    <Context.Provider value={{ bosonXmtp, initialize: setInitialized }}>
      {children}
    </Context.Provider>
  );
}
