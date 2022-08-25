import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { ReactNode, useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { config } from "../../../lib/config";
import { Context } from "./ChatContext";

interface Props {
  children: ReactNode;
}

const envName = `${config.envName}-${config.contracts.protocolDiamond}`;
export default function ChatProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  useEffect(() => {
    if (signer && initialize && !bosonXmtp) {
      BosonXmtpClient.initialise(signer, envName)
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, initialize]);
  return (
    <Context.Provider
      value={{
        bosonXmtp,
        initialize: () => setInitialized((prev) => prev + 1),
        envName
      }}
    >
      {children}
    </Context.Provider>
  );
}
