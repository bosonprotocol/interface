import { useCallback } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import SellerID from "../../../components/ui/SellerID";
import { colors } from "../../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../../lib/utils/hooks/useBuyerSellerAccounts";
import { Thread } from "../types";
import Message from "./Message";

const Container = styled.div`
  display: flex;
  flex: 0 0 75%;
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
              <Message thread={thread} message={message}>
                <SellerComponent size={32} withProfileText={false} />
              </Message>
            </Conversation>
          );
        })}
      </Messages>
    </Container>
  );
}
