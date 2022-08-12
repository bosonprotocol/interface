/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove
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
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "./ChatProvider/ChatContext";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";

const dennisAddress = "0xE16955e95D088bd30746c7fb7d76cDA436b86F63";
const albertAddress = "0x9c2925a41d6FB1c6C8f53351634446B0b2E65eE8";
const jonasAddress = "0x00c5D17c55940783961352E6f83ea18167841Bca";
const dennisId = "1";
const albertId = "2";
const jonasId = "3";

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
  address,
  id_in,
  disputed
}: {
  address: string | undefined;
  id_in: string[];
  disputed: null;
}): ReturnType<typeof useExchanges> => {
  const r = {
    data: [
      {
        id: "0",
        buyer: {
          id: albertId,
          wallet: "0x"
        },
        committedDate: new Date().toString(),
        disputed: true,
        expired: true,
        finalizedDate: new Date().toString(),
        redeemedDate: new Date().toString(),
        state: "REDEEMED",
        validUntilDate: new Date().toString(),
        seller: { id: dennisId },
        offer: {
          id: "1",
          buyerCancelPenalty: "",
          createdAt: "",
          disputeResolverId: "",
          exchangeToken: {
            address: "0x1000000000000000000000000000000000000000",
            decimals: "18",
            name: "PepitoName",
            symbol: "pepito",
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
            admin: dennisAddress,
            clerk: dennisAddress,
            __typename: "Seller",
            id: dennisId,
            operator: address === dennisAddress ? albertAddress : dennisAddress,
            treasury: dennisAddress
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
            name: "boson sweatshirt (dennis<->albert)"
          }
        }
      },
      {
        id: "1",
        buyer: {
          id: dennisId,
          wallet: "0x"
        },
        committedDate: new Date().toString(),
        disputed: true,
        expired: true,
        finalizedDate: new Date().toString(),
        redeemedDate: new Date().toString(),
        state: "REDEEMED",
        validUntilDate: new Date().toString(),
        seller: { id: albertId },
        offer: {
          id: "1",
          buyerCancelPenalty: "",
          createdAt: "",
          disputeResolverId: "",
          exchangeToken: {
            address: "0x2000000000000000000000000000000000000000",
            decimals: "18",
            name: "PepitoName",
            symbol: "pepito",
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
            admin: albertAddress,
            clerk: albertAddress,
            __typename: "Seller",
            id: albertId,
            operator: address === dennisAddress ? albertAddress : dennisAddress,
            treasury: albertAddress
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
            name: "boson sweatshirt (albert<->dennis)"
          }
        }
      },
      {
        id: "2",
        buyer: {
          id: jonasId,
          wallet: "0x"
        },
        committedDate: new Date().toString(),
        disputed: true,
        expired: true,
        finalizedDate: new Date().toString(),
        redeemedDate: new Date().toString(),
        state: "REDEEMED",
        validUntilDate: new Date().toString(),
        seller: { id: albertId },
        offer: {
          id: "1",
          buyerCancelPenalty: "",
          createdAt: "",
          disputeResolverId: "",
          exchangeToken: {
            address: "0x2000000000000000000000000000000000000000",
            decimals: "18",
            name: "PepitoName",
            symbol: "pepito",
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
            admin: albertAddress,
            clerk: albertAddress,
            __typename: "Seller",
            id: jonasId,
            operator: address === jonasAddress ? dennisAddress : jonasAddress,
            treasury: albertAddress
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
            name: "boson sweatshirt (jonas<->dennis)"
          }
        }
      }
    ]
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
  const { data: exchanges = [] } = useMemo(
    () =>
      getExchanges({
        address,
        // TODO: remove
        id_in: new Array(116).fill(0).map((v, idx) => "" + idx),
        disputed: null
      }),
    [address]
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
