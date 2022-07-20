import { useCallback } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import SellerID from "../../../components/ui/SellerID";
import { colors } from "../../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Thread } from "../types";
import Dispute from "./Dispute";
import Message from "./Message";

const Container = styled.div`
  display: flex;
  flex: 0 1 75%;
  flex-direction: column;
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
`;
const Messages = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const Conversation = styled.div<{ $alignStart: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $alignStart }) =>
    $alignStart ? "flex-start" : "flex-end"};
  flex-grow: 1;
  background-color: ${colors.lightGrey};
  padding-bottom: 1.875rem;
`;

const TypeMessage = styled.div`
  height: 5rem;
  width: 100%;
  display: flex;
  align-items: center;
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
  span {
    display: block;
    height: 0.6em;
    width: 0.6em;
    font-size: 2.063rem;
    text-align: center;
    line-height: 0.5em;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: Frutiger, "Frutiger Linotype", Univers, Calibri, "Gill Sans",
      "Gill Sans MT", "Myriad Pro", Myriad, "DejaVu Sans Condensed",
      "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue",
      Helvetica, Arial, sans-serif;
    font-weight: 100;
    color: ${colors.secondary};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
    margin-top: -1px;
    &:before {
      display: block;
      content: "+";
    }
  }
`;

const getWasItSentByMe = (
  myBuyerId: string,
  mySellerId: string,
  from: string
) => {
  return myBuyerId === from || mySellerId === from;
};

interface Props {
  thread: Thread | undefined;
}
export default function ChatConversation({ thread }: Props) {
  const { address } = useAccount();
  const {
    seller: { sellerId, isError: isErrorSellers },
    buyer: { buyerId, isError: isErrorBuyers }
  } = useBuyerSellerAccounts(address || "");
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
  if (isErrorSellers || isErrorBuyers || (!sellerId && !buyerId)) {
    return <Container>There has been an error, try again or refresh</Container>;
  }

  if (!thread) {
    return <Container>Select a message</Container>;
  }

  return (
    <>
      <Container>
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
          <BtnProposal>
            Proposal <span>&nbsp;</span>
          </BtnProposal>
          <Input placeholder="Write a message" />
        </TypeMessage>
      </Container>
      <Dispute thread={thread} />
    </>
  );
}
