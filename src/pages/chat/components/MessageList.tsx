import { useEffect, useState } from "react";
import styled from "styled-components";

import SellerID from "../../../components/ui/SellerID";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { zIndex } from "../../../lib/styles/zIndex";
import { Thread } from "../types";

const messageItemHeight = "6.25rem";
const messageItemMargin = "1.5rem";

const Container = styled.div<{ $chatListOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1 1 25%;
  border: 1px solid #5560720f;
  left: ${({ $chatListOpen }) => ($chatListOpen ? "0" : "-100vw")};
  position: absolute;
  z-index: ${zIndex.ChatSeparator};
  background: white;
  height: 100vh;
  margin-top: 3.75rem;
  transition: 400ms;
  width: 100vw;
  ${breakpoint.m} {
    left: unset;
    position: relative;
    margin-top: 0;
    height: auto;
    z-index: ${zIndex.Default};
    width: auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${messageItemMargin};
  height: ${messageItemHeight};
  font-weight: 600;
  font-size: 24px;
  border-bottom: 1px solid #5560720f;
`;

const MessageItem = styled.div<{ $active?: boolean }>`
  height: ${messageItemHeight};
  border-bottom: 1px solid #5560720f;
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
  div {
    ${breakpoint.l} {
      font-size: 0.8rem;
    }
    ${breakpoint.xl} {
      font-size: 1rem;
    }
  }
`;

interface Props {
  threads: Thread[];
  onChangeConversation: (thread: Thread) => void;
  chatListOpen: boolean;
  currentThread?: Thread;
}
const getMessageItemKey = (thread: Thread) =>
  `${thread.threadId.buyerId}-${thread.threadId.exchangeId}-${thread.threadId.sellerId}`;

export default function MessageList({
  threads,
  onChangeConversation,
  chatListOpen,
  currentThread
}: Props) {
  const [activeMessageKey, setActiveMessageKey] = useState<string>(
    currentThread ? getMessageItemKey(currentThread) : ""
  );
  useEffect(() => {
    if (currentThread) {
      setActiveMessageKey(getMessageItemKey(currentThread));
    }
  }, [currentThread]);

  return (
    <Container $chatListOpen={chatListOpen}>
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
                    onClick={null}
                  />
                </MessageInfo>
              </MessageContent>
            </MessageItem>
          );
        })}
    </Container>
  );
}
