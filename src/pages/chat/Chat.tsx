import { subgraph } from "@bosonprotocol/react-kit";
import { Container as OuterContainer } from "components/app/index.styles";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import ConnectWallet from "components/header/web3Status";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { WarningCircle } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import { Grid } from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import { Typography } from "../../components/ui/Typography";
import { UrlParameters } from "../../lib/routing/parameters";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { isTruthy } from "../../lib/types/helpers";
import { useLensProfilesPerSellerIds } from "../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { useDisputes } from "../../lib/utils/hooks/useDisputes";
import { Exchange, useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import ChatConversation from "./components/conversation/ChatConversation";
import MessageList from "./components/MessageList";
import { chatUrl } from "./const";

const GlobalStyle = createGlobalStyle`
  html, body, #root, [data-rk] {
    height: 100%;
  }
  #root > ${OuterContainer} {
    overflow: auto;
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
  background: ${colors.greyLight};
`;

export default function Chat() {
  const { account: address } = useAccount();

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

  const { sellers, exchanges } = useMemo(() => {
    const allSellersWithDup = exchangesAsTheBuyer
      ? [...exchangesAsTheBuyer.map((e) => e.seller)]
      : [];
    if (exchangesAsTheSeller && exchangesAsTheSeller?.length > 0) {
      allSellersWithDup.push(exchangesAsTheSeller[0].seller);
    }
    const sellersMap = allSellersWithDup.reduce((map, seller) => {
      if (!map.has(seller.id)) {
        map.set(seller.id, seller);
      }
      return map;
    }, new Map<string, (typeof allSellersWithDup)[0]>());
    return {
      sellers: Array.from(sellersMap.values()),
      exchanges: Array.from(
        new Map(
          [...(exchangesAsTheBuyer || []), ...(exchangesAsTheSeller || [])].map(
            (v) => [v.id, v]
          )
        ).values()
      )
    };
  }, [exchangesAsTheBuyer, exchangesAsTheSeller]);

  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers },
    { enabled: Boolean(sellers?.length) }
  );

  // Fetch all data about exchanges (dispute data) in a unique request
  const { data: disputes } = useDisputes(
    {
      disputesFilter: {
        exchange_in: exchanges?.filter(isTruthy).map((exchange) => exchange.id)
      }
    },
    {
      enabled: Boolean(exchanges?.length)
    }
  );
  const disputeDataPerExchangeId = (disputes || []).reduce(
    (_disputeDataPerExchangeId, dispute) => {
      return _disputeDataPerExchangeId.set(dispute.exchange.id, dispute);
    },
    new Map<string, subgraph.DisputeFieldsFragment>()
  );

  const refetchExchanges = useCallback(() => {
    refetchExchangesAsTheSeller();
    refetchExchangesAsTheBuyer();
  }, [refetchExchangesAsTheBuyer, refetchExchangesAsTheSeller]);

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

  const [mapExchangeIdToInputText, setMapExchangeIdToInputText] = useState(
    new Map<string, string>()
  );

  const onTextAreaChange = useCallback(
    (textAreaTargetValue: string) => {
      if (exchangeId) {
        mapExchangeIdToInputText.set(exchangeId, textAreaTargetValue);
        setMapExchangeIdToInputText(new Map(mapExchangeIdToInputText));
      }
    },
    [exchangeId, mapExchangeIdToInputText]
  );

  const parseInputValue: string | undefined = useMemo(() => {
    return exchangeId ? mapExchangeIdToInputText.get(exchangeId) : undefined;
  }, [exchangeId, mapExchangeIdToInputText]);
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
        pathname: `${chatUrl}/${exchange.id}`
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
            <Typography fontSize="2rem">
              Something went wrong, please try again...
            </Typography>
          </Grid>
        ) : exchanges.length ? (
          <>
            <MessageList
              myBuyerId={buyerId}
              mySellerId={sellerId}
              exchanges={exchanges}
              sellerLensProfilePerSellerId={sellerLensProfilePerSellerId}
              prevPath={previousPath}
              isConversationOpened={
                location.pathname !== `${chatUrl}/` &&
                location.pathname !== `${chatUrl}`
              }
              onChangeConversation={onChangeConversation}
              chatListOpen={chatListOpen}
              setChatListOpen={setChatListOpen}
              currentExchange={selectedExchange}
              selectExchange={selectExchange}
            />

            {exchangeIdNotOwned ? (
              <>
                {(location.pathname === `${chatUrl}/` ||
                  location.pathname === `${chatUrl}` ||
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
                      sellerLensProfile={sellerLensProfilePerSellerId?.get(
                        sellerId
                      )}
                      dispute={disputeDataPerExchangeId?.get(
                        selectedExchange?.id || ""
                      )}
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
          >
            <EmptyErrorMessage
              message={
                address
                  ? "Commit to some products to see your chat conversations"
                  : "Please connect your wallet to display your messages"
              }
              title={address ? "You have no exchanges yet" : "Connect wallet"}
              cta={address ? undefined : <ConnectWallet />}
            />
          </Grid>
        )}
      </Container>
    </>
  );
}
