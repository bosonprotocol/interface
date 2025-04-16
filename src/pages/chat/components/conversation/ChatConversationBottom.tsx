import {
  MessageData,
  MessageType
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import React, { useEffect, useState } from "react";

import { Grid } from "../../../../components/ui/Grid";
import { FileWithEncodedData } from "../../../../lib/utils/files";
import { useChatContext } from "../../ChatProvider/ChatContext";
import { ProposalItem } from "../../types";
import { sendProposalToChat } from "../../utils/send";
import { ChatInfoBox, ChatInfoBoxProps } from "./ChatInfoBox/ChatInfoBox";
import { ChatInput, ChatInputProps } from "./ChatInput";

type ChatConversationBottomProps = Omit<
  ChatInputProps,
  "sendProposal" | "showProposalButton"
> &
  Omit<ChatInfoBoxProps, "proposal" | "sendProposal" | "showProposal"> & {
    proposal: MessageData | null;
    isConversationBeingLoaded: boolean;
    dispute: subgraph.DisputeFieldsFragment | undefined;
  };

export const ChatConversationBottom: React.FC<ChatConversationBottomProps> = ({
  proposal,
  addMessage,
  address,
  destinationAddress,
  disableInputs,
  exchange,
  dispute,
  onSentMessage,
  onTextAreaChange,
  prevPath,
  setHasError,
  textAreaValue,
  threadId,
  iAmTheBuyer,
  acceptedProposal,
  isConversationBeingLoaded
}) => {
  const { bosonXmtp } = useChatContext();
  const [showProposal, setShowProposal] = useState<boolean>(false);
  useEffect(() => {
    if (proposal) {
      setShowProposal(true);
    }
  }, [proposal]);

  const sendProposal =
    (type: MessageType.Proposal | MessageType.CounterProposal) =>
    async (
      proposal: {
        title: string;
        description: string;
        disputeContext: string[];
        proposals: ProposalItem[];
      },
      proposalFiles: FileWithEncodedData[]
    ) => {
      if (!threadId || !bosonXmtp) {
        return;
      }
      try {
        setHasError(false);
        await sendProposalToChat({
          bosonXmtp,
          proposal,
          files: proposalFiles,
          destinationAddress,
          threadId,
          callbackSendingMessage: async (newMessage, uuid) => {
            await addMessage({
              authorityId: "",
              timestamp: BigInt(Date.now()) * BigInt(1_000_000),
              sender: bosonXmtp.inboxId || "",
              recipient: destinationAddress,
              data: newMessage,
              isValid: false,
              isPending: true,
              uuid
            });
          },
          callback: async (messageData, uuid) => {
            onSentMessage(messageData, uuid);
          },
          type
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            ...threadId,
            destinationAddress,
            action: "onSendProposal",
            location: "chat-conversation"
          }
        });
        console.error(error);
        setHasError(true);
      }
    };
  return (
    <Grid flexDirection="column">
      <ChatInfoBox
        exchange={exchange}
        dispute={dispute}
        proposal={proposal}
        sendProposal={sendProposal(MessageType.CounterProposal)}
        iAmTheBuyer={iAmTheBuyer}
        onSentMessage={onSentMessage}
        setHasError={setHasError}
        addMessage={addMessage}
        showProposal={showProposal}
        acceptedProposal={acceptedProposal}
      />
      <ChatInput
        showProposalButton={!(!!proposal && showProposal)}
        exchange={exchange}
        addMessage={addMessage}
        address={address}
        destinationAddress={destinationAddress}
        onSentMessage={onSentMessage}
        setHasError={setHasError}
        threadId={threadId}
        disableInputs={disableInputs}
        isConversationBeingLoaded={isConversationBeingLoaded}
        onTextAreaChange={onTextAreaChange}
        prevPath={prevPath}
        textAreaValue={textAreaValue}
        sendProposal={sendProposal(MessageType.Proposal)}
      />
    </Grid>
  );
};
