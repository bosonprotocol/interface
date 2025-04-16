import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getChatEnvName } from "./const";

export const Context = createContext<{
  bosonXmtp: BosonXmtpClient | undefined;
  initialize: Dispatch<SetStateAction<void>>;
  chatEnvName: ReturnType<typeof getChatEnvName> | null;
  error: unknown;
  isInitializing: boolean;
}>({
  bosonXmtp: undefined,
  initialize: () => console.log("initialize has not been defined"),
  error: null,
  chatEnvName: null,
  isInitializing: false
});

export const useChatContext = () => useContext(Context);
