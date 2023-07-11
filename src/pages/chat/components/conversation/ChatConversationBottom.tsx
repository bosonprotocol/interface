import React, { useState } from "react";

import { ChatInput, ChatInputProps } from "./ChatInput";
import { ProposalButtons } from "./ProposalButtons";

type ChatConversationBottomProps = ChatInputProps & {
  hasValidProposal: boolean;
};

export const ChatConversationBottom: React.FC<ChatConversationBottomProps> = ({
  hasValidProposal,
  ...rest
}) => {
  const [showProposal, setShowProposal] = useState<boolean>(false);
  return hasValidProposal && showProposal ? (
    <ProposalButtons onWriteMessage={() => setShowProposal(false)} />
  ) : (
    <ChatInput {...rest} />
  );
};
