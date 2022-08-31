import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import { ThreadId } from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/cjs/util/validators";

import { MessageDataWithIsValid, ThreadObjectWithIsValid } from "../types";

export default async function monitor({
  threadId,
  bosonXmtp,
  addMessage,
  destinationAddress
}: {
  threadId: ThreadId;
  bosonXmtp: BosonXmtpClient;
  addMessage: (
    threadId: ThreadObjectWithIsValid["threadId"] | null | undefined,
    newMessageOrList: MessageDataWithIsValid | MessageDataWithIsValid[]
  ) => Promise<void>;
  destinationAddress: string;
}) {
  try {
    for await (const incomingMessage of bosonXmtp.monitorThread(
      threadId,
      destinationAddress
    )) {
      const isValid = await validateMessage(incomingMessage.data);
      await addMessage(threadId, { ...incomingMessage, isValid });
    }
  } catch (error) {
    console.error(error);
  }
}
