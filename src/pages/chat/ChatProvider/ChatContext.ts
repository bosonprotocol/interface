import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const Context = createContext<{
  bosonXmtp: BosonXmtpClient | undefined;
  initialize: Dispatch<SetStateAction<void>>;
  chatEnvName: string;
  error: unknown;
  isInitializing: boolean;
}>({
  bosonXmtp: undefined,
  initialize: () => console.log("initialize has not been defined"),
  error: null,
  chatEnvName: "",
  isInitializing: false
});

export const useChatContext = () => useContext(Context);
