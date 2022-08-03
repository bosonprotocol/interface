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
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  useEffect(() => {
    if (signer) {
      BosonXmtpClient.initialise(signer, envName)
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);
  return <Context.Provider value={{ bosonXmtp }}>{children}</Context.Provider>;
}
