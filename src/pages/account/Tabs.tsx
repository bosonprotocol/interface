import { useMemo, useState } from "react";
import styled from "styled-components";

import { AccountQueryParameters } from "../../lib/routing/parameters";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useSellers } from "../../lib/utils/hooks/useSellers";
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
const Content = styled.div`
  margin: 30px 10% 0 10%;
`;
const HeaderTab = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  align-items: center;
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
      $isActive ? colors.green : "transparent"};
    color: ${({ $isActive }) => ($isActive ? colors.green : "inherit")};
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
}
export default function Tabs({ isPrivateProfile, address }: Props) {
  const { data: sellers, isError: isErrorSellers } = useSellers({
    admin: address
  });
  const { data: buyers, isError: isErrorBuyers } = useBuyers({
    wallet: address
  });
  const sellerId = sellers?.[0]?.id || "";
  const buyerId = buyers?.[0]?.id || "";
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
            showCTA={!isPrivateProfile}
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
      },
      {
        id: "funds",
        title: "My Funds",
        content: <Funds sellerId={sellerId} buyerId={buyerId} />
      }
    ];
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
  return (
    <TabsContainer>
      <Headers>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <HeaderTab key={tab.id}>
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
      <Content>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <ContentTab key={tab.title}>{isActive && tab.content}</ContentTab>
          );
        })}
      </Content>
    </TabsContainer>
  );
}
