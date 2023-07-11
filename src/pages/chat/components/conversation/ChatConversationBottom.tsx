import React, { useEffect, useState } from "react";

import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { ChatInput, ChatInputProps } from "./ChatInput";
import { ProposalButtons } from "./ProposalButtons";

type ChatConversationBottomProps = ChatInputProps & {
  hasValidProposal: boolean;
  exchange: Exchange;
};

export const ChatConversationBottom: React.FC<ChatConversationBottomProps> = ({
  hasValidProposal,
  ...rest
}) => {
  const [showProposal, setShowProposal] = useState<boolean>(false);
  useEffect(() => {
    if (hasValidProposal) {
      setShowProposal(true);
    }
  }, [hasValidProposal]);
  return hasValidProposal && showProposal ? (
    <ProposalButtons
      onWriteMessage={() => setShowProposal(false)}
      exchange={rest.exchange}
    />
  ) : (
    <ChatInput {...rest} />
  );
};
