import React, { useState } from "react";
import styled from "styled-components";

import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";

const Headers = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  flex-shrink: 0;

  font-size: 1.15rem;
  border-bottom: 3px solid;
  border-color: ${({ $isActive }) =>
    $isActive ? colors.secondary : "transparent"};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
`;

type TabsData = {
  id: string;
  title: string;
  content: JSX.Element;
};
const tabIdentifier = "id" as const;

interface Props {
  tabsData: TabsData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Content: React.ComponentType<any>;
  tabQueryParameter?: string;
}
export default function Tabs({
  tabsData,
  Content,
  tabQueryParameter,
  ...rest
}: Props) {
  const [currentTab, setCurrentTab] = useQueryParameter(
    tabQueryParameter || ""
  );
  const tabIndex = tabsData.findIndex(
    (tab) => tab[tabIdentifier] === currentTab
  );
  const [indexActiveTab, setIndexActiveTab] = useState(Math.max(tabIndex, 0));
  const handleActive = (index: number, tab: TabsData) => () => {
    setIndexActiveTab(index);
    tabQueryParameter && setCurrentTab(tab[tabIdentifier]);
  };
  return (
    <Grid flexDirection="column" alignItems="stretch" {...rest}>
      <Headers>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <TabTitle
              key={tab.id}
              $isActive={isActive}
              data-tab-title
              data-testid={`tab-${tab.title}`}
              onClick={handleActive(index, tab)}
            >
              {tab.title}
            </TabTitle>
          );
        })}
      </Headers>
      <Content>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <Grid key={tab.title} flexDirection="column" alignItems="stretch">
              {isActive && <>{tab.content}</>}
            </Grid>
          );
        })}
      </Content>
    </Grid>
  );
}
