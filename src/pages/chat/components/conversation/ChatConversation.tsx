import { BosonXmtpClient } from "@bosonprotocol/chat-sdk/dist/esm/index";
import {
  MessageData,
  MessageType,
  ProposalContent,
  ThreadId
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/esm/util/validators";
import * as Sentry from "@sentry/browser";
import dayjs from "dayjs";
import { utils } from "ethers";
import { ArrowLeft, WarningCircle } from "phosphor-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { Spinner } from "../../../../components/loading/Spinner";
import InitializeChat from "../../../../components/modal/components/Chat/components/InitializeChat";
import Grid from "../../../../components/ui/Grid";
import SellerID from "../../../../components/ui/SellerID";
import Typography from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { zIndex } from "../../../../lib/styles/zIndex";
import { useInfiniteThread } from "../../../../lib/utils/hooks/chat/useInfiniteThread";
import { useBreakpoints } from "../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "../../ChatProvider/ChatContext";
import { chatUrl } from "../../const";
import { BuyerOrSeller, MessageDataWithInfo } from "../../types";
import ExchangeSidePreview from "../ExchangeSidePreview";
import Message from "../Message";
import MessageSeparator from "../MessageSeparator";
import { ChatConversationBottom } from "./ChatConversationBottom";

const Container = styled.div`
  display: flex;
  flex: 0 1 100%;
  flex-direction: row;
  position: relative;
  width: 100%;

  ${breakpoint.m} {
    flex: 0 1 100%;
  }
`;

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  [data-testid="seller-info"] {
    font-weight: 600;
    font-size: 1rem;
    color: initial;
    ${breakpoint.xs} {
      font-size: 1.5rem;
    }
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  ${breakpoint.m} {
    text-align: left;
  }
  div {
    display: block;
    margin: 0 auto;
    ${breakpoint.m} {
      display: unset;
      margin: unset;
    }
  }

  > div {
    div {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      width: fit-content;
    }
    ${breakpoint.m} {
      position: relative;
      top: unset;
      width: unset;
      justify-content: unset;
      display: block;
      align-items: unset;
    }
  }

  ${breakpoint.l} {
    justify-content: unset;
  }
`;

const Messages = styled.div<{ $overflow: string }>`
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

const SimpleMessage = styled.p`
  all: unset;
  display: block;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: ${colors.lightGrey};
`;

const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  min-height: 84px;
  > * {
    flex-basis: 100%;
  }
  ${breakpoint.m} {
  }
`;

const HeaderButton = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  background: none;
  padding: none;
  border: none;
  color: ${colors.secondary};
  z-index: ${zIndex.LandingTitle};
`;

const NavigationMobile = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  svg {
    color: ${colors.secondary};
    margin-right: 0.438rem;
    margin-bottom: -0.1875rem;
  }
  ${breakpoint.l} {
    display: none;
  }
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

const SellerComponent = ({
  size,
  withProfileText,
  exchange,
  buyerOrSeller
}: {
  size: number;
  withProfileText?: boolean;
  exchange: Exchange | undefined;
  buyerOrSeller: BuyerOrSeller;
}) => {
  if (!exchange) {
    return null;
  }
  return (
    <SellerID
      offer={exchange?.offer}
      buyerOrSeller={buyerOrSeller}
      withProfileImage
      accountImageSize={size}
      withProfileText={withProfileText}
    />
  );
};

const getWasItSentByMe = (myAddress: string | undefined, sender: string) => {
  return myAddress === sender;
};

type ChatConversationProps = {
  myBuyerId: string;
  mySellerId: string;
  exchange: Exchange | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
  prevPath: string;
  onTextAreaChange: (textAreaTargetValue: string) => void;
  textAreaValue: string | undefined;
  refetchExchanges: () => void;
};
const ChatConversation = ({
  myBuyerId,
  mySellerId,
  exchange,
  chatListOpen,
  setChatListOpen,
  prevPath,
  onTextAreaChange,
  textAreaValue,
  refetchExchanges
}: ChatConversationProps) => {
  const { address } = useAccount();
  const [hasError, setHasError] = useState<boolean>(false);
  const location = useLocation();
  const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
  const iAmTheSeller = mySellerId === exchange?.offer.seller.id;
  const iAmBoth = iAmTheBuyer && iAmTheSeller;
  const buyerOrSellerToShow: BuyerOrSeller = useMemo(
    () =>
      iAmBoth
        ? exchange?.offer.seller
        : iAmTheBuyer
        ? exchange?.offer.seller
        : exchange?.buyer || ({} as BuyerOrSeller),
    [exchange?.buyer, exchange?.offer.seller, iAmBoth, iAmTheBuyer]
  );
  const destinationAddressLowerCase = iAmTheBuyer
    ? exchange?.offer.seller.assistant
    : exchange?.buyer.wallet;
  const destinationAddress = destinationAddressLowerCase
    ? utils.getAddress(destinationAddressLowerCase)
    : "";
  const { bosonXmtp } = useChatContext();
  const threadId = useMemo<ThreadId | null>(() => {
    if (!exchange) {
      return null;
    }
    return {
      exchangeId: exchange.id,
      buyerId: exchange.buyer.id,
      sellerId: exchange.seller.id
    };
  }, [exchange]);
  const [lastReceivedProposal, setLastReceivedProposal] =
    useState<MessageData | null>(null);
  const [lastSentProposal, setLastSentProposal] = useState<MessageData | null>(
    null
  );
  const filterProposals = (message: MessageData) =>
    [MessageType.Proposal, MessageType.CounterProposal].includes(
      message.data.contentType
    );
  const onMessagesReceived = useCallback(
    (messages: MessageData[]) => {
      const sortedMessages = messages.sort((msgA, msgB) => {
        return msgB.timestamp - msgA.timestamp;
      });

      const tempLastReceivedProposal = sortedMessages
        .filter(filterProposals)
        .find((message) => {
          const isAProposalFromSomeoneElse =
            message.sender.toLowerCase() !== address?.toLowerCase();
          const hasProposals = !!(message.data.content as ProposalContent)
            ?.value.proposals?.length;
          return hasProposals && isAProposalFromSomeoneElse;
        });
      const tempLastSentProposal = sortedMessages
        .filter(filterProposals)
        .find((message) => {
          const isMyProposal =
            message.sender.toLowerCase() === address?.toLowerCase();
          const hasProposals = !!(message.data.content as ProposalContent)
            ?.value.proposals?.length;

          return isMyProposal && hasProposals;
        });
      if (tempLastReceivedProposal) {
        setLastReceivedProposal((prev) => {
          return (prev?.timestamp || 0) > tempLastReceivedProposal.timestamp
            ? prev
            : tempLastReceivedProposal;
        });
      }
      if (tempLastSentProposal) {
        setLastSentProposal((prev) => {
          return (prev?.timestamp || 0) > tempLastSentProposal.timestamp
            ? prev
            : tempLastSentProposal;
        });
      }
    },
    [address]
  );
  const {
    data: thread,
    isLoading: areThreadsLoading,
    isBeginningOfTimes,
    isError: isErrorThread,
    lastData: lastThread,
    setDateIndex,
    addToDateIndex,
    appendMessages,
    removePendingMessage
  } = useInfiniteThread({
    threadId,
    dateStep: "week",
    dateStepValue: 1,
    counterParty: destinationAddress,
    genesisDate: exchange?.committedDate
      ? new Date(Number(exchange?.committedDate) * 1000)
      : new Date("2022-08-25"),
    checkCustomCondition: (mergedThread) => {
      // load conversation until we receive a proposal

      if (!mergedThread) {
        return false;
      }
      const sortedProposals = [...mergedThread.messages]
        .filter(filterProposals)
        .sort((msgA, msgB) => {
          return msgB.timestamp - msgA.timestamp;
        });
      return sortedProposals.some((message) => {
        const isAProposalFromSomeoneElse =
          message.sender.toLowerCase() !== address?.toLowerCase();
        return isAProposalFromSomeoneElse;
      });
    },
    onMessagesReceived,
    onFinishFetching: ({
      isBeginningOfTimes,
      isLoading: areThreadsLoading,
      lastData: lastThread
    }) => {
      if (
        bosonXmtp &&
        !isBeginningOfTimes &&
        !areThreadsLoading &&
        !lastThread
      ) {
        loadMoreMessages();
      }
    }
  });
  useEffect(() => {
    setHasError(isErrorThread);
  }, [isErrorThread]);
  const loadMoreMessages = useCallback(
    (forceDateIndex?: number) => {
      if (!areThreadsLoading) {
        if (forceDateIndex !== undefined) {
          setDateIndex(forceDateIndex);
        } else {
          addToDateIndex(-1);
        }
      }
    },
    [areThreadsLoading, setDateIndex, addToDateIndex]
  );

  const addMessage = useCallback(
    async (newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]) => {
      const newMessages = Array.isArray(newMessageOrList)
        ? newMessageOrList
        : [newMessageOrList];
      const messagesWithIsValid = await Promise.all(
        newMessages.map(async (message) => {
          if (message.isValid === undefined) {
            message.isValid = await validateMessage(message.data);
          }
          return message;
        })
      );
      appendMessages(messagesWithIsValid);
    },
    [appendMessages]
  );
  const previousThreadMessagesRef = useRef<MessageData[]>(
    thread?.messages || []
  );

  const hasMoreMessages = !isBeginningOfTimes;

  const dataMessagesRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(
    (scrollOptions: ScrollIntoViewOptions) =>
      lastMessageRef.current?.scrollIntoView(scrollOptions),
    []
  );
  useEffect(() => {
    if (
      thread &&
      thread?.messages.length !== previousThreadMessagesRef.current.length
    ) {
      if (previousThreadMessagesRef.current.length) {
        const isLoadingHistoryMessages =
          (thread?.messages[0].timestamp || 0) <
          previousThreadMessagesRef.current[0].timestamp;
        if (!isLoadingHistoryMessages) {
          scrollToBottom({
            behavior: "smooth"
          }); // every time we send/receive a message
        }
      }

      previousThreadMessagesRef.current = thread?.messages || [];
    }
  }, [thread, lastThread, scrollToBottom, thread?.messages]);
  const [isExchangePreviewOpen, setExchangePreviewOpen] =
    useState<boolean>(false);
  const navigate = useKeepQueryParamsNavigate();
  const isMonitorOk = useMemo(() => {
    return (
      !!addMessage && !!bosonXmtp && !!destinationAddress && thread?.threadId
    );
  }, [addMessage, bosonXmtp, destinationAddress, thread?.threadId]);
  useEffect(() => {
    if (!isMonitorOk) {
      return;
    }
    const stopGenerator = {
      done: false
    };

    const monitor = async ({
      threadId,
      bosonXmtp,
      destinationAddress
    }: {
      threadId: ThreadId;
      bosonXmtp: BosonXmtpClient;
      destinationAddress: string;
    }) => {
      try {
        setHasError(false);
        for await (const incomingMessage of bosonXmtp.monitorThread(
          threadId,
          destinationAddress,
          stopGenerator
        )) {
          await addMessage({ ...incomingMessage, isValid: true });
          onMessagesReceived([incomingMessage]);
        }
      } catch (error) {
        console.error(error);
        setHasError(true);
        Sentry.captureException(error, {
          extra: {
            ...threadId,
            destinationAddress,
            action: "monitor",
            location: "chat-conversation"
          }
        });
      }
    };

    monitor({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      bosonXmtp: bosonXmtp!,
      destinationAddress,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      threadId: thread?.threadId!
    });

    return () => {
      stopGenerator.done = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonitorOk]);

  const onSentMessage = useCallback(
    async (messageData: MessageData, uuid: string) => {
      removePendingMessage(uuid);
      await addMessage({
        ...messageData,
        isValid: true,
        isPending: false,
        uuid
      });
    },
    [addMessage, removePendingMessage]
  );

  useEffect(() => {
    async function backOnline() {
      if (!thread?.messages || !bosonXmtp) {
        return;
      }
      for (const message of thread.messages) {
        if (!message.isPending || !message.uuid) {
          continue;
        }
        try {
          setHasError(false);
          const messageData = await bosonXmtp.encodeAndSendMessage(
            message.data,
            destinationAddress
          );
          if (!messageData) {
            throw new Error("Something went wrong while sending a message");
          }
          onSentMessage(messageData, message.uuid);
        } catch (error) {
          console.error(error);
          setHasError(true);
          Sentry.captureException(error, {
            extra: {
              ...threadId,
              destinationAddress,
              action: "backOnline",
              location: "chat-conversation"
            }
          });
        }
      }
    }

    window.addEventListener("online", backOnline);
    return () => {
      window.removeEventListener("online", backOnline);
    };
  }, [
    bosonXmtp,
    destinationAddress,
    onSentMessage,
    thread?.messages,
    threadId
  ]);

  const { isLteS, isLteM, isXXS, isS, isM, isL, isXL } = useBreakpoints();

  useEffect(() => {
    setChatListOpen(false);
  }, [setChatListOpen]);

  const detailsButton = useMemo(() => {
    if (chatListOpen && (isXXS || isS || isM)) {
      return (
        <HeaderButton
          type="button"
          onClick={() => {
            setExchangePreviewOpen(!isExchangePreviewOpen);
          }}
        >
          <span>&nbsp;</span>
        </HeaderButton>
      );
    }

    return (
      <HeaderButton
        onClick={() => {
          setExchangePreviewOpen(!isExchangePreviewOpen);
        }}
      >
        <span>{isExchangePreviewOpen ? "Hide Details" : "Details"}</span>
      </HeaderButton>
    );
  }, [chatListOpen, isExchangePreviewOpen, isXXS, isS, isM]);

  const ContainerWithSellerHeader = useCallback(
    ({ children }: { children: ReactNode }) => {
      return (
        <ConversationContainer>
          <GridHeader>
            <NavigationMobile>
              <HeaderButton
                type="button"
                onClick={() => {
                  if (isM && !prevPath) {
                    setChatListOpen(!chatListOpen);
                  } else if (isM && prevPath) {
                    navigate({ pathname: prevPath });
                  } else {
                    navigate({ pathname: chatUrl });
                  }
                }}
              >
                {(isM || isL || isXL) &&
                  prevPath &&
                  !prevPath.includes(chatUrl) &&
                  !prevPath.includes(`${chatUrl}/`) &&
                  !prevPath.includes(location.pathname) && (
                    <span>
                      <ArrowLeft size={14} />
                      Back
                    </span>
                  )}
                {isLteS && !chatListOpen && (
                  <span>
                    <ArrowLeft size={14} />
                    Back
                  </span>
                )}
              </HeaderButton>
            </NavigationMobile>
            <Header>
              <SellerComponent
                size={24}
                exchange={exchange}
                buyerOrSeller={buyerOrSellerToShow}
              />
            </Header>
            {isLteM && <Grid justifyContent="flex-end">{detailsButton}</Grid>}
          </GridHeader>
          {children}
        </ConversationContainer>
      );
    },
    [
      buyerOrSellerToShow,
      chatListOpen,
      detailsButton,
      exchange,
      isL,
      isLteM,
      isLteS,
      isM,
      isXL,
      navigate,
      prevPath,
      setChatListOpen,
      location.pathname
    ]
  );

  // const isConversationBeingLoaded = !thread && areThreadsLoading;
  const disableInputs = isErrorThread;

  if (!exchange) {
    return (
      <Container>
        <SimpleMessage>Select a message</SimpleMessage>
      </Container>
    );
  }

  if (!address) {
    return (
      <Container>
        <SimpleMessage>Connect your wallet</SimpleMessage>
      </Container>
    );
  }

  const canChat = !!bosonXmtp;
  return (
    <Container>
      {canChat ? (
        <ContainerWithSellerHeader>
          <Messages
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
                <h3 style={{ textAlign: "center" }}>
                  &#8593; Release to refresh
                </h3>
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
                          dayjs(thread.messages[index - 1].timestamp).startOf(
                            "day"
                          )
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
                    <Conversation
                      key={message.timestamp}
                      $alignStart={leftAligned}
                    >
                      <>
                        {showMessageSeparator && (
                          <MessageSeparator message={message} />
                        )}
                        <Message
                          exchange={exchange}
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
          </Messages>
          <ChatConversationBottom
            proposal={lastReceivedProposal}
            disableInputs={disableInputs}
            exchange={exchange}
            threadId={threadId}
            setHasError={setHasError}
            addMessage={addMessage}
            destinationAddress={destinationAddress}
            address={address}
            onSentMessage={onSentMessage}
            onTextAreaChange={onTextAreaChange}
            textAreaValue={textAreaValue}
            prevPath={prevPath}
            iAmTheBuyer={iAmTheBuyer}
          />
        </ContainerWithSellerHeader>
      ) : (
        <ContainerWithSellerHeader>
          <div style={{ display: "flex", flexGrow: 1 }}>
            <InitializeChat />
          </div>
        </ContainerWithSellerHeader>
      )}
      <ExchangeSidePreview
        exchange={exchange}
        refetchExchanges={refetchExchanges}
        disputeOpen={isExchangePreviewOpen}
        iAmTheBuyer={iAmTheBuyer}
        setHasError={setHasError}
        addMessage={addMessage}
        onSentMessage={onSentMessage}
        threadId={threadId}
        destinationAddress={destinationAddress}
        lastReceivedProposal={lastReceivedProposal}
        lastSentProposal={lastSentProposal}
      />
    </Container>
  );
};
export default ChatConversation;
