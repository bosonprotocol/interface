import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { utils } from "ethers";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { config } from "../../lib/config";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import { envName } from "../../pages/chat/ChatProvider/const";
import { useModal } from "../modal/useModal";

export function ReinitializeChat() {
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
  return <></>;
}
