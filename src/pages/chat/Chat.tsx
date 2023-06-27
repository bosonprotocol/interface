import {
  ClientData as NotifiClientData,
  useNotifiClient
} from "@notifi-network/notifi-react-hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAccount, useSigner } from "wagmi";

import { useModal } from "../../components/modal/useModal";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { getNotifiConfig } from "../../lib/utils/hooks/chat/useNotifi";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useChatContext } from "./ChatProvider/ChatContext";
import ChatConversation from "./components/ChatConversation";
import MessageList, { NotifiTopic } from "./components/MessageList";

const GlobalStyle = createGlobalStyle`
  html, body, #root, [data-rk] {
    height: 100%;
  }
  :root {
    --textColor: unset;
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
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const {
    seller: {
      sellerId: sellerId,
      isError: isErrorSellers,
      isLoading: isLoadingSeller
    },
    buyer: { buyerId, isError: isErrorBuyers, isLoading: isLoadingBuyer }
  } = useBuyerSellerAccounts(address || "");

  const { data: exchangesAsTheBuyer, refetch: refetchExchangesAsTheBuyer } =
    useExchanges(
      {
        buyerId: buyerId,
        disputed: null
      },
      {
        enabled: !!buyerId
      }
    );
  const { data: exchangesAsTheSeller, refetch: refetchExchangesAsTheSeller } =
    useExchanges(
      {
        sellerId: sellerId,
        disputed: null
      },
      {
        enabled: !!sellerId
      }
    );

  const exchanges = useMemo(() => {
    return Array.from(
      new Map(
        [...(exchangesAsTheBuyer || []), ...(exchangesAsTheSeller || [])].map(
          (v) => [v.id, v]
        )
      ).values()
    );
  }, [exchangesAsTheBuyer, exchangesAsTheSeller]);

  const refetchExchanges = useCallback(() => {
    refetchExchangesAsTheSeller();
    refetchExchangesAsTheBuyer();
  }, [refetchExchangesAsTheBuyer, refetchExchangesAsTheSeller]);

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
  const [notifiRegistration, setNotifiRegistration] = useState<
    NotifiTopic[] | null
  >(null);

  const params = useParams();
  const location = useLocation();
  const exchangeId = params["*"];
  const { state } = location;
  const prevPath = (state as { prevPath: string })?.prevPath;
  const [previousPath, setPreviousPath] = useState<string>("");
  const navigate = useKeepQueryParamsNavigate();
  const { isXXS, isXS, isS } = useBreakpoints();
  const { showModal, modalTypes } = useModal();
  const { bosonXmtp } = useChatContext();
  const notifiConfig = getNotifiConfig();

  // TODO: ideally if notifiConfig is null, do not call useNotifiClient()

  const notifiClient = useNotifiClient({
    dappAddress: notifiConfig?.dappId || "",
    env: "Development",
    walletPublicKey: address as string,
    walletBlockchain: notifiConfig?.chain || "ETHEREUM"
  });
  const fetchNotifiData = (data: NotifiClientData | null) => {
    const xmtpAlert = data?.alerts?.find(
      (alert: { filter?: { filterType?: string } }) =>
        alert.filter?.filterType === "WEB3_CHAT_MESSAGES"
    );
    const xmtpSources = xmtpAlert?.sourceGroup?.sources?.filter(
      (source: unknown) => (source as { type?: string }).type === "XMTP"
    );
    const sourceTopics = xmtpSources?.map(
      (source: unknown) => (source as { name?: string }).name
    ) as string[];
    setAlreadyRegisteredTopics(sourceTopics);
  };

  const onNotifiPopupClosed = useCallback(() => {
    if (notifiClient) {
      notifiClient.fetchData(true).then((data) => {
        fetchNotifiData(data);
      });
    }
  }, [notifiClient]);

  const [alreadyRegisteredTopics, setAlreadyRegisteredTopics] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!notifiClient || notifiClient.loading) {
      setAlreadyRegisteredTopics([]);
    } else {
      fetchNotifiData(notifiClient.data);
    }
  }, [notifiClient]);

  useEffect(() => {
    if (bosonXmtp) {
      bosonXmtp.getConversations().then((convos: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newTopicDatas = convos.map((convo: any) => {
          return {
            topic: convo.topic,
            peerAddress: convo.peerAddress,
            registered: alreadyRegisteredTopics?.includes(convo.topic) || false
          };
        });
        setNotifiRegistration(newTopicDatas);
      });
    } else {
      // topics are not ready yet
      setNotifiRegistration(null);
    }
  }, [bosonXmtp, alreadyRegisteredTopics]);

  const setShowNotifiModal = () => {
    const topics = notifiRegistration?.map((notifiTopic) => notifiTopic.topic);
    showModal(
      modalTypes.NOTIFI,
      {
        title: `Notifi`,
        onClose: () => {
          onNotifiPopupClosed();
        },
        signer,
        address,
        topics,
        notifiConfig
      },
      "auto"
    );
  };

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
      setExchangeIdNotOwned(false);
      selectExchange(foundExchange);
    }
  }, [exchangeId, exchanges]);

  const [textAreasValues, setTextAreasValues] = useState(textAreaValueByThread);
  useEffect(() => {
    setTextAreasValues(textAreaValueByThread);
  }, [textAreaValueByThread]);
  const onTextAreaChange = useCallback(
    (textAreaTargetValue: string) => {
      const updatedData = textAreasValues.map((textAreaValue) =>
        getIsSameThread(exchangeId, textAreaValue)
          ? { ...textAreaValue, value: textAreaTargetValue }
          : textAreaValue
      );
      setTextAreasValues(updatedData);
    },
    [exchangeId, textAreasValues]
  );

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
  const onChangeConversation = useCallback(
    (exchange: Exchange) => {
      if (isXXS || isXS || isS) {
        setChatListOpen(!chatListOpen);
      }
      selectExchange(exchange);
      navigate({
        pathname: `${BosonRoutes.Chat}/${exchange.id}`
      });
    },
    [chatListOpen, isS, isXS, isXXS, navigate]
  );

  const isSellerOrBuyer = !(
    !isLoadingSeller &&
    !isLoadingBuyer &&
    (isErrorSellers || isErrorBuyers || (!sellerId && !buyerId))
  );
  const isChatInitialized = !!bosonXmtp;
  return (
    <>
      <Container>
        <GlobalStyle />

        <MessageList
          myBuyerId={buyerId}
          mySellerId={sellerId}
          exchanges={exchanges}
          prevPath={previousPath}
          isConversationOpened={
            location.pathname !== `${BosonRoutes.Chat}/` &&
            location.pathname !== `${BosonRoutes.Chat}`
          }
          onChangeConversation={onChangeConversation}
          chatListOpen={chatListOpen}
          setChatListOpen={setChatListOpen}
          currentExchange={selectedExchange}
          address={address}
          isChatInitialized={isChatInitialized}
          showNotifiIcon={!!notifiConfig}
          setShowNotifiModal={setShowNotifiModal}
          notifiRegistration={notifiRegistration}
        />

        {exchangeIdNotOwned || !selectedExchange ? (
          <>
            {(location.pathname === `${BosonRoutes.Chat}/` ||
              location.pathname === `${BosonRoutes.Chat}` ||
              !isSellerOrBuyer) && (
              <SelectMessageContainer>
                <SimpleMessage>
                  {exchangeIdNotOwned ? (
                    "You don't have this exchange"
                  ) : isSellerOrBuyer && exchanges.length ? (
                    <>
                      <span>&#8592;</span> {"Please select a conversation"}
                    </>
                  ) : (
                    "You need to have an exchange to chat"
                  )}
                </SimpleMessage>
              </SelectMessageContainer>
            )}
          </>
        ) : (
          <Routes>
            <Route
              path={`:${UrlParameters.exchangeId}`}
              element={
                <ChatConversation
                  myBuyerId={buyerId}
                  mySellerId={sellerId}
                  key={selectedExchange?.id || ""}
                  exchange={selectedExchange}
                  refetchExchanges={refetchExchanges}
                  setChatListOpen={setChatListOpen}
                  chatListOpen={chatListOpen}
                  prevPath={previousPath}
                  onTextAreaChange={onTextAreaChange}
                  textAreaValue={parseInputValue}
                  bosonXmtp={bosonXmtp}
                />
              }
            />
          </Routes>
        )}
      </Container>
    </>
  );
}
