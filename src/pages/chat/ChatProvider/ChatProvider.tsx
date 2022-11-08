import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { utils } from "ethers";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { useModal } from "../../../components/modal/useModal";
import { config } from "../../../lib/config";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { Context } from "./ChatContext";
import { envName } from "./const";

interface Props {
  children: ReactNode;
}

function ReinitializeChat({ children }: Props) {
  const { address } = useAccount();
  const { data: sellers } = useSellers(
    {
      operator: address
    },
    {
      enabled: !!address
    }
  );
  const { showModal } = useModal();
  useEffect(() => {
    if (!address) {
      return;
    }
    const isSeller = !!sellers?.[0];
    if (!isSeller) {
      return;
    }
    (async () => {
      const isXmtpEnabled = await BosonXmtpClient.isXmtpEnabled(
        utils.getAddress(address),
        config.envName === "production" ? "production" : "dev",
        envName
      );
      if (!isXmtpEnabled) {
        showModal("REINITIALIZE_CHAT", {
          closable: false,
          title: "Chat upgrade"
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellers, address]);
  return <>{children}</>;
}

export default function ChatProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const [initialize, setInitialized] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [bosonXmtp, setBosonXmtp] = useState<BosonXmtpClient>();
  useEffect(() => {
    if (signer && initialize && !bosonXmtp) {
      setLoading(true);
      BosonXmtpClient.initialise(
        signer,
        config.envName === "production" ? "production" : "dev",
        envName
      )
        .then((bosonClient) => {
          setBosonXmtp(bosonClient);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, initialize]);
  return (
    <Context.Provider
      value={{
        bosonXmtp,
        initialize: () => setInitialized((prev) => prev + 1),
        envName,
        isInitializing: isLoading
      }}
    >
      <ReinitializeChat>{children}</ReinitializeChat>
    </Context.Provider>
  );
}
