import { BosonXmtpClient } from "@bosonprotocol/chat-sdk/dist/esm/index";
import {
  MessageData,
  MessageType,
  ProposalContent,
  ThreadId
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/esm/util/validators";
import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { ArrowLeft } from "phosphor-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import InitializeChat from "../../../../components/modal/components/Chat/components/InitializeChat";
import { Grid } from "../../../../components/ui/Grid";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { zIndex } from "../../../../lib/styles/zIndex";
import { useInfiniteThread } from "../../../../lib/utils/hooks/chat/useInfiniteThread";
import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import useCheckExchangePolicy from "../../../../lib/utils/hooks/offer/useCheckExchangePolicy";
import { useBreakpoints } from "../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "../../ChatProvider/ChatContext";
import { chatUrl } from "../../const";
import { BuyerOrSeller, MessageDataWithInfo } from "../../types";
import ExchangeSidePreview from "../ExchangeSidePreview";
import { ChatConversationBottom } from "./ChatConversationBottom";
import { Messages } from "./Messages";
import { SellerComponent } from "./SellerComponent";

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
  min-height: 500px;
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

const SimpleMessage = styled.p`
  all: unset;
  display: block;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: ${colors.greyLight};
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
  color: ${colors.violet};
  z-index: ${zIndex.LandingTitle};
`;

const NavigationMobile = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  svg {
    color: ${colors.violet};
    margin-right: 0.438rem;
    margin-bottom: -0.1875rem;
  }
  ${breakpoint.l} {
    display: none;
  }
`;

type ChatConversationProps = {
  myBuyerId: string;
  mySellerId: string;
  exchange: Exchange | undefined;
  sellerLensProfile?: Profile;
  dispute: subgraph.DisputeFieldsFragment | undefined;
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
  sellerLensProfile,
  dispute,
  chatListOpen,
  setChatListOpen,
  prevPath,
  onTextAreaChange,
  textAreaValue,
  refetchExchanges
}: ChatConversationProps) => {
  const { account: address } = useAccount();
  const { bosonXmtp } = useChatContext();
  const [hasError, setHasError] = useState<boolean>(false);
  const location = useLocation();
  const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
  const iAmTheSeller = mySellerId === exchange?.offer.seller.id;
  const iAmBoth = iAmTheBuyer && iAmTheSeller;
  const buyerOrSellerToShow: BuyerOrSeller = useMemo(
    () =>
      iAmBoth
        ? exchange?.seller
        : iAmTheBuyer
          ? exchange?.seller
          : exchange?.buyer || ({} as BuyerOrSeller),
    [exchange?.buyer, exchange?.seller, iAmBoth, iAmTheBuyer]
  );
  const destinationAddressLowerCase = iAmTheBuyer
    ? exchange?.offer.seller.assistant
    : exchange?.buyer.wallet;
  const destinationAddress = destinationAddressLowerCase
    ? utils.getAddress(destinationAddressLowerCase)
    : "";
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
  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: exchange?.offer?.id
  });
  const [lastReceivedProposal, setLastReceivedProposal] =
    useState<MessageData | null>(null);
  const [lastSentProposal, setLastSentProposal] = useState<MessageData | null>(
    null
  );
  const [acceptedProposal, setAcceptedProposal] = useState<MessageData | null>(
    null
  );
  const filterProposals = (message: MessageData) =>
    [MessageType.Proposal, MessageType.CounterProposal].includes(
      message.data.contentType
    );
  const onMessagesReceived = useCallback(
    (messages: MessageData[]) => {
      const sortedMessages = messages.sort((msgA, msgB) => {
        return Number((msgB.timestamp - msgA.timestamp).toString());
      });
      const tempAcceptedProposal = sortedMessages.find((message) => {
        return message.data.contentType === MessageType.AcceptProposal;
      });
      const tempLastReceivedProposal = sortedMessages
        .filter(filterProposals)
        .find((message) => {
          const isAProposalFromSomeoneElse =
            message.sender.toLowerCase() !==
            bosonXmtp?.client.inboxId?.toLowerCase();
          const hasProposals = !!(message.data.content as ProposalContent)
            ?.value.proposals?.length;
          return hasProposals && isAProposalFromSomeoneElse;
        });
      const tempLastSentProposal = sortedMessages
        .filter(filterProposals)
        .find((message) => {
          const isMyProposal =
            message.sender.toLowerCase() ===
            bosonXmtp?.client.inboxId?.toLowerCase();
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
      if (tempAcceptedProposal) {
        setAcceptedProposal((prev) => {
          return (prev?.timestamp || 0) > tempAcceptedProposal.timestamp
            ? prev
            : tempAcceptedProposal;
        });
      }
    },
    [bosonXmtp?.client.inboxId]
  );
  useEffect(() => {
    if (!bosonXmtp?.client.conversations) return;

    bosonXmtp.client.conversations.syncAll();

    const interval = setInterval(() => {
      bosonXmtp.client.conversations.syncAll();
    }, 5000);

    return () => clearInterval(interval);
  }, [bosonXmtp?.client.conversations]);

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
      : new Date("2025-04-14"),
    checkCustomCondition: (mergedThread) => {
      // load conversation until we receive a proposal

      if (!mergedThread) {
        return false;
      }
      const sortedProposals = [...mergedThread.messages]
        .filter(filterProposals)
        .sort((msgA, msgB) => {
          return Number((msgB.timestamp - msgA.timestamp).toString());
        });
      return sortedProposals.some((message) => {
        const isAProposalFromSomeoneElse =
          message.sender.toLowerCase() !== bosonXmtp?.inboxId;
        return isAProposalFromSomeoneElse;
      });
    },
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
    if (thread?.messages) {
      onMessagesReceived(structuredClone(thread.messages));
    }
  }, [thread?.messages, onMessagesReceived]);

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
      const messagesWithIsValid = newMessages.map((message) => {
        if (message.isValid === undefined) {
          message.isValid = validateMessage(message.data);
        }
        return message;
      });
      appendMessages(messagesWithIsValid);
    },
    [appendMessages]
  );
  const previousThreadMessagesRef = useRef<MessageData[]>(
    thread?.messages || []
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesContainerRef.current?.scrollBy({
      top: Number.MAX_SAFE_INTEGER,
      behavior: "smooth"
    });
  }, []);
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
          scrollToBottom(); // every time we send/receive a message
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

  const ButtonsAndSeller = useMemo(() => {
    return (
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
            accountToShow={buyerOrSellerToShow}
            lensProfile={sellerLensProfile}
          />
        </Header>
        {isLteM && <Grid justifyContent="flex-end">{detailsButton}</Grid>}
      </GridHeader>
    );
  }, [
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
    location.pathname,
    sellerLensProfile
  ]);
  const ContainerWithSellerHeader = useCallback(
    ({ children }: { children: ReactNode }) => {
      return (
        <ConversationContainer>
          {ButtonsAndSeller}
          {children}
        </ConversationContainer>
      );
    },
    [ButtonsAndSeller]
  );

  const isConversationBeingLoaded = !thread && areThreadsLoading;
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
            hasError={hasError}
            isBeginningOfTimes={isBeginningOfTimes}
            exchange={exchange}
            dispute={dispute}
            loadMoreMessages={loadMoreMessages}
            thread={thread}
            areThreadsLoading={areThreadsLoading}
            address={address}
            iAmTheBuyer={iAmTheBuyer}
            messagesContainerRef={messagesContainerRef}
            lastReceivedProposal={lastReceivedProposal}
            lastSentProposal={lastSentProposal}
          />
          <ChatConversationBottom
            proposal={lastReceivedProposal}
            isConversationBeingLoaded={isConversationBeingLoaded}
            disableInputs={disableInputs}
            exchange={exchange}
            dispute={dispute}
            threadId={threadId}
            setHasError={setHasError}
            addMessage={addMessage}
            destinationAddress={destinationAddress}
            address={address as `0x${string}`}
            onSentMessage={onSentMessage}
            onTextAreaChange={onTextAreaChange}
            textAreaValue={textAreaValue}
            prevPath={prevPath}
            iAmTheBuyer={iAmTheBuyer}
            acceptedProposal={acceptedProposal}
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
        dispute={dispute}
        refetchExchanges={refetchExchanges}
        disputeOpen={isExchangePreviewOpen}
        iAmTheBuyer={iAmTheBuyer}
        exchangePolicyCheckResult={exchangePolicyCheckResult}
        iAmTheSeller={iAmTheSeller}
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
