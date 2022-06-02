import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import MyDisputes from "./MyDisputes";
import MyExchanges from "./MyExchanges";
import MyOffers from "./MyOffers";

const TabsContainer = styled.div`
  margin-top: 10px;
  font-size: 1.3rem;
  display: flex;
  flex-direction: column;
`;
const Headers = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const Content = styled.div`
  margin: 20px 10% 0 10%;
`;
const Tab = styled.div`
  display: flex;
  flex-direction: column;
`;
const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  span {
    border-bottom: 3px solid;
    border-color: ${({ $isActive }) =>
      $isActive ? colors.tomato : "transparent"};
    color: ${({ $isActive }) => ($isActive ? colors.tomato : colors.white)};
  }
`;

const tabsData = [
  {
    title: "Offers",
    content: <MyOffers />
  },
  {
    title: "Exchanges",
    content: <MyExchanges />
  },
  {
    title: "Disputes",
    content: <MyDisputes />
  }
];
const exchangesTabIndex = tabsData.findIndex(
  (value) => value.title === "Exchanges"
);

export default function Tabs() {
  const [indexActiveTab, setIndexActiveTab] = useState(exchangesTabIndex || 1);
  const handleActive = (index: number) => () => {
    setIndexActiveTab(index);
  };
  return (
    <TabsContainer>
      <Headers>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <Tab key={tab.title}>
              <TabTitle $isActive={isActive} onClick={handleActive(index)}>
                <span>{tab.title}</span>
              </TabTitle>
            </Tab>
          );
        })}
      </Headers>
      <Content>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return <Tab key={tab.title}>{isActive && tab.content}</Tab>;
        })}
      </Content>
    </TabsContainer>
  );
}
