import { useConfigContext } from "components/config/ConfigContext";
import { useEffect, useState } from "react";

import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import { useAccount } from "../connection/connection";

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
  const { bosonXmtp, chatEnvName } = useChatContext();
  const { config } = useConfigContext();
  const { account: address } = useAccount();

  useEffect(() => {
    if (!chatEnvName) {
      throw new Error(`chatEnvName is falsy ${chatEnvName}`);
    }
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
      bosonXmtp
        ?.isXmtpEnabled()
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
  }, [
    address,
    bosonXmtp,
    chatInitializationStatus,
    chatEnvName,
    config.envConfig.envName
  ]);
  return {
    chatInitializationStatus,
    error,
    isError: !!error
  };
};
