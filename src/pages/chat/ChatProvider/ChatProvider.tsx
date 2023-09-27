import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { useEffectDebugger } from "lib/utils/hooks/useEffectDebugger";
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { useEthersSigner } from "../../../lib/utils/hooks/ethers/useEthersSigner";
import { Context } from "./ChatContext";
import { getChatEnvName } from "./const";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const { config } = useConfigContext();
  const signer = useEthersSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  const chatEnvName = getChatEnvName(config);
  useEffectDebugger(() => {
    if (signer && initialize && !bosonXmtp) {
      console.log("initialize if");
      setLoading(true);
      BosonXmtpClient.initialise(
        signer,
        config.envConfig.envName === "production" ? "production" : "dev",
        chatEnvName
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
  }, [signer, initialize, chatEnvName, config.envConfig.envName]);
  const signerAddress = useQuery(["signer-address", signer?._address], () => {
    return signer?.getAddress();
  });
  useEffect(() => {
    setBosonXmtp(undefined);
  }, [signerAddress.data]);
  return (
    <Context.Provider
      value={{
        bosonXmtp,
        initialize: () => {
          console.log("initialize boson");
          setInitialized((prev) => prev + 1);
        },
        error,
        chatEnvName,
        isInitializing: isLoading
      }}
    >
      {children}
    </Context.Provider>
  );
}
