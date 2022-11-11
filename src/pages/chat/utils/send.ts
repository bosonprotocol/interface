import { BosonXmtpClient } from "@bosonprotocol/chat-sdk";
import {
  FileContent,
  MessageData,
  MessageObject,
  MessageType,
  ProposalContent,
  SupportedFileMimeTypes,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { utils } from "ethers";

import { FileWithEncodedData } from "../../../lib/utils/files";

export const sendFilesToChat = async ({
  bosonXmtp,
  files,
  destinationAddress,
  threadId,
  callbackSendingMessage,
  callback
}: {
  bosonXmtp: BosonXmtpClient;
  files: FileWithEncodedData[];
  destinationAddress: string;
  threadId: ThreadId;
  callbackSendingMessage?: (
    messageObject: MessageObject,
    uuid: string
  ) => Promise<unknown>;
  callback?: (messageData: MessageData, uuid: string) => Promise<unknown>;
}) => {
  const destinationAddressFormatted = utils.getAddress(destinationAddress);

  for (const file of files) {
    const imageContent: FileContent = {
      value: {
        encodedContent: file.encodedData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type as SupportedFileMimeTypes
      }
    };
    const newMessage: MessageObject = {
      threadId,
      content: imageContent,
      contentType: MessageType.File,
      version
    } as const;
    const uuid = window.crypto.randomUUID();
    await callbackSendingMessage?.(newMessage, uuid);
    const messageData = await bosonXmtp.encodeAndSendMessage(
      newMessage,
      destinationAddressFormatted
    );
    await callback?.(messageData, uuid);
  }
};

export const sendProposalToChat = async ({
  bosonXmtp,
  proposal,
  files,
  destinationAddress,
  threadId,
  callbackSendingMessage,
  callback
}: {
  bosonXmtp: BosonXmtpClient;
  proposal: ProposalContent["value"];
  files: FileWithEncodedData[];
  destinationAddress: string;
  threadId: ThreadId;
  callbackSendingMessage?: (
    messageObject: MessageObject,
    uuid: string
  ) => Promise<unknown>;
  callback?: (messageData: MessageData, uuid: string) => Promise<unknown>;
}) => {
  const destinationAddressFormatted = utils.getAddress(destinationAddress);
  const proposalContent: ProposalContent = {
    value: proposal
  };
  const newMessage = {
    threadId,
    content: proposalContent,
    contentType: MessageType.Proposal,
    version
  } as const;
  const uuid = window.crypto.randomUUID();
  await callbackSendingMessage?.(newMessage, uuid);
  const messageData = await bosonXmtp.encodeAndSendMessage(
    newMessage,
    destinationAddressFormatted
  );
  await callback?.(messageData, uuid);
  if (files.length) {
    await sendFilesToChat({
      bosonXmtp,
      destinationAddress: destinationAddressFormatted,
      files,
      threadId,
      callbackSendingMessage,
      callback
    });
  }
};
