import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";
import { Thread } from "./types";

const mySellerId = "2";
const myBuyerId = "7";

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
      exchangeId: "133",
      sellerId: mySellerId,
      buyerId: myBuyerId
    },
    messages: [
      {
        id: "1",
        from: "123",
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
          value: {
            name: "dot.png",
            type: "image/png",
            size: 123,
            encodedContent: `data:image/png;base64,iVBORw0KGgoAAA
              ANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4
              //8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU
              5ErkJggg==`
          }
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
          value: {
            name: "123.png",
            type: "image/png",
            size: 123,
            encodedContent:
              "invalid format image, we should show an error in the chat"
          }
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
            title: `Seller ID:x raised a dispute and made a proposal`,
            description:
              "Hello there, the item I received has some quality issues. The colours are a bit worn out and not as bright as on the picture. The laces are slightly damaged and in the wrong colour....",
            proposals: [
              {
                type: "Refund",
                percentageAmount: "20",
                signature: "0x214..."
              }
            ],
            disputeContext: [
              "Item not as described",
              "The item received is a different colour, model, version, or size"
            ]
          }
        }
      },
      {
        id: "10",
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
            title: "Seller ID:4 made a proposal",
            description:
              "Thank you for reaching out lorem ipsum dolor sit amet",
            proposals: [
              {
                type: "Refund",
                percentageAmount: "10",
                signature: "0x214..."
              }
            ],
            disputeContext: []
          }
        }
      },
      {
        id: "11",
        from: myBuyerId,
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: mySellerId,
            buyerId: myBuyerId
          },
          contentType: "proposal",
          version: "1",
          value: {
            title: `Seller ID:x raised a dispute and made a proposal`,
            description:
              "Hello there, the item I received has some quality issues. The colours are a bit worn out and not as bright as on the picture. The laces are slightly damaged and in the wrong colour....",
            proposals: [
              {
                type: "Refund",
                percentageAmount: "20",
                signature: "0x214..."
              }
            ],
            disputeContext: [
              "Item not as described",
              "The item received is a different colour, model, version, or size"
            ]
          }
        }
      },
      {
        id: "12",
        from: myBuyerId,
        sentDate: new Date(),
        content: {
          threadId: {
            exchangeId: "20",
            sellerId: mySellerId,
            buyerId: myBuyerId
          },
          contentType: "proposal",
          version: "1",
          value: {
            title: "Seller ID:4 made a proposal",
            description:
              "Thank you for reaching out lorem ipsum dolor sit amet",
            proposals: [
              {
                type: "Refund",
                percentageAmount: "10",
                signature: "0x214..."
              }
            ],
            disputeContext: []
          }
        }
      }
    ]
  }
];

const GlobalStyle = createGlobalStyle`
  html, body, #root, [data-rk] {
    height: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100%;
`;
// :
const getExchanges = ({
  id_in,
  disputed
}: {
  id_in: string[];
  disputed: null;
}): ReturnType<typeof useExchanges> => {
  const r = {
    data: id_in.map((id) => ({
      id,
      buyer: {
        id: "1",
        wallet: "0x"
      },
      committedDate: new Date().toString(),
      disputed: true,
      expired: true,
      finalizedDate: new Date().toString(),
      redeemedDate: new Date().toString(),
      state: "active",
      validUntilDate: new Date().toString(),
      seller: { id: "123" },
      offer: {
        id: "1",
        buyerCancelPenalty: "",
        createdAt: "",
        disputeResolverId: "",
        exchangeToken: {
          address: "",
          decimals: "",
          name: "",
          symbol: "",
          __typename: "ExchangeToken"
        },
        fulfillmentPeriodDuration: "",
        metadataHash: "",
        metadataUri: "",
        price: "",
        protocolFee: "",
        quantityAvailable: "",
        quantityInitial: "",
        resolutionPeriodDuration: "",
        seller: {
          active: true,
          admin: "0x",
          clerk: "0x",
          __typename: "Seller",
          id: "",
          operator: "",
          treasury: ""
        },
        sellerDeposit: "",
        validFromDate: "",
        validUntilDate: "",
        voucherRedeemableFromDate: "",
        voucherRedeemableUntilDate: "",
        voucherValidDuration: "",
        __typename: "Offer",
        isValid: true,
        voidedAt: "",
        metadata: {
          imageUrl:
            "http://localhost:3000/static/media/logo.1ee71600148baa2c5ceb69f2a0c1b62a.svg",
          type: "BASE"
        }
      }
    }))
  };
  return r as any;
};

const SelectMessageContainer = styled.div`
  display: flex;
  flex: 0 1 75%;
  flex-direction: column;
  position: relative;
  width: 100%;
  display: none;
  ${breakpoint.m} {
    display: block;
  }
`;

const SimpleMessage = styled.p`
  all: unset;
  display: block;
  height: 100%;
  padding: 1rem;
  background: ${colors.lightGrey};
`;

export default function Chat() {
  // TODO: comment out
  // const { data: exchanges } = useExchanges({
  //   id_in: threads.map((message) => message.threadId.exchangeId),
  //   disputed: null
  // });
  const { data: exchanges } = getExchanges({
    // TODO: remove
    id_in: threads.map((message) => message.threadId.exchangeId),
    disputed: null
  });
  const threadsWithExchanges = useMemo(
    () =>
      threads.map((thread) => {
        return {
          threadId: thread.threadId,
          exchange: exchanges?.find(
            (exchange) => exchange.id === thread.threadId.exchangeId
          ),
          messages: thread.messages
        };
      }),
    [exchanges]
  );
  const [selectedThread, selectThread] = useState<Thread>();
  const [chatListOpen, setChatListOpen] = useState<boolean>(false);
  const [exchangeIdNotOwned, setExchangeIdNotOwned] = useState<boolean>(false);
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { prevPath } = state as { prevPath: string };
  const exchangeId = params["*"];
  const navigate = useKeepQueryParamsNavigate();
  useEffect(() => {
    if (threadsWithExchanges?.[0]?.exchange) {
      const currentThread = threadsWithExchanges.find((thread) => {
        return thread.threadId.exchangeId === exchangeId;
      });

      if (currentThread) {
        selectThread(currentThread);
      } else {
        setExchangeIdNotOwned(true);
      }
    }
  }, [
    exchangeId,
    threadsWithExchanges,
    setExchangeIdNotOwned,
    exchangeIdNotOwned
  ]);

  return (
    <>
      <Container>
        <GlobalStyle />

        <MessageList
          threads={threadsWithExchanges}
          isConversationOpened={
            location.pathname !== `${BosonRoutes.Chat}/` &&
            location.pathname !== `${BosonRoutes.Chat}`
          }
          onChangeConversation={(thread) => {
            setChatListOpen(!chatListOpen);
            selectThread(thread);
            navigate(
              {
                pathname: `/${BosonRoutes.Chat}/${thread.threadId.exchangeId}`
              },
              { replace: true }
            );
          }}
          chatListOpen={chatListOpen}
          setChatListOpen={setChatListOpen}
          currentThread={selectedThread}
        />
        <Routes>
          <Route
            path={`:${UrlParameters.exchangeId}`}
            element={
              <ChatConversation
                thread={selectedThread}
                setChatListOpen={setChatListOpen}
                chatListOpen={chatListOpen}
                exchangeId={`${exchangeId}`}
                exchangeIdNotOwned={exchangeIdNotOwned}
              />
            }
          />
        </Routes>
        {(location.pathname === `${BosonRoutes.Chat}/` ||
          location.pathname === `${BosonRoutes.Chat}`) && (
          <SelectMessageContainer>
            <SimpleMessage>
              {exchangeIdNotOwned
                ? "You don't have this exchange"
                : "Select a message"}
            </SimpleMessage>
          </SelectMessageContainer>
        )}
      </Container>
    </>
  );
}
