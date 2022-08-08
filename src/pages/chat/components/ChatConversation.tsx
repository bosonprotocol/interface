import {
  ImageContent,
  MessageData,
  MessageType,
  ProposalContent,
  SupportedImageMimeTypes,
  ThreadId,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { CircleNotch } from "phosphor-react";
import { ArrowLeft, UploadSimple } from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../../components/modal/useModal";
import SellerID from "../../../components/ui/SellerID";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint, breakpointNumbers } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { FileWithEncodedData } from "../../../lib/utils/files";
import { useInfiniteThread } from "../../../lib/utils/hooks/chat/useInfiniteThread";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "../ChatProvider/ChatContext";
import ButtonProposal from "./ButtonProposal/ButtonProposal";
import ExchangeSidePreview from "./ExchangeSidePreview";
import Message from "./Message";
import MessageSeparator from "./MessageSeparator";

const Container = styled.div`
  display: flex;
  flex: 0 1 75%;
  flex-direction: column;
  position: relative;
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
  padding: 1.5rem;
  height: 0;
  display: flex;
  align-items: center;
  padding-bottom: 0;
  min-height: unset;
  max-height: unset;
  ${breakpoint.m} {
    height: 6.25rem;
    padding: 1.5rem;
    min-height: 6.125rem;
    max-height: 6.125rem;
  }
  @media only screen and (max-width: ${breakpointNumbers.l}px) and (min-width: ${breakpointNumbers.m}px) {
    min-height: 87px;
  }
  svg:nth-of-type(1) {
    margin-right: 0.5rem;
  }
  svg {
    ${breakpoint.m} {
      display: none;
    }
  }

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
    position: absolute;
    top: 17px;
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
`;
const Spinner = styled(CircleNotch)`
  animation: spin 2s infinite linear;
  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }
`;
const Loading = styled.div`
  display: flex;
  background-color: ${colors.lightGrey};
  justify-content: center;
  padding: 1rem;
`;
const Messages = styled.div`
  /* flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
  width: 100vw;
  ${breakpoint.m} {
    width: unset;
  } */

  height: 300;
  background-color: red;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
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

const TypeMessage = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.5rem 1rem 1.5rem 1rem;
`;

const Input = styled.div`
  width: 100%;
  font-size: 1rem;
  background: ${colors.lightGrey};
  border: 0px solid ${colors.border};
  height: max-content;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  padding: 0.75rem 1rem 0.75rem 1rem;
  max-width: calc(100vw - 10.9375rem);
  &:focus {
    outline: none;
  }
  textarea {
    width: 100%;
    height: 1.3125rem;
    max-width: calc(100% - 2.1875rem);
    border: none;
    display: block;
    max-height: 16.875rem;
    overflow-y: auto;
    overflow-wrap: break-word;
    border: none;
    background: none;
    resize: none;
    padding-right: 0.625rem;
    &:focus {
      outline: none;
    }
  }
`;

const TextArea = styled.textarea`
  font-family: Plus Jakarta Sans;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0;
  text-align: left;
  cursor: text;
  :disabled {
    cursor: not-allowed;
  }
`;

const SimpleMessage = styled.p`
  all: unset;
  display: block;
  height: 100%;
  padding: 1rem;
  background: ${colors.lightGrey};
`;

const NavigationMobile = styled.div`
  display: flex;
  min-height: 3.125rem;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  button {
    font-size: 0.75rem;
    font-weight: 600;
    background: none;
    padding: none;
    border: none;
    color: ${colors.secondary};
    z-index: ${zIndex.LandingTitle};
  }
  svg {
    color: ${colors.secondary};
    margin-right: 0.438rem;
    margin-bottom: -0.1875rem;
  }
  ${breakpoint.l} {
    display: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const ButtonProposalContainer = styled.span`
  height: 100%;
  display: flex;
  align-items: flex-start;
  button {
    min-height: 46px;
  }
`;

const UploadButtonWrapper = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0.5625rem;
  margin: 0 1rem;
  > *:not(rect) {
    stroke: ${colors.darkGrey};
  }
  :disabled {
    cursor: not-allowed;
  }
`;

const SellerComponent = ({
  size,
  withProfileText,
  exchange
}: {
  size: number;
  withProfileText?: boolean;
  exchange: Exchange | undefined;
}) => {
  if (!exchange) {
    return null;
  }
  return (
    <SellerID
      seller={exchange.offer.seller}
      offerName={exchange.offer.metadata.name || ""}
      withProfileImage
      accountImageSize={size}
      withProfileText={withProfileText}
    />
  );
};

const ErrorMessage = () => (
  <Container>
    <SimpleMessage>There has been an error, try again or refresh</SimpleMessage>
  </Container>
);

const getWasItSentByMe = (myAddress: string | undefined, sender: string) => {
  return myAddress === sender;
};

interface Props {
  exchange: Exchange | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
  exchangeIdNotOwned: boolean;
  prevPath: string;
  onTextAreaChange: (textAreaTargetValue: string) => void;
  textAreaValue: string | undefined;
}
const ChatConversation = ({
  exchange,
  chatListOpen,
  setChatListOpen,
  exchangeIdNotOwned,
  prevPath,
  onTextAreaChange,
  textAreaValue
}: Props) => {
  const [dateIndex, setDateIndex] = useState<number>(0);
  const addMessage = useCallback(
    (thread: ThreadObject, newMessage: MessageData) => {
      thread.messages = [...thread.messages, newMessage];
    },
    []
  );
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
  const {
    data: thread,
    isLoading: areThreadsLoading,
    isBeginningOfTimes,
    isError: isErrorThread
  } = useInfiniteThread({
    threadId,
    dateIndex,
    dateStep: "day", // TODO: change to week
    counterParty: exchange?.offer.seller.operator || ""
  });
  const loadMoreMessages = useCallback(() => {
    if (!areThreadsLoading) {
      setDateIndex(dateIndex - 1);
    }
  }, [dateIndex, areThreadsLoading]);
  const hasMoreMessages = !isBeginningOfTimes;
  const previousThreadMessagesNumberRef = useRef<number>(
    thread?.messages.length || 0
  );
  const dataMessagesRef = useRef<HTMLDivElement>(null);
  const firstMessageRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollToTop = useCallback(
    (scrollOptions: ScrollIntoViewOptions) =>
      firstMessageRef.current?.scrollIntoView(scrollOptions),
    []
  );
  const scrollToBottom = useCallback(
    (scrollOptions: ScrollIntoViewOptions) =>
      lastMessageRef.current?.scrollIntoView(scrollOptions),
    []
  );
  useEffect(() => {
    if (thread?.messages.length !== previousThreadMessagesNumberRef.current) {
      if (previousThreadMessagesNumberRef.current) {
        scrollToBottom({
          behavior: "smooth"
        }); // every time we send/receive a message
      } else {
        scrollToBottom({}); // when the conversation loads
      }

      previousThreadMessagesNumberRef.current = thread?.messages.length || 0;
    }
  }, [scrollToBottom, scrollToTop, thread?.messages]);
  const [isExchangePreviewOpen, setExchangePreviewOpen] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  const destinationAddress = exchange?.offer.seller.operator || "";
  useEffect(() => {
    if (!bosonXmtp || !thread?.threadId || !destinationAddress) {
      return;
    }
    const monitor = async () => {
      for await (const incomingMessage of await bosonXmtp.monitorThread(
        thread.threadId,
        destinationAddress
      )) {
        addMessage(thread, {
          sender: destinationAddress,
          authorityId: "",
          recipient: address || "",
          timestamp: Date.now(),
          data: incomingMessage
        });
      }
    };
    monitor().catch((error) => {
      console.error(error);
    });
  }, [bosonXmtp, destinationAddress, thread, addMessage, address]);
  const sendFilesToChat = useCallback(
    async (files: FileWithEncodedData[]) => {
      if (!thread || !bosonXmtp) {
        return;
      }
      for (const file of files) {
        const imageContent: ImageContent = {
          value: {
            encodedContent: file.encodedData,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type as SupportedImageMimeTypes
          }
        };
        const newMessage = {
          threadId: thread.threadId,
          content: imageContent,
          contentType: MessageType.Image,
          version: "1"
        };
        await bosonXmtp.encodeAndSendMessage(newMessage, destinationAddress);
        addMessage(thread, {
          sender: address || "",
          authorityId: "",
          recipient: destinationAddress,
          timestamp: Date.now(),
          data: newMessage
        });
      }
    },
    [addMessage, address, bosonXmtp, destinationAddress, thread]
  );
  const { isLteS, isXXS, isS, isM, isL, isXL } = useBreakpoints();
  const {
    seller: {
      sellerId: _sellerId,
      isError: isErrorSellers,
      isLoading: isLoadingSeller
    },
    buyer: { buyerId, isError: isErrorBuyers, isLoading: isLoadingBuyer }
  } = useBuyerSellerAccounts(address || "");
  const sellerId = _sellerId || "";
  const { showModal } = useModal();

  useEffect(() => {
    setChatListOpen(false);
  }, [setChatListOpen]);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [prevPath, textAreaValue]);

  const detailsButton = useMemo(() => {
    if (chatListOpen && (isXXS || isS || isM)) {
      return (
        <button
          onClick={() => {
            setExchangePreviewOpen(!isExchangePreviewOpen);
          }}
        >
          <span>&nbsp;</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          setExchangePreviewOpen(!isExchangePreviewOpen);
        }}
      >
        <span>{isExchangePreviewOpen ? "Hide Details" : "Details"}</span>
      </button>
    );
  }, [chatListOpen, isExchangePreviewOpen, isXXS, isS, isM]);
  // TODO: comment out
  // if (
  //   !isLoadingSeller &&
  //   !isLoadingBuyer &&
  //   (isErrorSellers || isErrorBuyers || (!sellerId && !buyerId))
  // ) {
  //   return <ErrorMessage />;
  // }

  const isConversationBeingLoaded = !thread && areThreadsLoading;
  const disableInputs = isErrorThread || isConversationBeingLoaded;
  console.log({
    thread,
    isConversationBeingLoaded,
    disableInputs,
    isErrorThread,
    exchangeId: exchange?.id
  });
  if (!thread && !disableInputs) {
    return (
      <Container>
        <SimpleMessage>
          {exchangeIdNotOwned
            ? "You don't have this exchange"
            : "Select a message"}
        </SimpleMessage>
      </Container>
    );
  }
  if (!exchange || !bosonXmtp) {
    return <ErrorMessage />;
  }
  console.log({ hasMoreMessages });
  return (
    <>
      <Container>
        <NavigationMobile>
          <button
            onClick={() => {
              if (isM && !prevPath) {
                setChatListOpen(!chatListOpen);
              } else if (isM && prevPath) {
                navigate({ pathname: prevPath }, { replace: true });
              } else {
                navigate(
                  { pathname: `/${BosonRoutes.Chat}` },
                  { replace: true }
                );
              }
            }}
          >
            {(isM || isL || isXL) &&
              prevPath &&
              !prevPath.includes(`${BosonRoutes.Chat}/`) && (
                <span>
                  <ArrowLeft size={14} />
                  Back
                </span>
              )}
            {isLteS && !chatListOpen && (
              <span>
                <ArrowLeft size={14} />
                Back to messages
              </span>
            )}
          </button>
          {detailsButton}
        </NavigationMobile>
        <Header>
          {!chatListOpen && <SellerComponent size={24} exchange={exchange} />}
        </Header>
        {areThreadsLoading && (
          <Loading>
            <Spinner />
          </Loading>
        )}
        <Messages data-messages ref={dataMessagesRef} id="messages">
          <InfiniteScroll
            inverse
            next={loadMoreMessages}
            hasMore={hasMoreMessages}
            loader={<></>}
            dataLength={thread?.messages.length || 0}
            scrollableTarget="messages"
            scrollThreshold="200px"
          >
            <>
              {thread?.messages.map((message, index) => {
                const isFirstMessage = index === 0;
                const isLastMessage = index === thread.messages.length - 1;
                const leftAligned = !getWasItSentByMe(address, message.sender);
                const ref = isLastMessage
                  ? lastMessageRef
                  : isFirstMessage
                  ? firstMessageRef
                  : null;
                // TODO: fix when the message separator is shown
                return (
                  <Conversation
                    key={message.timestamp}
                    $alignStart={leftAligned}
                  >
                    <>
                      <MessageSeparator message={message} />
                      <Message
                        exchange={exchange}
                        message={message}
                        isLeftAligned={leftAligned}
                        ref={ref}
                      >
                        <SellerComponent
                          size={32}
                          withProfileText={false}
                          exchange={exchange}
                        />
                      </Message>
                    </>
                  </Conversation>
                );
              })}
            </>
          </InfiniteScroll>
        </Messages>
        {/* ) : (
          <Messages></Messages>
        )} */}
        <TypeMessage>
          {exchange.disputed && (
            <ButtonProposalContainer>
              <ButtonProposal
                exchange={exchange}
                disabled={disableInputs}
                onSendProposal={async (proposal, proposalFiles) => {
                  if (!thread) {
                    return;
                  }
                  const proposalContent: ProposalContent = {
                    value: {
                      title: proposal.title,
                      description: proposal.description,
                      proposals: proposal.proposals,
                      disputeContext: proposal.disputeContext
                    }
                  };
                  const newMessage = {
                    threadId: thread.threadId,
                    content: proposalContent,
                    contentType: MessageType.Proposal,
                    version: "1"
                  };
                  await bosonXmtp.encodeAndSendMessage(
                    newMessage,
                    destinationAddress
                  );
                  addMessage(thread, {
                    sender: address || "",
                    authorityId: "",
                    recipient: destinationAddress,
                    timestamp: Date.now(),
                    data: newMessage
                  });
                  if (proposalFiles.length) {
                    await sendFilesToChat(proposalFiles);
                  }
                }}
              />
            </ButtonProposalContainer>
          )}
          <InputWrapper>
            <Input>
              <TextArea
                ref={textareaRef}
                placeholder="Write a message"
                disabled={disableInputs}
                value={textAreaValue}
                onChange={(e) => {
                  const value = e.target.value;
                  const didPressEnter = value[value.length - 1] === `\n`;
                  if (!didPressEnter) {
                    onTextAreaChange(value);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && thread) {
                    const newMessage = {
                      threadId: thread.threadId,
                      content: {
                        value: e.target.value
                      },
                      contentType: MessageType.String,
                      version: "1"
                    };
                    await bosonXmtp.encodeAndSendMessage(
                      newMessage,
                      destinationAddress
                    );
                    addMessage(thread, {
                      sender: address || "",
                      authorityId: "",
                      recipient: destinationAddress,
                      timestamp: Date.now(),
                      data: newMessage
                    });
                    onTextAreaChange("");
                  }
                }}
              >
                {textAreaValue}
              </TextArea>
            </Input>
            <UploadButtonWrapper
              type="button"
              disabled={disableInputs}
              onClick={() =>
                showModal("UPLOAD_MODAL", {
                  title: "Upload documents",
                  withEncodedData: true,
                  onUploadedFilesWithData: async (files) => {
                    await sendFilesToChat(files);
                  }
                })
              }
            >
              <UploadSimple size={24} />
            </UploadButtonWrapper>
          </InputWrapper>
        </TypeMessage>
      </Container>
      <ExchangeSidePreview
        exchange={exchange}
        disputeOpen={isExchangePreviewOpen}
      />
    </>
  );
};
export default ChatConversation;
