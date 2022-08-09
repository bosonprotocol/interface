import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const Context = createContext<{
  bosonXmtp: BosonXmtpClient | undefined;
  initialize: Dispatch<SetStateAction<void>>;
}>({
  bosonXmtp: undefined,
  initialize: () => null
});

export const useChatContext = () => useContext(Context);
