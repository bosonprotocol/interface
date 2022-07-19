import { useState } from "react";
import styled from "styled-components";

import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";
import { Thread } from "./types";

const threads: Omit<Thread, "exchange">[] = [
  {
    threadId: {
      exchangeId: "115",
      sellerId: "2",
      buyerId: "7"
    },
    messages: [
      {
        id: "1",
        from: "2",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "115",
            sellerId: "2",
            buyerId: "7"
          },
          contentType: "string",
          value: "hello 😃",
          version: "1"
        }
      },
      {
        id: "2",
        from: "7",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "115",
            sellerId: "2",
            buyerId: "7"
          },
          contentType: "string",
          value: "this is a conversation with myself",
          version: "1"
        }
      }
    ]
  },
  {
    threadId: {
      exchangeId: "20",
      sellerId: "4",
      buyerId: "7"
    },
    messages: [
      {
        id: "3",
        from: "7",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: "7"
          },
          contentType: "string",
          value: "hello 😃 seller with id 4",
          version: "1"
        }
      },
      {
        id: "4",
        from: "4",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: "7"
          },
          contentType: "string",
          value: "hello 😃 buyer with id 7",
          version: "1"
        }
      }
    ]
  }
];

const Container = styled.div`
  display: flex;
`;

export default function Chat() {
  const { data: exchanges } = useExchanges({
    id_in: threads.map((message) => message.threadId.exchangeId),
    disputed: null
  });
  const threadsWithExchanges = threads.map((thread) => {
    return {
      threadId: thread.threadId,
      exchange: exchanges?.find(
        (exchange) => exchange.id === thread.threadId.exchangeId
      ),
      messages: thread.messages
    };
  });
  const [selectedThread, selectThread] = useState<Thread>();
  return (
    <Container>
      <MessageList
        threads={threadsWithExchanges}
        onChangeConversation={(thread) => {
          selectThread(thread);
        }}
      />
      <ChatConversation thread={selectedThread} />
    </Container>
  );
}
