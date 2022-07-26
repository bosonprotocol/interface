import { UploadSimple } from "phosphor-react";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../../components/modal/useModal";
import SellerID from "../../../components/ui/SellerID";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Thread } from "../types";
import ButtonProposal from "./ButtonProposal/ButtonProposal";
import Dispute from "./Dispute";
import Message from "./Message";

const Container = styled.div`
  display: flex;
  flex: 0 1 75%;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  [data-testid="seller-info"] {
    font-weight: 600;
    font-size: 24px;
    color: initial;
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
  padding: 1.5rem;
  height: 6.25rem;
  display: flex;
  align-items: center;
  svg:nth-of-type(1) {
    margin-right: 0.5rem;
  }
  svg {
    ${breakpoint.m} {
      display: none;
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
  height: 5rem;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 24px 16px 24px 16px;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1rem;
  background: ${colors.lightGrey};
  border: 0px solid ${colors.border};
  height: 2.7rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  padding: 0.75rem 1rem 0.75rem 1rem;
  &:focus {
    outline: none;
  }
`;

const BtnProposal = styled.button`
  border: 3px solid ${colors.secondary};
  padding-left: 1.2rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  margin-right: 0.875rem;
  height: 2.7rem;
  font-weight: 600;
  color: ${colors.secondary};
  background-color: transparent;
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.6rem;
    ${breakpoint.xs} {
      transform: translateY(-50%) scale(0.7);
    }
    ${breakpoint.s} {
      transform: translateY(-50%);
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
    top: 50%;
    transform: translateY(-50%);
    margin: 0 1rem;
    > *:not(rect) {
      stroke: ${colors.darkGrey};
    }
  }
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

interface Props {
  thread: Thread | undefined;
  chatListOpen: boolean;
  setChatListOpen: (p: boolean) => void;
}
export default function ChatConversation({
  thread,
  chatListOpen,
  setChatListOpen
}: Props) {
  const [disputeOpen, setDisputeOpen] = useState<boolean>(false);
  const { address } = useAccount();
  const {
    seller: { sellerId, isError: isErrorSellers, isLoading: isLoadingSeller },
    buyer: { buyerId, isError: isErrorBuyers, isLoading: isLoadingBuyer }
  } = useBuyerSellerAccounts(address || "");
  const { showModal } = useModal();
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
        <SimpleMessage>Select a message</SimpleMessage>
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
              setChatListOpen(!chatListOpen);
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <button
            onClick={() => {
              setDisputeOpen(!disputeOpen);
            }}
          >
            Details
          </button>
        </NavigationMobile>
        <Header>
          <SellerComponent size={24} />
        </Header>
        <Messages>
          {thread.messages.map((message) => {
            return (
              <Conversation
                key={message.id}
                $alignStart={!getWasItSentByMe(buyerId, sellerId, message.from)}
              >
                <Message
                  thread={thread}
                  message={message}
                  isLeftAligned={
                    !getWasItSentByMe(buyerId, sellerId, message.from)
                  }
                >
                  <SellerComponent size={32} withProfileText={false} />
                </Message>
              </Conversation>
            );
          })}
        </Messages>
        <TypeMessage>
          <ButtonProposal exchange={exchange} />
          <InputWrapper>
            <Input placeholder="Write a message" />
            <UploadSimple
              size={24}
              data-upload
              onClick={() =>
                showModal("UPLOAD_MODAL", {
                  title: "Upload documents",
                  onFilesSelect: (files) => {
                    console.log(
                      `TODO: send ${files.length} messages with these uploaded files`,
                      files
                    );
                  }
                })
              }
            />
          </InputWrapper>
        </TypeMessage>
      </Container>
      <Dispute thread={thread} disputeOpen={disputeOpen} />
    </>
  );
}
