import { useEffect, useState } from "react";
import styled from "styled-components";

import SellerID from "../../../components/ui/SellerID";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";

const messageItemPadding = "1.5rem";

const Container = styled.div<{
  $chatListOpen?: boolean;
  $isConversationOpened?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1 1 25%;
  border: 1px solid ${colors.border};
  position: absolute;
  z-index: ${zIndex.ChatSeparator};
  background: white;
  height: 100vh;
  transition: 400ms;
  width: 100vw;
  width: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "100vw" : "auto"};
  position: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "absolute" : "relative"};
  left: ${({ $chatListOpen }) => ($chatListOpen ? "0" : "-100vw")};
  left: ${({ $isConversationOpened, $chatListOpen }) =>
    $isConversationOpened && !$chatListOpen ? "-100vw" : "0"};
  ${breakpoint.m} {
    left: unset;
    position: relative;
    height: auto;
    z-index: ${zIndex.Default};
    width: auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 26px 32px;
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: 1px solid ${colors.border};

  ${breakpoint.l} {
    padding: 1.5rem;
  }
`;

const ExchangesThreads = styled.div`
  overflow: auto;
  padding-bottom: 20%;
`;

const MessageItem = styled.div<{ $active?: boolean }>`
  border-bottom: 1px solid ${colors.border};
  ${({ $active }) =>
    $active &&
    `
    background-color: ${colors.border};
  `};
  :hover {
    background-color: ${colors.border};
  }
`;

const MessageContent = styled.div`
  padding: ${messageItemPadding};
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
  myBuyerId: string;
  mySellerId: string;
  exchanges: Exchange[];
  onChangeConversation: (exchange: Exchange) => void;
  chatListOpen: boolean;
  currentExchange?: Exchange;
  isConversationOpened: boolean;
  setChatListOpen: (p: boolean) => void;
}

const getMessageItemKey = (exchange: Exchange) => exchange.id;

export default function MessageList({
  myBuyerId,
  mySellerId,
  exchanges,
  onChangeConversation,
  chatListOpen,
  currentExchange,
  isConversationOpened,
  setChatListOpen
}: Props) {
  const [activeMessageKey, setActiveMessageKey] = useState<string>(
    currentExchange ? getMessageItemKey(currentExchange) : ""
  );
  const { isS } = useBreakpoints();
  useEffect(() => {
    if (currentExchange) {
      setActiveMessageKey(getMessageItemKey(currentExchange));
    }
  }, [currentExchange]);

  return (
    <Container
      $chatListOpen={chatListOpen}
      $isConversationOpened={isConversationOpened}
    >
      <Header>Messages</Header>
      <ExchangesThreads>
        {exchanges
          .filter((exchange) => exchange)
          .map((exchange) => {
            const messageKey = getMessageItemKey(exchange);
            const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
            const iAmTheSeller = mySellerId === exchange?.offer.seller.id;
            const iAmBoth = iAmTheBuyer && iAmTheSeller;
            const buyerOrSellerToShow = iAmBoth
              ? exchange?.offer.seller
              : iAmTheBuyer
              ? exchange?.offer.seller
              : exchange?.buyer;
            return (
              <MessageItem
                $active={messageKey === activeMessageKey}
                onClick={() => {
                  onChangeConversation(exchange);
                  setActiveMessageKey(messageKey);
                  if (isS) {
                    setChatListOpen(!chatListOpen);
                  }
                }}
                key={messageKey}
              >
                <MessageContent>
                  <img
                    src={exchange?.offer.metadata.imageUrl}
                    alt="exchange image"
                    width="50"
                    height="50"
                  />
                  <MessageInfo>
                    <ExchangeName>{exchange?.offer.metadata.name}</ExchangeName>
                    <SellerID
                      buyerOrSeller={buyerOrSellerToShow}
                      withProfileImage
                      onClick={() => null}
                    />
                  </MessageInfo>
                </MessageContent>
              </MessageItem>
            );
          })}
      </ExchangesThreads>
    </Container>
  );
}
