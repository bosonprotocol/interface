import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import * as Sentry from "@sentry/browser";
import { ReactNode, useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { config } from "../../../lib/config";
import { Context } from "./ChatContext";
import { envName } from "./const";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  useEffect(() => {
    if (signer && initialize && !bosonXmtp && !isLoading) {
      setLoading(true);
      BosonXmtpClient.initialise(
        signer,
        config.envName === "production" ? "production" : "dev",
        envName
      )
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
          setError(null);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
          Sentry.captureException(error);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, initialize]);
  return (
    <Context.Provider
      value={{
        bosonXmtp,
        initialize: () => {
          setInitialized((prev) => prev + 1);
        },
        error,
        envName,
        isInitializing: isLoading
      }}
    >
      {children}
    </Context.Provider>
  );
}
