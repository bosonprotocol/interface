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
import { getHasUserRejectedTx } from "lib/utils/errors";

import { FileWithEncodedData } from "../../../lib/utils/files";
import { ICON_KEYS, StringIconTypes } from "../components/conversation/const";
import { MessageDataWithInfo } from "../types";

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
    if (!messageData) {
      throw new Error("Something went wrong while sending a message");
    }
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
  callback,
  type
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
  type: MessageType.Proposal | MessageType.CounterProposal;
}) => {
  const destinationAddressFormatted = utils.getAddress(destinationAddress);
  const proposalContent: ProposalContent = {
    value: proposal
  };
  const newMessage = {
    threadId,
    content: proposalContent,
    contentType: type,
    version
  } as const;
  const uuid = window.crypto.randomUUID();
  await callbackSendingMessage?.(newMessage, uuid);
  const messageData = await bosonXmtp.encodeAndSendMessage(
    newMessage,
    destinationAddressFormatted
  );
  if (!messageData) {
    throw new Error("Something went wrong while sending a message");
  }
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

export const sendErrorMessageIfTxFails = async ({
  sendsTxFn,
  addMessageIfTxFailsFn,
  errorMessage,
  threadId
}: {
  sendsTxFn: () => Promise<unknown>;
  addMessageIfTxFailsFn: (errorMessageObj: MessageObject) => Promise<unknown>;
  errorMessage: string;
  threadId: ThreadId | null;
}) => {
  try {
    await sendsTxFn();
  } catch (error) {
    if (!getHasUserRejectedTx(error) && threadId) {
      const newMessage: MessageObject = {
        threadId,
        content: {
          value: {
            icon: ICON_KEYS.warningCircle,
            heading: "Transaction failed",
            body: errorMessage,
            type: StringIconTypes.ERROR
          }
        },
        contentType: MessageType.StringIcon,
        version
      } as const;
      await addMessageIfTxFailsFn(newMessage);
    }

    throw error;
  }
};

export const sendAndAddMessageToUI = async ({
  bosonXmtp,
  addMessage,
  onSentMessage,
  address,
  destinationAddress,
  newMessage
}: {
  bosonXmtp: BosonXmtpClient;
  addMessage?:
    | ((
        newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
      ) => Promise<void>)
    | undefined;
  onSentMessage?:
    | ((messageData: MessageData, uuid: string) => Promise<void>)
    | undefined;
  address: string;
  destinationAddress: string;
  newMessage: MessageObject;
}) => {
  const uuid = window.crypto.randomUUID();

  await addMessage?.({
    authorityId: "",
    timestamp: Date.now(),
    sender: address,
    recipient: destinationAddress,
    data: newMessage,
    isValid: false,
    isPending: true,
    uuid
  });

  const messageData = await bosonXmtp.encodeAndSendMessage(
    newMessage,
    destinationAddress
  );
  if (!messageData) {
    throw new Error(
      `Something went wrong while sending an ${newMessage.contentType} message`
    );
  }
  onSentMessage?.(messageData, uuid);
};
