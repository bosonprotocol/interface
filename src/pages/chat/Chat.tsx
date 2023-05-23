import { WarningCircle } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAccount } from "wagmi";

import frame from "../../assets/frame.png";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ChatConversation from "./components/ChatConversation";
import MessageList from "./components/MessageList";

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

  const {
    seller: {
      sellerId: sellerId,
      isError: isErrorSellers,
      isLoading: isLoadingSeller
    },
    buyer: { buyerId, isError: isErrorBuyers, isLoading: isLoadingBuyer }
  } = useBuyerSellerAccounts(address || "");

  const {
    data: exchangesAsTheBuyer,
    refetch: refetchExchangesAsTheBuyer,
    isLoading: isBuyerExchangesLoading,
    isError: isBuyerExchangesError
  } = useExchanges(
    {
      buyerId: buyerId,
      disputed: null
    },
    {
      enabled: !!buyerId
    }
  );
  const {
    data: exchangesAsTheSeller,
    refetch: refetchExchangesAsTheSeller,
    isLoading: isSellerExchangesLoading,
    isError: isSellerExchangesError
  } = useExchanges(
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
  return (
    <>
      <Container>
        <GlobalStyle />
        {isBuyerExchangesLoading ||
        isSellerExchangesLoading ||
        isLoadingSeller ||
        isLoadingBuyer ? (
          <Grid justifyContent="center" alignItems="center">
            <Loading />
          </Grid>
        ) : isErrorBuyers ||
          isErrorSellers ||
          isSellerExchangesError ||
          isBuyerExchangesError ? (
          <Grid
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="1rem"
          >
            <WarningCircle size="40" color={colors.red} />
            <Typography $fontSize="2rem">
              Something went wrong, please try again...
            </Typography>
          </Grid>
        ) : exchanges.length ? (
          <>
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
            />

            {exchangeIdNotOwned ? (
              <>
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
                    />
                  }
                />
              </Routes>
            )}
          </>
        ) : (
          <Grid
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="1rem"
          >
            <Typography $fontSize="2rem">You have no exchanges yet</Typography>

            <img src={frame} alt="no exchanges images" />
          </Grid>
        )}
      </Container>
    </>
  );
}
