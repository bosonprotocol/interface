import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const Context = createContext<{
  bosonXmtp: BosonXmtpClient | undefined;
  initialize: Dispatch<SetStateAction<void>>;
  envName: string;
}>({
  bosonXmtp: undefined,
  initialize: () => null,
  envName: ""
});

export const useChatContext = () => useContext(Context);
