import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import { config } from "../../../config";

export enum ChatInitializationStatus {
  PENDING = "PENDING",
  ALREADY_INITIALIZED = "ALREADY_INITIALIZED",
  INITIALIZED = "INITIALIZED",
  NOT_INITIALIZED = "NOT_INITIALIZED",
  ERROR = "ERROR"
}

export const useChatStatus = (): {
  chatInitializationStatus: ChatInitializationStatus;
  error: Error | null;
  isError: boolean;
} => {
  const [error, setError] = useState<Error | null>(null);
  const [chatInitializationStatus, setChatInitializationStatus] =
    useState<ChatInitializationStatus>(ChatInitializationStatus.PENDING);
  const { bosonXmtp, envName } = useChatContext();
  const { address } = useAccount();

  useEffect(() => {
    if (
      chatInitializationStatus === ChatInitializationStatus.PENDING &&
      !!bosonXmtp
    ) {
      setChatInitializationStatus(ChatInitializationStatus.ALREADY_INITIALIZED);
    } else if (
      address &&
      chatInitializationStatus !== ChatInitializationStatus.ALREADY_INITIALIZED
    ) {
      setError(null);

      BosonXmtpClient.isXmtpEnabled(
        address,
        config.envName === "production" ? "production" : "dev",
        envName
      )
        .then((isEnabled) => {
          if (isEnabled) {
            setChatInitializationStatus(ChatInitializationStatus.INITIALIZED);
          } else {
            setChatInitializationStatus(
              ChatInitializationStatus.NOT_INITIALIZED
            );
          }
        })
        .catch((err) => {
          setError(err);
          setChatInitializationStatus(ChatInitializationStatus.ERROR);
        });
    }
  }, [address, bosonXmtp, chatInitializationStatus, envName]);
  return {
    chatInitializationStatus,
    error,
    isError: !!error
  };
};
