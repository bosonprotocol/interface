import { useEffect, useState } from "react";
import styled from "styled-components";

import SellerID from "../../../components/ui/SellerID";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { zIndex } from "../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { Thread } from "../types";

const messageItemHeight = "6.25rem";
const messageItemMargin = "1.5rem";

const Container = styled.div<{
  $chatListOpen?: boolean;
  $isConversationOpened?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1 1 25%;
  border: 1px solid #5560720f;
  position: absolute;
  z-index: ${zIndex.ChatSeparator};
  background: white;
  height: 100vh;
  margin-top: 3.75rem;
  transition: 400ms;
  width: 100vw;
  width: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "100vw" : "auto"};
  position: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "absolute" : "relative"};
  left: ${({ $chatListOpen }) => ($chatListOpen ? "0" : "-100vw")};
  left: ${({ $isConversationOpened, $chatListOpen }) =>
    $isConversationOpened && !$chatListOpen ? "-100vw" : "0"};
  margin-top: 0px;
  ${breakpoint.m} {
    left: unset;
    position: relative;
    height: auto;
    z-index: ${zIndex.Default};
    width: auto;
    margin-top: -0.0625rem;
    padding-top: 1.5625rem;
  }
  ${breakpoint.l} {
    padding-top: unset;
    margin-top: -1.875rem;
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
  ${breakpoint.m} {
    padding-top: 1.25rem;
    margin-top: 1.5625rem;
  }
  ${breakpoint.l} {
    padding-top: 3.125rem;
    margin-top: 1.75rem;
  }
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
    ${breakpoint.xxs} {
      font-size: 0.8875rem;
    }
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
  isConversationOpened: boolean;
  setChatListOpen: (p: boolean) => void;
}
const getMessageItemKey = (thread: Thread) =>
  `${thread.threadId.buyerId}-${thread.threadId.exchangeId}-${thread.threadId.sellerId}`;

export default function MessageList({
  threads,
  onChangeConversation,
  chatListOpen,
  currentThread,
  isConversationOpened,
  setChatListOpen
}: Props) {
  const [activeMessageKey, setActiveMessageKey] = useState<string>(
    currentThread ? getMessageItemKey(currentThread) : ""
  );
  const { isS, isM, isL, isXL } = useBreakpoints();
  useEffect(() => {
    if (currentThread) {
      setActiveMessageKey(getMessageItemKey(currentThread));
    }
  }, [currentThread]);

  return (
    <Container
      $chatListOpen={chatListOpen}
      $isConversationOpened={isConversationOpened}
    >
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
                if (isS) {
                  setChatListOpen(!chatListOpen);
                }
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
