import {
  FileContent,
  MessageData,
  MessageType,
  ProposalContent,
  SupportedFileMimeTypes,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { validateMessage } from "@bosonprotocol/chat-sdk/dist/cjs/util/validators";
import dayjs from "dayjs";
import { utils } from "ethers";
import { ArrowLeft, UploadSimple } from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { Spinner } from "../../../components/loading/Spinner";
import { useModal } from "../../../components/modal/useModal";
import Grid from "../../../components/ui/Grid";
import SellerID from "../../../components/ui/SellerID";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { FileWithEncodedData } from "../../../lib/utils/files";
import { useInfiniteThread } from "../../../lib/utils/hooks/chat/useInfiniteThread";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "../ChatProvider/ChatContext";
import {
  BuyerOrSeller,
  MessageDataWithIsValid,
  ThreadObjectWithIsValid
} from "../types";
import ButtonProposal, {
  ButtonProposalHeight
} from "./ButtonProposal/ButtonProposal";
import ExchangeSidePreview from "./ExchangeSidePreview";
import Message from "./Message";
import MessageSeparator from "./MessageSeparator";

const Container = styled.div`
  display: flex;
  flex: 0 1 100%;
  flex-direction: row;
  position: relative;
  width: 100%;

  ${breakpoint.m} {
    flex: 0 1 75%;
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

const Loading = styled.div`
  display: flex;
  background-color: ${colors.lightGrey};
  justify-content: center;
`;
const Messages = styled.div<{ $overflow: string }>`
  background-color: ${colors.lightGrey};
  overflow: ${({ $overflow }) => $overflow};
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
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
  border-right: 1px solid ${colors.border};
`;

const Input = styled.div`
  width: 100%;
  font-size: 1rem;
  background: ${colors.lightGrey};
  height: max-content;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  padding: 0.75rem 1rem 0.75rem 1rem;
  &:focus {
    outline: none;
  }
  textarea {
    width: 100%;
    height: 1.3125rem;
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

const InputWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  min-height: ${ButtonProposalHeight};
`;

const UploadButtonWrapper = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(0, calc(${ButtonProposalHeight} / 4));
  margin: 0 1rem;
  :disabled {
    cursor: not-allowed;
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

interface Props {
  myBuyerId: string;
  mySellerId: string;
  exchange: Exchange | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
  exchangeIdNotOwned: boolean;
  prevPath: string;
  onTextAreaChange: (textAreaTargetValue: string) => void;
  textAreaValue: string | undefined;
}
const ChatConversation = ({
  myBuyerId,
  mySellerId,
  exchange,
  chatListOpen,
  setChatListOpen,
  exchangeIdNotOwned,
  prevPath,
  onTextAreaChange,
  textAreaValue
}: Props) => {
  const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
  const iAmTheSeller = mySellerId === exchange?.offer.seller.id;
  const iAmBoth = iAmTheBuyer && iAmTheSeller;
  const buyerOrSellerToShow: BuyerOrSeller = iAmBoth
    ? exchange?.offer.seller
    : iAmTheBuyer
    ? exchange?.offer.seller
    : exchange?.buyer || ({} as BuyerOrSeller);
  const destinationAddressLowerCase = iAmTheBuyer
    ? exchange?.offer.seller.operator
    : exchange?.buyer.wallet;
  const destinationAddress = destinationAddressLowerCase
    ? utils.getAddress(destinationAddressLowerCase)
    : "";
  const { bosonXmtp } = useChatContext();
  const [isMessageBeingSent, setIsMessageBeingSent] = useState<boolean>(false);
  const [dateIndex, setDateIndex] = useState<number>(0);
  const onFinishFetching = () => {
    if (bosonXmtp && !isBeginningOfTimes && !areThreadsLoading && !lastThread) {
      loadMoreMessages();
    }
  };
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
    isError: isErrorThread,
    lastData: lastThread,
    appendMessages
  } = useInfiniteThread({
    threadId,
    dateIndex,
    dateStep: "week",
    counterParty: destinationAddress,
    onFinishFetching
  });
  const loadMoreMessages = useCallback(
    (forceDateIndex?: number) => {
      if (!areThreadsLoading) {
        if (forceDateIndex !== undefined) {
          setDateIndex(forceDateIndex);
        } else {
          setDateIndex(dateIndex - 1);
        }
      }
    },
    [dateIndex, areThreadsLoading]
  );

  const addMessage = useCallback(
    async (
      thread: ThreadObjectWithIsValid | null,
      newMessageOrList: MessageDataWithIsValid | MessageDataWithIsValid[]
    ) => {
      const newMessages = Array.isArray(newMessageOrList)
        ? newMessageOrList
        : [newMessageOrList];
      if (thread) {
        const messagesWithIsValid = await Promise.all(
          newMessages.map(async (message) => {
            if (message.isValid === undefined) {
              message.isValid = await validateMessage(message.data);
            }
            return message;
          })
        );
        await appendMessages(messagesWithIsValid);
      } else {
        loadMoreMessages(0); // trigger getting the thread
      }
    },
    [loadMoreMessages, appendMessages]
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useKeepQueryParamsNavigate();
  const { address } = useAccount();
  useEffect(() => {
    if (!bosonXmtp || !thread?.threadId || !destinationAddress) {
      return;
    }
    const monitor = async () => {
      try {
        for await (const incomingMessage of await bosonXmtp.monitorThread(
          thread.threadId,
          destinationAddress
        )) {
          const isValid = await validateMessage(incomingMessage.data);
          await addMessage(thread, { ...incomingMessage, isValid });
        }
      } catch (error) {
        console.error(error);
      }
    };
    monitor().catch((error) => {
      console.error(error);
    });
  }, [bosonXmtp, destinationAddress, thread, addMessage, address]);
  const sendFilesToChat = useCallback(
    async (files: FileWithEncodedData[]) => {
      if (!bosonXmtp || !threadId) {
        return;
      }
      for (const file of files) {
        const imageContent: FileContent = {
          value: {
            encodedContent: file.encodedData,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type as SupportedFileMimeTypes
          }
        };
        const newMessage = {
          threadId,
          content: imageContent,
          contentType: MessageType.File,
          version
        } as const;
        const messageData = await bosonXmtp.encodeAndSendMessage(
          newMessage,
          destinationAddress
        );
        await addMessage(thread, { ...messageData, isValid: true });
      }
    },
    [addMessage, bosonXmtp, destinationAddress, threadId, thread]
  );
  const { isLteS, isLteM, isXXS, isS, isM, isL, isXL } = useBreakpoints();
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

  const isConversationBeingLoaded = !thread && areThreadsLoading;
  const disableInputs = isErrorThread || isConversationBeingLoaded;
  if (!exchange || !address) {
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
  return (
    <Container>
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
                  navigate({ pathname: BosonRoutes.Chat });
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
        <Loading>
          <Spinner
            style={{ visibility: areThreadsLoading ? "initial" : "hidden" }}
          />
        </Loading>

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
          >
            <>
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

        <TypeMessage>
          {exchange.disputed && (
            <Grid
              alignItems="flex-start"
              $width="auto"
              justifyContent="flex-start"
              $height="100%"
            >
              <ButtonProposal
                exchange={exchange}
                disabled={disableInputs}
                onSendProposal={async (proposal, proposalFiles) => {
                  if (!threadId || !bosonXmtp) {
                    return;
                  }
                  try {
                    const proposalContent: ProposalContent = {
                      value: {
                        title: proposal.title,
                        description: proposal.description,
                        proposals: proposal.proposals,
                        disputeContext: proposal.disputeContext
                      }
                    };
                    const newMessage = {
                      threadId,
                      content: proposalContent,
                      contentType: MessageType.Proposal,
                      version
                    } as const;
                    const messageData = await bosonXmtp.encodeAndSendMessage(
                      newMessage,
                      destinationAddress
                    );
                    await addMessage(thread, { ...messageData, isValid: true });
                    if (proposalFiles.length) {
                      await sendFilesToChat(proposalFiles);
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Grid>
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
                  const value = e.target.value.trim();
                  if (
                    e.key === "Enter" &&
                    bosonXmtp &&
                    threadId &&
                    value &&
                    !isMessageBeingSent
                  ) {
                    try {
                      setIsMessageBeingSent(true);
                      const newMessage = {
                        threadId,
                        content: {
                          value
                        },
                        contentType: MessageType.String,
                        version
                      } as const;
                      const messageData = await bosonXmtp.encodeAndSendMessage(
                        newMessage,
                        destinationAddress
                      );
                      setIsMessageBeingSent(false);
                      await addMessage(thread, {
                        ...messageData,
                        isValid: true
                      });
                      onTextAreaChange("");
                    } catch (error) {
                      console.error(error);
                      setIsMessageBeingSent(false);
                    }
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
                    try {
                      await sendFilesToChat(files);
                    } catch (error) {
                      console.error(error);
                    }
                  }
                })
              }
            >
              <UploadSimple size={24} />
            </UploadButtonWrapper>
          </InputWrapper>
        </TypeMessage>
      </ConversationContainer>
      <ExchangeSidePreview
        exchange={exchange}
        disputeOpen={isExchangePreviewOpen}
      />
    </Container>
  );
};
export default ChatConversation;
