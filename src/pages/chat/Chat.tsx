import {
  MessageData,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/functions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "./ChatProvider/ChatContext";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";
import { Thread } from "./types";

const mySellerId = "2";
const myBuyerId = "7";
// const address = "0x5295D74Bbb5195A3e4E788744cB17c2f1c48DfFf";
const address = "0x5295D74Bbb5195A3e4E788744cB17c2f1c48DfFf";
/*
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
      },
      {
        id: "2.1",
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
*/
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
    data: id_in.map((id, index) => ({
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
      state: "REDEEMED",
      validUntilDate: new Date().toString(),
      seller: { id: "123" },
      offer: {
        id: "1",
        buyerCancelPenalty: "",
        createdAt: "",
        disputeResolverId: "",
        exchangeToken: {
          address:
            index === 0
              ? "0x123"
              : "0x0000000000000000000000000000000000000000",
          decimals: "18",
          name: index === 0 ? "PepitoName" : "Ether",
          symbol: index === 0 ? "pepito" : "ETH",
          __typename: "ExchangeToken"
        },
        fulfillmentPeriodDuration: "",
        metadataHash: "",
        metadataUri: "",
        price: "10001230000000000000",
        protocolFee: "",
        quantityAvailable: "",
        quantityInitial: "",
        resolutionPeriodDuration: "",
        seller: {
          active: true,
          admin: address,
          clerk: address,
          __typename: "Seller",
          id: "5",
          operator: address,
          treasury: address
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
            "https://assets.website-files.com/6058b6a3587b6e155196ebbb/61b24ecf53f687b4500a6203_NiftyKey_Logo_Vertical.svg",
          type: "BASE",
          name: index === 0 ? "boson t-shirt" : "another tshirt"
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

const getIsSameThread = (
  exchangeId: string | undefined,
  textAreaValue: {
    exchangeId: string;
    value: string;
  }
) => {
  return textAreaValue.exchangeId === exchangeId;
};

export default function Chat() {
  const { bosonXmtp } = useChatContext();
  const [threadsXmtp, setThreadsXmtp] = useState<ThreadObject[]>([]);
  useEffect(() => {
    if (!bosonXmtp) {
      return;
    }
    // const address = "0x9c2925a41d6FB1c6C8f53351634446B0b2E65eE8";
    const counterParties: string[] = [address];
    bosonXmtp
      .getThreads(counterParties, {})
      .then((threadObjects) => {
        setThreadsXmtp(threadObjects);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bosonXmtp]);

  console.log({ threadsXmtp });
  // TODO: comment out
  // const { data: exchanges } = useExchanges({
  //   id_in: threads.map((message) => message.threadId.exchangeId),
  //   disputed: null
  // });
  const { data: exchanges } = useMemo(
    () =>
      getExchanges({
        // TODO: remove
        // id_in: threads.map((message) => message.threadId.exchangeId),
        id_in: [1, 2, 3, 115].map((v) => "" + v),
        disputed: null
      }),
    []
  );
  const [threadsWithExchanges, setThreadsWithExchanges] = useState<Thread[]>(
    []
  );
  useEffect(() => {
    setThreadsWithExchanges(
      threadsXmtp.map((thread) => {
        return {
          ...thread,
          exchange: exchanges?.find(
            (exchange) => exchange.id === thread.threadId.exchangeId
          )
        };
      })
    );
  }, [threadsXmtp, exchanges]);
  const addMessage = useCallback(
    (thread: Thread, newMessage: MessageData) => {
      const foundThread = threadsWithExchanges.find((loadedThread) =>
        matchThreadIds(loadedThread.threadId, thread.threadId)
      );
      if (foundThread) {
        foundThread.messages.push(newMessage);
        setThreadsWithExchanges([...threadsWithExchanges]);
      }
    },
    [threadsWithExchanges]
  );
  const textAreaValueByThread = useMemo(
    () =>
      threadsXmtp.map((thread) => {
        return {
          exchangeId: thread.threadId.exchangeId,
          value: ""
        };
      }),
    [threadsXmtp]
  );
  const [selectedThread, selectThread] = useState<Thread>();
  const [chatListOpen, setChatListOpen] = useState<boolean>(false);
  const [exchangeIdNotOwned, setExchangeIdNotOwned] = useState<boolean>(false);
  const params = useParams();
  const location = useLocation();
  const exchangeId = params["*"];
  const { state } = location;
  const prevPath = (state as { prevPath: string })?.prevPath;
  const [previousPath, setPreviousPath] = useState<string>("");
  const navigate = useKeepQueryParamsNavigate();
  const { isXXS, isXS, isS } = useBreakpoints();
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

  const [textAreasValues, setTextAreasValues] = useState(textAreaValueByThread);
  useEffect(() => {
    setTextAreasValues(textAreaValueByThread);
  }, [textAreaValueByThread]);
  const onTextAreaChange = (textAreaTargetValue: string) => {
    const updatedData = textAreasValues.map((textAreaValue) =>
      getIsSameThread(exchangeId, textAreaValue)
        ? { ...textAreaValue, value: textAreaTargetValue }
        : textAreaValue
    );
    setTextAreasValues(updatedData);
  };

  const parseInputValue = useMemo(
    () =>
      textAreasValues.find((textAreaValue) =>
        getIsSameThread(exchangeId, textAreaValue)
      )?.value,
    [exchangeId, textAreasValues]
  );
  useEffect(() => {
    setPreviousPath(prevPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            if (isXXS || isXS || isS) {
              setChatListOpen(!chatListOpen);
            }
            selectThread(thread);
            navigate(
              {
                pathname: `${BosonRoutes.Chat}/${thread.threadId.exchangeId}`
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
            path={`:${exchangeId}`}
            element={
              <ChatConversation
                addMessage={addMessage}
                thread={selectedThread}
                setChatListOpen={setChatListOpen}
                chatListOpen={chatListOpen}
                exchangeId={`${exchangeId}`}
                exchangeIdNotOwned={exchangeIdNotOwned}
                prevPath={previousPath}
                onTextAreaChange={onTextAreaChange}
                textAreaValue={parseInputValue}
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
