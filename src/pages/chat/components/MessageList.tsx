import { useState } from "react";
import styled from "styled-components";

import SellerID from "../../../components/ui/SellerID";
import { Thread } from "../types";

const messageItemHeight = "6.25rem";
const messageItemMargin = "1.5rem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 25%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${messageItemMargin};
  height: ${messageItemHeight};
  font-weight: 600;
  font-size: 24px;
  border: 1px solid #5560720f;
  border-top: none;
`;

const MessageItem = styled.div<{ $active?: boolean }>`
  height: ${messageItemHeight};
  border: 1px solid #5560720f;
  border-top: none;
  ${({ $active }) =>
    $active &&
    `
    background-color: rgba(85, 96, 114, 0.06);
  `};
  :hover {
    background-color: rgba(85, 96, 114, 0.06);
  }
`;

const MessageContent = styled.div`
  margin: ${messageItemMargin};
  display: flex;
  align-items: center;
  column-gap: 1rem;
`;

const ExchangeName = styled.div`
  font-weight: 600;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`;

interface Props {
  threads: Thread[];
  onChangeConversation: (thread: Thread) => void;
}
const getMessageItemKey = (thread: Thread) =>
  `${thread.threadId.buyerId}-${thread.threadId.exchangeId}-${thread.threadId.sellerId}`;

export default function MessageList({ threads, onChangeConversation }: Props) {
  const [activeMessageKey, setActiveMessageKey] = useState<string>();
  return (
    <Container>
      <Header>Messages</Header>
      {threads
        .filter((thread) => thread.exchange)
        .map((thread) => {
          const messageKey = getMessageItemKey(thread);
          return (
            <MessageItem
              $active={messageKey === activeMessageKey}
              onClick={() => {
                onChangeConversation(thread);
                setActiveMessageKey(messageKey);
              }}
              key={messageKey}
            >
              <MessageContent>
                <img
                  src={thread.exchange?.offer.metadata.imageUrl}
                  alt="exchange image"
                  width="50"
                  height="50"
                />
                <MessageInfo>
                  <ExchangeName>
                    {thread.exchange?.offer.metadata.name}
                  </ExchangeName>
                  <SellerID
                    seller={thread.exchange?.offer.seller || ({} as never)}
                    offerName={thread.exchange?.offer.metadata.name || ""}
                    withProfileImage
                    onClick={() => null}
                  />
                </MessageInfo>
              </MessageContent>
            </MessageItem>
          );
        })}
    </Container>
  );
}
