import { useState } from "react";
import { generatePath, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";
import { Thread } from "./types";

const myBuyerId = "16";
const mySellerId = "17";

const threads: Omit<Thread, "exchange">[] = [
  {
    threadId: {
      exchangeId: "115",
      sellerId: mySellerId,
      buyerId: myBuyerId
    },
    messages: [
      {
        id: "1",
        from: mySellerId,
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "115",
            sellerId: mySellerId,
            buyerId: myBuyerId
          },
          contentType: "string",
          value: "hello 😃",
          version: "1"
        }
      },
      {
        id: "2",
        from: myBuyerId,
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "115",
            sellerId: mySellerId,
            buyerId: myBuyerId
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
      buyerId: myBuyerId
    },
    messages: [
      {
        id: "3",
        from: myBuyerId,
        sentDate: (() => {
          const currentDate = new Date();
          new Date(currentDate.setDate(currentDate.getDate() - 15));
          return currentDate;
        })(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "string",
          value: "hello 😃 seller with id 4",
          version: "1"
        }
      },
      {
        id: "4",
        from: "4",
        sentDate: (() => {
          const currentDate = new Date();
          new Date(currentDate.setDate(currentDate.getDate() - 10));
          return currentDate;
        })(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "string",
          value: `hello 😃 buyer with id ${myBuyerId}`,
          version: "1"
        }
      },
      {
        id: "5",
        from: myBuyerId,
        sentDate: (() => {
          const currentDate = new Date();
          new Date(currentDate.setDate(currentDate.getDate() - 5));
          return currentDate;
        })(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "string",
          value: "hello 😃 seller with id 4",
          version: "1"
        }
      },
      {
        id: "6",
        from: "4",
        sentDate: (() => {
          const currentDate = new Date();
          new Date(currentDate.setDate(currentDate.getDate() - 2));
          return currentDate;
        })(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "string",
          value: `test test hello 😃 buyer with id ${myBuyerId}`,
          version: "1"
        }
      },
      {
        id: "7",
        from: "4",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "image",
          version: "1",
          value:
            "https://www.oxbowanimalhealth.com/images/cache/uploads/images/rabbit_smiling_400_300.jpg"
        }
      },
      {
        id: "8",
        from: "4",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "image",
          version: "1",
          value: "invalid format image, we should show an error in the chat"
        }
      },
      {
        id: "9",
        from: "4",
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: "4",
            buyerId: myBuyerId
          },
          contentType: "proposal",
          version: "1",
          value: {
            title: "RTFKT made a proposal",
            description:
              "Thank you for reaching out lorem ipsum dolor sit amet",
            additionalInformation:
              "Hello there, the item I received has some quality issues. The colours are a bit worn out and not as bright as on the picture. The laces are slightly damaged and in the wrong colour....",
            additionalInformationFiles: [
              {
                name: "Photo_of_RTFKT_Sneaker.jpg",
                url: "base64image"
              },
              {
                name: "Photo_of_RTFKT_Sneaker.jpg",
                url: "base64image"
              },
              {
                name: "Photo_of_RTFKT_Sneaker.jpg",
                url: "base64image"
              }
            ],
            proposals: [
              {
                type: "Refund",
                percentageAmount: "10",
                signature: "0x214..."
              },
              {
                type: "Return and replace",
                percentageAmount: "0",
                signature: "0x7a6..."
              }
            ]
          }
        }
      }
    ]
  }
];

const Container = styled.div`
  display: flex;
  height: 100%;
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
  const [chatListOpen, setChatListOpen] = useState<boolean>(false);

  console.log(selectedThread);

  const path = generatePath(BosonRoutes.ChatMessage, {
    [UrlParameters.exchangeId]: "1"
  });

  return (
    <Container>
      <MessageList
        threads={threadsWithExchanges}
        onChangeConversation={(thread) => {
          selectThread(thread);
        }}
        chatListOpen={chatListOpen}
      />
      <Routes>
        <Route
          path={`:${UrlParameters.exchangeId}`}
          element={
            <ChatConversation
              thread={selectedThread}
              setChatListOpen={setChatListOpen}
              chatListOpen={chatListOpen}
            />
          }
        />
      </Routes>
    </Container>
  );
}
