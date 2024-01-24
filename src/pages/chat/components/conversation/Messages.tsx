import { MessageData } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { Exchange } from "lib/utils/hooks/useExchanges";
import { WarningCircle } from "phosphor-react";
import { memo, RefObject, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { Spinner } from "../../../../components/loading/Spinner";
import { Typography } from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { ThreadObjectWithInfo } from "../../types";
import Message from "../Message";
import MessageSeparator from "../MessageSeparator";
import { SellerComponent } from "./SellerComponent";

const Container = styled.div<{ $overflow: string }>`
  background-color: ${colors.lightGrey};
  overflow: ${({ $overflow }) => $overflow};
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  background-color: ${colors.lightGrey};
  justify-content: center;
  align-items: center;
  width: 100%;
  align-self: stretch;
  gap: 0.25rem;
`;

const Conversation = styled.div<{ $alignStart: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $alignStart }) =>
    $alignStart ? "flex-start" : "flex-end"};
  flex-grow: 1;
  background-color: ${colors.lightGrey};
  padding-bottom: 1.875rem;
  position: relative;
`;

const NoMoreMessages = styled.button.attrs({ type: "button" })`
  background-color: ${colors.white};
  color: ${colors.black};
  border-radius: 1rem;
  margin: 0.5rem;
  padding: 0.2rem 0.7rem;
  pointer-events: none;
`;

const LoadMoreMessages = styled.button.attrs({ type: "button" })`
  background-color: ${colors.white};
  color: ${colors.black};
  border-radius: 1rem;
  margin: 0.5rem;
  padding: 0.2rem 0.7rem;
  transition: all 300ms;

  &:hover {
    background-color: ${colors.black};
    color: ${colors.white};
  }
`;

const getWasItSentByMe = (myAddress: string | undefined, sender: string) => {
  return myAddress === sender;
};

type MessagesProps = {
  hasError: boolean;
  isBeginningOfTimes: boolean;
  exchange: Exchange;
  dispute: subgraph.DisputeFieldsFragment | undefined;
  loadMoreMessages: (forceDateIndex?: number) => void;
  thread: ThreadObjectWithInfo | null;
  areThreadsLoading: boolean;
  address: string;
  iAmTheBuyer: boolean;
  lastMessageRef: RefObject<HTMLDivElement>;
  lastReceivedProposal: MessageData | null;
  lastSentProposal: MessageData | null;
};

export const Messages: React.FC<MessagesProps> = memo(
  ({
    hasError,
    exchange,
    dispute,
    isBeginningOfTimes,
    loadMoreMessages,
    thread,
    areThreadsLoading,
    address,
    iAmTheBuyer,
    lastMessageRef,
    lastReceivedProposal,
    lastSentProposal
  }) => {
    const hasMoreMessages = !isBeginningOfTimes;
    const Buyer = useMemo(() => {
      return (
        <SellerComponent
          size={32}
          withProfileText={false}
          exchange={exchange}
          buyerOrSeller={exchange.buyer}
        />
      );
    }, [exchange]);
    const Seller = useMemo(() => {
      return (
        <SellerComponent
          size={32}
          withProfileText={false}
          exchange={exchange}
          buyerOrSeller={exchange.seller}
        />
      );
    }, [exchange]);
    return (
      <Container
        data-messages
        ref={lastMessageRef}
        id="messages"
        $overflow="auto"
      >
        <InfiniteScroll
          inverse
          next={loadMoreMessages}
          hasMore={hasMoreMessages}
          loader={<></>}
          dataLength={thread?.messages.length || 0}
          scrollableTarget="messages"
          scrollThreshold="200px"
          refreshFunction={loadMoreMessages}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: "center" }}>
              &#8595; Pull down to refresh
            </h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          }
        >
          <>
            <LoadingContainer>
              {areThreadsLoading ? (
                <Spinner />
              ) : isBeginningOfTimes ? (
                <NoMoreMessages>No earlier messages</NoMoreMessages>
              ) : (
                <LoadMoreMessages onClick={() => loadMoreMessages()}>
                  Load more messages
                </LoadMoreMessages>
              )}
            </LoadingContainer>
            {hasError && (
              <LoadingContainer>
                <WarningCircle color={colors.red} size={14} />
                <Typography color={colors.red}>
                  There has been an error, please try again...
                </Typography>
              </LoadingContainer>
            )}
            {thread?.messages.map((message, index) => {
              const isFirstMessage = index === 0;
              const isPreviousMessageInADifferentDay = isFirstMessage
                ? false
                : dayjs(message.timestamp)
                    .startOf("day")
                    .diff(
                      dayjs(thread.messages[index - 1].timestamp).startOf("day")
                    ) > 0;
              const showMessageSeparator =
                isFirstMessage || isPreviousMessageInADifferentDay;
              const wasItMe = getWasItSentByMe(address, message.sender);
              const Child =
                (wasItMe && iAmTheBuyer) || (!wasItMe && !iAmTheBuyer)
                  ? Buyer
                  : Seller;
              const leftAligned = !wasItMe;
              return (
                <Conversation key={message.timestamp} $alignStart={leftAligned}>
                  <>
                    {showMessageSeparator && (
                      <MessageSeparator message={message} />
                    )}
                    <Message
                      exchange={exchange}
                      dispute={dispute}
                      message={message}
                      isLeftAligned={leftAligned}
                      lastReceivedProposal={lastReceivedProposal}
                      lastSentProposal={lastSentProposal}
                    >
                      {Child}
                    </Message>
                  </>
                </Conversation>
              );
            })}
          </>
        </InfiniteScroll>
      </Container>
    );
  }
);
