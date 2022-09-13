import { useMemo, useState } from "react";
import styled from "styled-components";

import Grid from "../../../components/ui/Grid";
import { AccountQueryParameters } from "../../../lib/routing/parameters";
import { useQueryParameter } from "../../../lib/routing/useQueryParameter";
import { colors } from "../../../lib/styles/colors";
import { ProfileSectionWrapper } from "../ProfilePage.styles";
import Exchanges from "./Exchanges";
import Offers from "./Offers";
import Redemptions from "./Redemptions";

const Headers = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  z-index: 1;
`;
const Content = styled.div<{ isPrivateProfile: boolean }>`
  background-color: var(--secondary);
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 4rem 0;
  &::before {
    content: "";
    position: absolute;
    top: 0px;
    width: 100%;
    height: 1px;
    box-shadow: 0px 0 10px rgba(0, 0, 0, 0.4);
    background: transparent;
  }
`;

const HeaderTab = styled.div<{ isPrivateProfile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  &:not(:last-child) {
    margin-right: 1.5rem;
  }
`;
const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  span {
    font-size: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 3px solid;
    border-color: ${({ $isActive }) =>
      $isActive ? colors.black : "transparent"};
    font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
  }
`;

type TabsData = {
  id: string;
  title: string;
  content: JSX.Element;
};
const tabIdentifier = "id" as const;

interface Props {
  sellerId: string;
  isErrorSellers: boolean;
  isPrivateProfile: boolean;
}
export default function Tabs({
  isPrivateProfile,
  sellerId,
  isErrorSellers
}: Props) {
  const tabsData = useMemo(() => {
    const tabsData: TabsData[] = [
      {
        id: "offers",
        title: "Offers",
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
        title: "Exchanges",
        content: (
          <Exchanges
            sellerId={sellerId}
            action="redeem"
            isPrivateProfile={isPrivateProfile}
          />
        )
      },
      {
        id: "redemptions",
        title: "Redemptions",
        content: (
          <Redemptions
            sellerId={sellerId}
            // TODO WHAT ACTIONS USER CAN DO
            action={null}
            isPrivateProfile={isPrivateProfile}
          />
        )
      }
    ];
    return tabsData;
  }, [sellerId, isPrivateProfile]);
  const [currentTab, setCurrentTab] = useQueryParameter(
    AccountQueryParameters.tab
  );
  const tabIndex = tabsData.findIndex(
    (tab) => tab[tabIdentifier] === currentTab
  );
  const [indexActiveTab, setIndexActiveTab] = useState(Math.max(tabIndex, 0)); // 0 is the offers tab
  if (isErrorSellers) {
    return <div>There has been an error...</div>;
  }
  const handleActive = (index: number, tab: TabsData) => () => {
    setIndexActiveTab(index);
    setCurrentTab(tab[tabIdentifier]);
  };
  return (
    <Grid flexDirection="column" alignItems="stretch">
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
        <ProfileSectionWrapper>
          {tabsData.map((tab, index) => {
            const isActive = indexActiveTab === index;
            return (
              <Grid key={tab.title} flexDirection="column" alignItems="stretch">
                {isActive && <>{tab.content}</>}
              </Grid>
            );
          })}
        </ProfileSectionWrapper>
      </Content>
    </Grid>
  );
}
