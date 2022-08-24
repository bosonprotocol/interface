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
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { utils } from "ethers";

import { FileWithEncodedData } from "../../../lib/utils/files";

export const sendFilesToChat = async ({
  bosonXmtp,
  files,
  destinationAddress,
  threadId,
  callback
}: {
  bosonXmtp: BosonXmtpClient;
  files: FileWithEncodedData[];
  destinationAddress: string;
  threadId: ThreadId;
  callback?: (messageData: MessageData) => Promise<unknown>;
}) => {
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
    const messageData = await bosonXmtp.encodeAndSendMessage(
      newMessage,
      destinationAddress
    );
    await callback?.(messageData);
  }
};

export const sendProposalToChat = async ({
  bosonXmtp,
  proposal,
  files,
  destinationAddress,
  threadId,
  callback
}: {
  bosonXmtp: BosonXmtpClient;
  proposal: ProposalContent["value"];
  files: FileWithEncodedData[];
  destinationAddress: string;
  threadId: ThreadId;
  callback?: (messageData: MessageData) => Promise<unknown>;
}) => {
  const proposalContent: ProposalContent = {
    value: proposal
  };
  const newMessage = {
    threadId,
    content: proposalContent,
    contentType: MessageType.Proposal,
    version
  } as const;
  const messageData = await bosonXmtp.encodeAndSendMessage(
    newMessage,
    utils.getAddress(destinationAddress)
  );
  await callback?.(messageData);
  if (files.length) {
    await sendFilesToChat({
      bosonXmtp,
      destinationAddress,
      files,
      threadId,
      callback
    });
  }
};
