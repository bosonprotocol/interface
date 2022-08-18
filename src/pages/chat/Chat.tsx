import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAccount } from "wagmi";

import { useModal } from "../../components/modal/useModal";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "./ChatProvider/ChatContext";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";

const GlobalStyle = createGlobalStyle`
  html, body, #root, [data-rk] {
    height: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

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
  width: 100%;
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
  const { address } = useAccount();
  const { showModal, hideModal } = useModal();
  useEffect(() => {
    if (bosonXmtp && address) {
      hideModal();
    } else {
      showModal(
        "INITIALIZE_CHAT",
        {
          title: "Initialize Chat",
          closable: false
        },
        "s"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosonXmtp, address]);

  const {
    seller: {
      sellerId: sellerId,
      isError: isErrorSellers,
      isLoading: isLoadingSeller
    },
    buyer: { buyerId, isError: isErrorBuyers, isLoading: isLoadingBuyer }
  } = useBuyerSellerAccounts(address || "");

  const { data: exchanges = [] } = useExchanges({
    buyerId: buyerId,
    sellerId: sellerId,
    disputed: null
  });

  const textAreaValueByThread = useMemo(
    () =>
      exchanges.map((exchange) => {
        return {
          exchangeId: exchange.id,
          value: ""
        };
      }),
    [exchanges]
  );
  const [selectedExchange, selectExchange] = useState<Exchange>();
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

  // select thread based on url /exchangeId
  useEffect(() => {
    if (exchanges && exchangeId) {
      const foundExchange = exchanges.find((exchange) => {
        return exchange.id === exchangeId;
      });
      if (!foundExchange) {
        setExchangeIdNotOwned(true);
        return;
      }
      selectExchange(foundExchange);
    }
  }, [exchangeId, exchanges]);

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

  const isSellerOrBuyer = !(
    !isLoadingSeller &&
    !isLoadingBuyer &&
    (isErrorSellers || isErrorBuyers || (!sellerId && !buyerId))
  );
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
            selectExchange(exchange);
            navigate({
              pathname: `${BosonRoutes.Chat}/${exchange.id}`
            });
          }}
          chatListOpen={chatListOpen}
          setChatListOpen={setChatListOpen}
          currentExchange={selectedExchange}
        />

        <Routes>
          <Route
            path={`:${UrlParameters.exchangeId}`}
            element={
              <ChatConversation
                key={selectedExchange?.id || ""}
                exchange={selectedExchange}
                setChatListOpen={setChatListOpen}
                chatListOpen={chatListOpen}
                exchangeIdNotOwned={exchangeIdNotOwned}
                prevPath={previousPath}
                onTextAreaChange={onTextAreaChange}
                textAreaValue={parseInputValue}
              />
            }
          />
        </Routes>

        {(location.pathname === `${BosonRoutes.Chat}/` ||
          location.pathname === `${BosonRoutes.Chat}` ||
          !isSellerOrBuyer) && (
          <SelectMessageContainer>
            <SimpleMessage>
              {exchangeIdNotOwned
                ? "You don't have this exchange"
                : isSellerOrBuyer && exchanges.length
                ? "Select a message"
                : "You need to have an exchange to chat"}
            </SimpleMessage>
          </SelectMessageContainer>
        )}
      </Container>
    </>
  );
}
