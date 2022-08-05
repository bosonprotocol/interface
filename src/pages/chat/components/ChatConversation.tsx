import {
  ImageContent,
  MessageData,
  MessageType,
  ProposalContent,
  SupportedImageMimeTypes
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { ArrowLeft, UploadSimple } from "phosphor-react";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../../components/modal/useModal";
import SellerID from "../../../components/ui/SellerID";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint, breakpointNumbers } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { FileWithEncodedData } from "../../../lib/utils/files";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { useChatContext } from "../ChatProvider/ChatContext";
import { Thread } from "../types";
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
const Messages = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
  width: 100vw;
  ${breakpoint.m} {
    width: unset;
  }
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

  [data-upload] {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0.5625rem;
    margin: 0 1rem;
    > *:not(rect) {
      stroke: ${colors.darkGrey};
    }
  }
`;

const ButtonProposalContainer = styled.span`
  height: 100%;
  display: flex;
  align-items: flex-start;
  button {
    min-height: 46px;
  }
`;

const ErrorMessage = () => (
  <Container>
    <SimpleMessage>There has been an error, try again or refresh</SimpleMessage>
  </Container>
);

const getWasItSentByMe = (myAddress: string | undefined, sender: string) => {
  return myAddress === sender;
};

interface Props {
  addMessage: (thread: Thread, newMessage: MessageData) => void;
  thread: Thread | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
  exchangeIdNotOwned: boolean;
  exchangeId: string;
  prevPath: string;
  onTextAreaChange: (textAreaTargetValue: string) => void;
  textAreaValue: string | undefined;
}
const ChatConversation = forwardRef(
  (
    {
      addMessage,
      thread,
      chatListOpen,
      setChatListOpen,
      exchangeIdNotOwned,
      prevPath,
      onTextAreaChange,
      textAreaValue
    }: Props,
    intersectRef: ForwardedRef<HTMLDivElement>
  ) => {
    // const { intersectRef, messagesRef } = refs as unknown as {
    //   intersectRef: React.ForwardedRef<HTMLDivElement>;
    //   messagesRef: React.ForwardedRef<HTMLDivElement>;
    // };
    // console.log("chatconversation", intersectRef, messagesRef);
    const { bosonXmtp } = useChatContext();
    const threadMessagesNumberRef = useRef<number>(
      thread?.messages.length || 0
    );
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(
      (scrollOptions: ScrollIntoViewOptions) =>
        lastMessageRef.current?.scrollIntoView(scrollOptions),
      []
    );
    useEffect(() => {
      if (thread?.messages.length !== threadMessagesNumberRef.current) {
        if (threadMessagesNumberRef.current) {
          scrollToBottom({ behavior: "smooth" }); // every time we send/receive a message
        } else {
          scrollToBottom({}); // when the conversation loads
        }

        threadMessagesNumberRef.current = thread?.messages.length || 0;
      }
    }, [thread?.messages.length, scrollToBottom]);
    const [isExchangePreviewOpen, setExchangePreviewOpen] =
      useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const navigate = useNavigate();
    const { address } = useAccount();
    const destinationAddress = thread?.exchange?.offer.seller.operator || "";
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
      monitor()
        .then(() => {
          // TODO:
        })
        .catch((error) => {
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
    const sellerId = _sellerId || "2"; // TODO: remove
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

    const SellerComponent = useCallback(
      ({
        size,
        withProfileText
      }: {
        size: number;
        withProfileText?: boolean;
      }) => {
        if (!thread) {
          return null;
        }
        return (
          <SellerID
            seller={thread.exchange?.offer.seller || ({} as never)}
            offerName={thread.exchange?.offer.metadata.name || ""}
            withProfileImage
            accountImageSize={size}
            withProfileText={withProfileText}
          />
        );
      },
      [thread]
    );

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

    if (
      !isLoadingSeller &&
      !isLoadingBuyer &&
      (isErrorSellers || isErrorBuyers || (!sellerId && !buyerId))
    ) {
      return <ErrorMessage />;
    }

    if (!thread) {
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
    const { exchange } = thread;
    if (!exchange || !bosonXmtp) {
      return <ErrorMessage />;
    }

    return (
      <>
        <Container>
          <NavigationMobile>
            <button
              onClick={() => {
                if (isM && !prevPath) {
                  setChatListOpen(!chatListOpen);
                } else if (isM && prevPath) {
                  navigate(prevPath, { replace: true });
                } else {
                  navigate(`/${BosonRoutes.Chat}`, { replace: true });
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
          <Header>{!chatListOpen && <SellerComponent size={24} />}</Header>

          <Messages data-messages>
            {thread.messages.map((message, index) => {
              const isFirstMessage = index === 0;
              const isLastMessage = index === thread.messages.length - 1;
              const leftAligned = !getWasItSentByMe(address, message.sender);
              return (
                <Conversation key={message.timestamp} $alignStart={leftAligned}>
                  <>
                    {isFirstMessage && (
                      <div
                        ref={intersectRef}
                        style={{
                          height: "100px",
                          width: "100%",
                          background: "red"
                        }}
                      ></div>
                    )}
                    <MessageSeparator message={message} />
                    <Message
                      thread={thread}
                      message={message}
                      isLeftAligned={leftAligned}
                      ref={isLastMessage ? lastMessageRef : null}
                    >
                      <SellerComponent size={32} withProfileText={false} />
                    </Message>
                  </>
                </Conversation>
              );
            })}
          </Messages>
          <TypeMessage>
            {exchange.disputed && (
              <ButtonProposalContainer>
                <ButtonProposal
                  exchange={exchange}
                  onSendProposal={async (proposal, proposalFiles) => {
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
                  value={textAreaValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    const didPressEnter = value[value.length - 1] === `\n`;
                    if (!didPressEnter) {
                      onTextAreaChange(value);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
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
              <UploadSimple
                size={24}
                data-upload
                onClick={() =>
                  showModal("UPLOAD_MODAL", {
                    title: "Upload documents",
                    withEncodedData: true,
                    onUploadedFilesWithData: async (files) => {
                      await sendFilesToChat(files);
                    }
                  })
                }
              />
            </InputWrapper>
          </TypeMessage>
        </Container>
        <ExchangeSidePreview
          thread={thread}
          disputeOpen={isExchangePreviewOpen}
        />
      </>
    );
  }
);
export default ChatConversation;
