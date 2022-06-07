import { useMemo, useState } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useSellers } from "../../lib/utils/hooks/useSellers";
import Disputes from "./Disputes";
import Exchanges from "./Exchanges";
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
    color: ${({ $isActive }) => ($isActive ? colors.green : colors.white)};
  }
`;

interface Props {
  isPrivateProfile: boolean;
  address: string;
}
export default function Tabs({ isPrivateProfile, address }: Props) {
  const [indexActiveTab, setIndexActiveTab] = useState(0);
  const { data: sellers, isError: isErrorSellers } = useSellers({
    admin: address
  });
  const { data: buyers, isError: isErrorBuyers } = useBuyers({
    wallet: address
  });
  const sellerId = sellers?.[0]?.id || "";
  const buyerId = buyers?.[0]?.id || "";
  const tabsData = useMemo(() => {
    const tabsData: {
      title: string;
      content: JSX.Element;
    }[] = [
      {
        title: isPrivateProfile ? "My Offers" : "Offers",
        content: (
          <Offers
            sellerId={sellerId}
            action={isPrivateProfile ? null : "commit"}
          />
        )
      },
      {
        title: isPrivateProfile ? "My Exchanges" : "Exchanges",
        content: (
          <Exchanges
            sellerId={sellerId}
            buyerId={buyerId}
            action={isPrivateProfile ? null : "redeem"}
          />
        )
      },
      {
        title: isPrivateProfile ? "My Disputes" : "Disputes",
        content: <Disputes sellerId={sellerId} buyerId={buyerId} />
      }
    ];
    return tabsData;
  }, [sellerId, buyerId]);

  if (isErrorSellers || isErrorBuyers) {
    return <div>There has been an error...</div>;
  }
  const handleActive = (index: number) => () => {
    setIndexActiveTab(index);
  };
  return (
    <TabsContainer>
      <Headers>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <HeaderTab key={tab.title}>
              <TabTitle $isActive={isActive} onClick={handleActive(index)}>
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
