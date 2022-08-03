import { MessageData } from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";

import { DeepReadonly } from "../../types/helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validateMessage = (
  message: DeepReadonly<MessageData>
): boolean => {
  return true; // TODO: implement
};
