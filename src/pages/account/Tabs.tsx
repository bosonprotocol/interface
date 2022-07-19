import { useMemo, useState } from "react";
import styled from "styled-components";

import { AccountQueryParameters } from "../../lib/routing/parameters";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import Disputes from "./Disputes";
import Exchanges from "./Exchanges";
import Funds from "./funds/Funds";
import Offers from "./Offers";

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Headers = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const Content = styled.div<{ isPrivateProfile: boolean }>`
  margin: ${({ isPrivateProfile }) =>
    isPrivateProfile ? "2rem 7%" : "2rem 0%"};
`;
const HeaderTab = styled.div<{ isPrivateProfile: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  align-items: center;
  ${({ isPrivateProfile }) =>
    isPrivateProfile
      ? ""
      : `
      :first-child {
        > div {
          align-self: flex-start;
        }
      }
      :last-child {
        > div {
          align-self: flex-end;
        }
      }
    `};
`;
const ContentTab = styled.div`
  display: flex;
  flex-direction: column;
`;
const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  span {
    font-size: 2rem;
    border-bottom: 3px solid;
    border-color: ${({ $isActive }) =>
      $isActive ? colors.black : "transparent"};
  }
`;

type TabsData = {
  id: string;
  title: string;
  content: JSX.Element;
};
const tabIdentifier = "id" as const;

interface Props {
  isPrivateProfile: boolean;
  address: string;
  children?: JSX.Element;
}
export default function Tabs({
  isPrivateProfile,
  address,
  children: SellerBuyerToggle
}: Props) {
  const {
    seller: { sellerId, isError: isErrorSellers },
    buyer: { buyerId, isError: isErrorBuyers }
  } = useBuyerSellerAccounts(address);

  const tabsData = useMemo(() => {
    const tabsData: TabsData[] = [
      {
        id: "offers",
        title: isPrivateProfile ? "My Offers" : "Offers",
        content: (
          <Offers
            sellerId={sellerId}
            action={isPrivateProfile ? null : "commit"}
            showInvalidOffers={isPrivateProfile}
            isPrivateProfile={isPrivateProfile}
          />
        )
      },
      {
        id: "exchanges",
        title: isPrivateProfile ? "My Exchanges" : "Exchanges",
        content: (
          <Exchanges
            sellerId={sellerId}
            buyerId={buyerId}
            action="redeem"
            isPrivateProfile={isPrivateProfile}
          />
        )
      },
      {
        id: "disputes",
        title: isPrivateProfile ? "My Disputes" : "Disputes",
        content: (
          <Disputes
            sellerId={sellerId}
            buyerId={buyerId}
            isPrivateProfile={isPrivateProfile}
          />
        )
      }
    ];
    if (isPrivateProfile) {
      tabsData.push({
        id: "funds",
        title: "My Funds",
        content: <Funds sellerId={sellerId} buyerId={buyerId} />
      });
    }
    return tabsData;
  }, [sellerId, buyerId, isPrivateProfile]);
  const [currentTab, setCurrentTab] = useQueryParameter(
    AccountQueryParameters.tab
  );
  const tabIndex = tabsData.findIndex(
    (tab) => tab[tabIdentifier] === currentTab
  );
  const [indexActiveTab, setIndexActiveTab] = useState(Math.max(tabIndex, 0)); // 0 is the offers tab
  if (isErrorSellers || isErrorBuyers) {
    return <div>There has been an error...</div>;
  }
  const handleActive = (index: number, tab: TabsData) => () => {
    setIndexActiveTab(index);
    setCurrentTab(tab[tabIdentifier]);
  };
  const isMyOffersSelected = indexActiveTab === 0;
  return (
    <TabsContainer>
      <Headers>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <HeaderTab key={tab.id} isPrivateProfile={isPrivateProfile}>
              <TabTitle
                $isActive={isActive}
                data-testid={`tab-${tab.title}`}
                onClick={handleActive(index, tab)}
              >
                <span>{tab.title}</span>
              </TabTitle>
            </HeaderTab>
          );
        })}
      </Headers>

      <Content isPrivateProfile={isPrivateProfile}>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <ContentTab key={tab.title}>
              {isActive && (
                <>
                  {!isMyOffersSelected && isPrivateProfile && SellerBuyerToggle}
                  {tab.content}
                </>
              )}
            </ContentTab>
          );
        })}
      </Content>
    </TabsContainer>
  );
}
