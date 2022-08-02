// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ArrowLeft, UploadSimple } from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../../components/modal/useModal";
import SellerID from "../../../components/ui/SellerID";
import { BosonRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
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
  padding-bottom: 0px;
  min-height: unset;
  max-height: unset;
  ${breakpoint.m} {
    height: 6.25rem;
    padding: 1.5rem;
    min-height: 6.125rem;
    max-height: 6.125rem;
  }
  @media only screen and (max-width: 1200px) and (min-width: 981px) {
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
    height: 21px;
    max-width: calc(100% - 2.1875rem);
    border: none;
    display: block;
    max-height: 16.875rem;
    overflow-y: auto;
    overflow-wrap: break-word;
    border: none;
    font-family: "Plus Jakarta Sans";
    background: none;
    resize: none;
    padding-right: 0.625rem;
    &:focus {
      outline: none;
    }
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
`;

const ErrorMessage = () => (
  <Container>
    <SimpleMessage>There has been an error, try again or refresh</SimpleMessage>
  </Container>
);

const getWasItSentByMe = (
  myBuyerId: string,
  mySellerId: string,
  from: string
) => {
  return myBuyerId === from || mySellerId === from;
};

interface threadsExchangeIds {
  threadId: string;
  value: string;
}

interface Props {
  thread: Thread | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
  exchangeIdNotOwned: boolean;
  exchangeId: string;
  threadsExchangeIds: threadsExchangeIds[] | undefined;
  prevPath: string;
  onTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textAreaValue: string | undefined;
}
export default function ChatConversation({
  thread,
  chatListOpen,
  setChatListOpen,
  exchangeIdNotOwned,
  prevPath,
  onTextAreaChange,
  textAreaValue
}: Props) {
  const [isExchangePreviewOpen, setExchangePreviewOpen] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const { address } = useAccount();
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
  if (!exchange) {
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
                navigate(`/chat`, { replace: true });
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
        <Messages>
          {thread.messages.map((message) => {
            return (
              <Conversation
                key={message.id}
                $alignStart={!getWasItSentByMe(buyerId, sellerId, message.from)}
              >
                <>
                  <MessageSeparator message={message} />
                  <Message
                    thread={thread}
                    message={message}
                    isLeftAligned={
                      !getWasItSentByMe(buyerId, sellerId, message.from)
                    }
                  >
                    <SellerComponent size={32} withProfileText={false} />
                  </Message>
                </>
              </Conversation>
            );
          })}
        </Messages>
        <TypeMessage>
          <ButtonProposalContainer>
            <ButtonProposal exchange={exchange} />
          </ButtonProposalContainer>
          <InputWrapper>
            <Input>
              <textarea
                ref={textareaRef}
                value={textAreaValue}
                onChange={onTextAreaChange}
              >
                {textAreaValue}
              </textarea>
            </Input>
            <UploadSimple
              size={24}
              data-upload
              onClick={() =>
                showModal("UPLOAD_MODAL", {
                  title: "Upload documents",
                  onUploadedFiles: (files: File[]) => {
                    console.log(files);
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
