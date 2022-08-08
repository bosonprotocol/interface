import { MessageData } from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { matchThreadIds } from "@bosonprotocol/chat-sdk/dist/cjs/util/functions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useInfiniteChat } from "../../lib/utils/hooks/chat/useInfiniteChat";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "./ChatProvider/ChatContext";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";
import { Thread } from "./types";

// const address = "0x5295D74Bbb5195A3e4E788744cB17c2f1c48DfFf";
const address = "0x5295D74Bbb5195A3e4E788744cB17c2f1c48DfFf";

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
            "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-FINAL.gif",
          type: "BASE",
          name: index === 0 ? "boson sweatshirt" : "another sweatshirt"
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
  const [dateIndex, setDateIndex] = useState<number>(0);
  const { data: exchanges = [] } = useMemo(
    () =>
      getExchanges({
        // TODO: remove
        id_in: [1, 2, 3, 115].map((v) => "" + v),
        disputed: null
      }),
    []
  );
  // TODO: comment out
  // const { data: exchanges } = useExchanges({
  //   id_in: threads.map((message) => message.threadId.exchangeId),
  //   disputed: null
  // });
  const {
    data: threadsXmtp,
    isLoading: areThreadsLoading,
    isBeginningOfTimes
  } = useInfiniteChat({
    dateIndex,
    dateStep: "month", // TODO: change to week
    counterParties:
      exchanges?.map((exchange) => exchange.offer.seller.operator) || [],
    bosonXmtp
  });
  console.log(
    "threadsXmtp",
    threadsXmtp,
    "dateIndex",
    dateIndex,
    "isBeginningOfTimes",
    isBeginningOfTimes,
    "areThreadsLoading",
    areThreadsLoading
  );
  const loadMoreMessages = useCallback(() => {
    if (!areThreadsLoading) {
      setDateIndex(dateIndex - 1);
    }
  }, [dateIndex, areThreadsLoading]);
  // console.log({ threadsXmtp });

  // TODO: remove this
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
          exchanges={exchanges}
          isConversationOpened={
            location.pathname !== `${BosonRoutes.Chat}/` &&
            location.pathname !== `${BosonRoutes.Chat}`
          }
          onChangeConversation={(exchange) => {
            if (isXXS || isXS || isS) {
              setChatListOpen(!chatListOpen);
            }
            const thread = threadsXmtp.find((thread) => {
              return thread.threadId.exchangeId === exchange.id;
            });
            if (!thread) {
              console.error(
                `Thread xmtp not found with this exchange id=${exchange.id}`
              );
              selectThread(undefined);
              return;
            }
            selectThread({
              ...thread,
              exchange
            });
            navigate(
              {
                pathname: `${BosonRoutes.Chat}/${thread.threadId.exchangeId}`
              },
              { replace: true }
            );
          }}
          chatListOpen={chatListOpen}
          setChatListOpen={setChatListOpen}
          currentExchange={selectedThread?.exchange}
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
                exchangeIdNotOwned={exchangeIdNotOwned}
                prevPath={previousPath}
                onTextAreaChange={onTextAreaChange}
                textAreaValue={parseInputValue}
                loadMoreMessages={loadMoreMessages}
                hasMoreMessages={!isBeginningOfTimes}
                areThreadsLoading={areThreadsLoading}
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
