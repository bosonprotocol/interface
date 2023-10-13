import { MessageData } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import dayjs from "dayjs";
import { useDisputes } from "lib/utils/hooks/useDisputes";
import { Exchange } from "lib/utils/hooks/useExchanges";
import { WarningCircle } from "phosphor-react";
import { memo, RefObject, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { Spinner } from "../../../../components/loading/Spinner";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { BuyerOrSeller, ThreadObjectWithInfo } from "../../types";
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

  :hover {
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
    const { data: disputes } = useDisputes(
      {
        disputesFilter: {
          exchange: exchange?.id
        }
      },
      { enabled: !!exchange }
    );
    const dispute = disputes?.[0];
    const hasMoreMessages = !isBeginningOfTimes;
    const dataMessagesRef = useRef<HTMLDivElement>(null);
    return (
      <Container
        data-messages
        ref={dataMessagesRef}
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
              const isLastMessage = index === thread.messages.length - 1;
              const wasItMe = getWasItSentByMe(address, message.sender);

              let buyerOrSeller: BuyerOrSeller;
              if (wasItMe) {
                if (iAmTheBuyer) {
                  buyerOrSeller = exchange.buyer;
                } else {
                  buyerOrSeller = exchange.seller;
                }
              } else {
                if (iAmTheBuyer) {
                  buyerOrSeller = exchange.seller;
                } else {
                  buyerOrSeller = exchange.buyer;
                }
              }
              const leftAligned = !wasItMe;
              const ref = isLastMessage ? lastMessageRef : null;
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
                      ref={ref}
                    >
                      <SellerComponent
                        size={32}
                        withProfileText={false}
                        exchange={exchange}
                        buyerOrSeller={buyerOrSeller}
                      />
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
