import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { createContext, useContext } from "react";

export const Context = createContext<{
  bosonXmtp: BosonXmtpClient | undefined;
}>({
  bosonXmtp: undefined
});

export const useChatContext = () => useContext(Context);
