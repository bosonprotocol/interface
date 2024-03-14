import {
  MessageData,
  MessageType,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { defaultFontFamily } from "lib/styles/fonts";
import { PaperPlaneRight, UploadSimple } from "phosphor-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import styled from "styled-components";

import { MakeProposalModalProps } from "../../../../components/modal/components/Chat/MakeProposal/MakeProposalModal";
import { useModal } from "../../../../components/modal/useModal";
import BosonButton from "../../../../components/ui/BosonButton";
import { Grid } from "../../../../components/ui/Grid";
import { colors } from "../../../../lib/styles/colors";
import { FileWithEncodedData } from "../../../../lib/utils/files";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useChatContext } from "../../ChatProvider/ChatContext";
import { MessageDataWithInfo } from "../../types";
import { sendFilesToChat } from "../../utils/send";
import ButtonProposal from "../ButtonProposal/ButtonProposal";

const TypeMessage = styled.div`
  height: max-content;
  gap: 1rem;
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 1.5rem 1rem 1.5rem 1rem;
  border-right: 1px solid ${colors.border};
`;

const InputWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const Input = styled.div`
  width: 100%;
  font-size: 1rem;
  background: ${colors.lightGrey};
  height: max-content;
  font-family: ${defaultFontFamily};
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  padding: 0.75rem 1rem 0.75rem 1rem;
  &:focus {
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 1.3125rem;
  border: none;
  display: block;
  max-height: 16.875rem;
  overflow-y: auto;
  overflow-wrap: break-word;
  border: none;
  background: none;
  resize: none;
  padding-right: 0.625rem;
  font-family: Plus Jakarta Sans;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0;
  text-align: left;
  cursor: text;
  &:focus {
    outline: none;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const UploadButtonWrapper = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(0, 40%);
  margin: 0 1rem;
  &:disabled {
    cursor: not-allowed;
  }
`;

const SendButton = styled(BosonButton)`
  padding: 0.75rem;
  min-width: 3rem;
  rect {
    stroke: none;
  }
`;

export interface ChatInputProps {
  exchange: Exchange;
  showProposalButton: boolean;
  disableInputs: boolean;
  threadId: ThreadId | null;
  setHasError: Dispatch<SetStateAction<boolean>>;
  addMessage: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  destinationAddress: string;
  address: `0x${string}`;
  onSentMessage: (messageData: MessageData, uuid: string) => Promise<void>;
  onTextAreaChange: (textAreaTargetValue: string) => void;
  textAreaValue: string | undefined;
  prevPath: string;
  sendProposal: MakeProposalModalProps["sendProposal"];
  isConversationBeingLoaded: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  exchange,
  showProposalButton,
  disableInputs,
  threadId,
  setHasError,
  addMessage,
  destinationAddress,
  address,
  onSentMessage,
  onTextAreaChange,
  textAreaValue,
  prevPath,
  sendProposal,
  isConversationBeingLoaded
}) => {
  const { showModal } = useModal();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [prevPath, textAreaValue]);
  const { bosonXmtp } = useChatContext();
  const hideProposal = useMemo(() => {
    if (!showProposalButton || isConversationBeingLoaded) {
      return true;
    }
    const disputeState =
      exchange?.dispute?.state || subgraph.DisputeState.RESOLVING;
    const badStates = [
      subgraph.DisputeState.DECIDED,
      subgraph.DisputeState.ESCALATED,
      subgraph.DisputeState.DECIDED,
      subgraph.DisputeState.REFUSED
    ];

    return (
      badStates?.includes(disputeState) || exchange?.finalizedDate !== null
    );
  }, [exchange, showProposalButton, isConversationBeingLoaded]);

  const handleSendingRegularMessage = useCallback(async () => {
    const value = textAreaValue?.trim() || "";
    if (bosonXmtp && threadId && value && address) {
      try {
        setHasError(false);
        const newMessage = {
          threadId,
          content: {
            value
          },
          contentType: MessageType.String,
          version
        } as const;
        const uuid = window.crypto.randomUUID();

        await addMessage({
          authorityId: "",
          timestamp: Date.now(),
          sender: address,
          recipient: destinationAddress,
          data: newMessage,
          isValid: false,
          isPending: true,
          uuid
        });
        onTextAreaChange("");

        const messageData = await bosonXmtp.encodeAndSendMessage(
          newMessage,
          destinationAddress
        );
        if (!messageData) {
          throw new Error("Something went wrong while sending a message");
        }
        onSentMessage(messageData, uuid);
      } catch (error) {
        console.error(error);
        setHasError(true);
        Sentry.captureException(error, {
          extra: {
            ...threadId,
            destinationAddress,
            action: "handleSendingRegularMessage",
            location: "chat-conversation"
          }
        });
      }
    }
  }, [
    addMessage,
    address,
    bosonXmtp,
    destinationAddress,
    onSentMessage,
    onTextAreaChange,
    textAreaValue,
    threadId,
    setHasError
  ]);
  const sendFiles = useCallback(
    async (files: FileWithEncodedData[]) => {
      if (!bosonXmtp || !threadId || !address) {
        return;
      }
      try {
        setHasError(false);
        await sendFilesToChat({
          bosonXmtp,
          files,
          destinationAddress,
          threadId,
          callbackSendingMessage: async (newMessage, uuid) => {
            await addMessage({
              authorityId: "",
              timestamp: Date.now(),
              sender: address,
              recipient: destinationAddress,
              data: newMessage,
              isValid: false,
              isPending: true,
              uuid
            });
          },
          callback: async (messageData, uuid) => {
            onSentMessage(messageData, uuid);
          }
        });
      } catch (error) {
        console.error(error);
        setHasError(true);
        Sentry.captureException(error, {
          extra: {
            ...threadId,
            destinationAddress,
            action: "sendFiles",
            location: "chat-conversation"
          }
        });
      }
    },
    [
      bosonXmtp,
      threadId,
      address,
      destinationAddress,
      addMessage,
      onSentMessage,
      setHasError
    ]
  );
  return (
    <TypeMessage>
      {exchange.disputed && !hideProposal && (
        <Grid
          alignItems="flex-start"
          width="auto"
          justifyContent="flex-start"
          height="100%"
        >
          <ButtonProposal
            exchange={exchange}
            disabled={disableInputs}
            onSendProposal={sendProposal}
          />
        </Grid>
      )}
      <InputWrapper>
        <Input>
          <TextArea
            ref={textareaRef}
            placeholder="Write a message"
            disabled={disableInputs}
            value={textAreaValue}
            onChange={async (e) => {
              const value = e.target.value;
              const didPressEnter = value[value.length - 1] === `\n`;
              if (didPressEnter) {
                await handleSendingRegularMessage();
              } else {
                onTextAreaChange(value);
              }
            }}
          >
            {textAreaValue}
          </TextArea>
        </Input>
        <UploadButtonWrapper
          type="button"
          disabled={disableInputs}
          onClick={() =>
            showModal("UPLOAD_MODAL", {
              title: "Upload documents",
              withEncodedData: true,
              onUploadedFilesWithData: async (files) => {
                try {
                  await sendFiles(files);
                } catch (error) {
                  console.error(error);
                  Sentry.captureException(error, {
                    extra: {
                      ...threadId,
                      destinationAddress,
                      action: "onUploadedFilesWithData",
                      location: "chat-conversation"
                    }
                  });
                }
              }
            })
          }
        >
          <UploadSimple size={24} />
        </UploadButtonWrapper>
      </InputWrapper>
      <SendButton
        data-testid="send"
        variant="primaryFill"
        disabled={disableInputs}
        onClick={handleSendingRegularMessage}
      >
        <PaperPlaneRight size={24} />
      </SendButton>
    </TypeMessage>
  );
};
