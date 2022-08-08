import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";

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
        id: "7",
        wallet: "0x"
      },
      committedDate: new Date().toString(),
      disputed: true,
      expired: true,
      finalizedDate: new Date().toString(),
      redeemedDate: new Date().toString(),
      state: "REDEEMED",
      validUntilDate: new Date().toString(),
      seller: { id: "2" },
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
          id: "2",
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
    if (exchanges) {
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
