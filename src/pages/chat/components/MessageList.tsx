import { ArrowLeft } from "phosphor-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import { getSellerCenterPath } from "../../../components/seller/paths";
import { sellerPageTypes } from "../../../components/seller/SellerPages";
import Image from "../../../components/ui/Image";
import SellerID from "../../../components/ui/SellerID";
import Video from "../../../components/ui/Video";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { MessagesDisputesToggle } from "./MessagesDisputesToggle";

const messageItemPadding = "1.5rem";

const Container = styled.div<{
  $chatListOpen?: boolean;
  $isConversationOpened?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  border: 1px solid ${colors.border};
  position: absolute;
  z-index: ${zIndex.ChatSeparator};
  background: white;
  height: 100vh;
  transition: 400ms;
  width: 100vw;
  width: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "100vw" : "auto"};
  position: ${({ $isConversationOpened }) =>
    $isConversationOpened ? "absolute" : "relative"};
  left: ${({ $chatListOpen }) => ($chatListOpen ? "0" : "-100vw")};
  left: ${({ $isConversationOpened, $chatListOpen }) =>
    $isConversationOpened && !$chatListOpen ? "-100vw" : "0"};
  ${breakpoint.m} {
    left: unset;
    position: relative;
    height: auto;
    z-index: ${zIndex.Default};
    width: auto;
    flex: 1 1 39rem;
  }
  ${breakpoint.l} {
    flex: 1 1 22%;
  }
  ${breakpoint.xl} {
    flex: 1 1 25%;
    max-width: 25rem;
  }
`;

const BackToSellerCenterButton = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  background: unset;
  padding: unset;
  border: unset;
  color: ${colors.secondary};
  z-index: ${zIndex.LandingTitle};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-direction: column;
  padding: 26px 32px;
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: 1px solid ${colors.border};
  position: relative;

  ${breakpoint.l} {
    padding: 1.5rem;
  }
`;

const ExchangesThreads = styled.div`
  overflow: auto;
  padding-bottom: 20%;
`;

const MessageItem = styled.div<{ $active?: boolean }>`
  border-bottom: 1px solid ${colors.border};
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${colors.border};
    `};
  :hover {
    background-color: ${colors.border};
  }
`;

const StyledImage = styled(Image)`
  [data-image-placeholder] {
    font-size: 0.5rem;
  }
`;

const MessageContent = styled.div`
  padding: ${messageItemPadding};
  display: flex;
  align-items: center;
  column-gap: 1rem;
`;

const ExchangeName = styled.div`
  font-weight: 600;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  div {
    ${breakpoint.xxs} {
      font-size: 0.8875rem;
    }
    ${breakpoint.l} {
      font-size: 0.8rem;
    }
    ${breakpoint.xl} {
      font-size: 1rem;
    }
  }
`;

interface Props {
  myBuyerId: string;
  mySellerId: string;
  exchanges: Exchange[];
  onChangeConversation: (exchange: Exchange) => void;
  chatListOpen: boolean;
  currentExchange?: Exchange;
  isConversationOpened: boolean;
  setChatListOpen: (p: boolean) => void;
  prevPath: string;
  selectExchange: Dispatch<SetStateAction<Exchange | undefined>>;
}

const getMessageItemKey = (exchange: Exchange) => exchange.id;

export default function MessageList({
  myBuyerId,
  mySellerId,
  exchanges,
  onChangeConversation,
  chatListOpen,
  currentExchange,
  isConversationOpened,
  setChatListOpen,
  prevPath,
  selectExchange
}: Props) {
  const [showDisputesOnly, setShowDisputesOnly] = useState<boolean>(
    !!currentExchange?.disputedDate
  );
  const [activeMessageKey, setActiveMessageKey] = useState<string>(
    currentExchange ? getMessageItemKey(currentExchange) : ""
  );
  const navigate = useKeepQueryParamsNavigate();
  const { isS } = useBreakpoints();
  useEffect(() => {
    if (currentExchange) {
      setActiveMessageKey(getMessageItemKey(currentExchange));
      setShowDisputesOnly(!!currentExchange?.disputedDate);
    }
  }, [currentExchange]);
  const comesFromSellerCenter = !!prevPath?.startsWith(`${BosonRoutes.Sell}/`);
  return (
    <Container
      $chatListOpen={chatListOpen}
      $isConversationOpened={isConversationOpened}
    >
      <Header>
        {comesFromSellerCenter && (
          <BackToSellerCenterButton
            type="button"
            onClick={() => {
              const sellerCenterMessagesUrl = generatePath(
                SellerCenterRoutes.SellerCenter,
                {
                  [UrlParameters.sellerPage]: sellerPageTypes.messages.url
                }
              );
              navigate({
                pathname:
                  sellerCenterMessagesUrl === prevPath
                    ? getSellerCenterPath("Dashboard")
                    : prevPath
              });
            }}
          >
            <div>
              <ArrowLeft size={14} />
              <span style={{ marginLeft: "0.5rem" }}>Back to Seller Hub</span>
            </div>
          </BackToSellerCenterButton>
        )}
        <MessagesDisputesToggle
          leftButtonText="Messages"
          rightButtonText="Disputes"
          onLeftButtonClick={() => {
            setShowDisputesOnly(false);
            const firstExchangeWithNoDispute = exchanges
              .filter((exchange) => exchange)
              .find((exchange) => !exchange.disputedDate);
            if (firstExchangeWithNoDispute) {
              selectExchange(firstExchangeWithNoDispute);
            }
          }}
          onRightButtonClick={() => {
            setShowDisputesOnly(true);
            const firstDisputedExchange = exchanges
              .filter((exchange) => exchange)
              .find((exchange) => !!exchange.disputedDate);
            if (firstDisputedExchange) {
              selectExchange(firstDisputedExchange);
            }
          }}
          initiallySelected={showDisputesOnly ? "right" : "left"}
          isLeftActive={!showDisputesOnly}
        />
      </Header>
      <ExchangesThreads>
        {exchanges
          .filter((exchange) => exchange)
          .filter((exchange) =>
            showDisputesOnly ? !!exchange.disputedDate : !exchange.disputedDate
          )
          .map((exchange) => {
            const messageKey = getMessageItemKey(exchange);
            const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
            const iAmTheSeller = mySellerId === exchange?.offer.seller.id;
            const iAmBoth = iAmTheBuyer && iAmTheSeller;
            const buyerOrSellerToShow = iAmBoth
              ? exchange?.offer.seller
              : iAmTheBuyer
              ? exchange?.offer.seller
              : exchange?.buyer;
            const animationUrl = exchange?.offer.metadata.animationUrl || "";
            const renderProductImage = () => {
              return (
                <StyledImage
                  src={exchange?.offer.metadata.imageUrl}
                  alt={"exchange image" + exchange.id}
                  style={{
                    height: "3.125rem",
                    width: "3.125rem",
                    padding: 0
                  }}
                />
              );
            };
            return (
              <MessageItem
                $active={messageKey === activeMessageKey}
                onClick={() => {
                  onChangeConversation(exchange);
                  setActiveMessageKey(messageKey);
                  if (isS) {
                    setChatListOpen(!chatListOpen);
                  }
                }}
                key={messageKey}
              >
                <MessageContent>
                  {animationUrl ? (
                    <Video
                      src={animationUrl}
                      dataTestId="exchangeAnimationUrl"
                      style={{
                        height: "3.125rem",
                        width: "3.125rem",
                        padding: 0
                      }}
                      videoProps={{
                        muted: true,
                        loop: true,
                        autoPlay: true
                      }}
                      componentWhileLoading={renderProductImage}
                    />
                  ) : (
                    renderProductImage()
                  )}

                  <MessageInfo>
                    <ExchangeName>{exchange?.offer.metadata.name}</ExchangeName>
                    <SellerID
                      offer={exchange?.offer}
                      buyerOrSeller={buyerOrSellerToShow}
                      withProfileImage
                      onClick={() => null}
                      withBosonStyles={false}
                    />
                  </MessageInfo>
                </MessageContent>
              </MessageItem>
            );
          })}
      </ExchangesThreads>
    </Container>
  );
}
