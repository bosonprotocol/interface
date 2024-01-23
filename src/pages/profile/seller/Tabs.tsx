import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { Grid } from "../../../components/ui/Grid";
import { AccountQueryParameters } from "../../../lib/routing/parameters";
import { useQueryParameter } from "../../../lib/routing/useQueryParameter";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { ExtendedSeller } from "../../explore/WithAllOffers";
import { ProfileSectionWrapper } from "../ProfilePage.styles";
import Exchanges from "./Exchanges";
import Offers from "./Offers";
import Redemptions from "./Redemptions";

const Headers = styled.div`
  display: flex;
  z-index: 1;
  justify-content: space-between;
  margin-bottom: 3.25rem;
  margin-top: 0.5rem;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  ${breakpoint.s} {
    position: static;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    justify-content: flex-start;
    margin-top: 0;
    font-size: 1rem;
  }
`;
const Content = styled.div`
  background-color: var(--secondary);
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 2.25rem 0;
  ${breakpoint.s} {
    padding: 5rem 0;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    width: 100%;
    height: 1px;
    box-shadow: 0px 0 10px rgba(0, 0, 0, 0.4);
    background: transparent;
  }
`;

const HeaderTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  ${breakpoint.s} {
    width: auto;
    flex: 0;
    &:not(:last-child) {
      margin-right: 1.5rem;
    }
  }
`;
const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  width: 100%;
  span {
    font-size: 1.15rem;
    border-bottom: 3px solid;
    border-color: ${({ $isActive }) =>
      $isActive ? colors.black : "transparent"};
    font-weight: ${({ $isActive }) => ($isActive ? "600" : "normal")};
    width: 100%;
    display: block;
    text-align: center;
    padding: 1rem 0;
    ${breakpoint.xs} {
      padding: 1rem 0.5rem;
    }
    ${breakpoint.s} {
      font-size: 1.25rem;
      text-align: left;
      font-size: 1.1rem;
    }
  }
`;

const TabProfileSectionWrapper = styled(ProfileSectionWrapper)`
  padding-left: 2rem;
  padding-right: 2rem;
`;

type TabsData = {
  id: string;
  title: string;
  content: JSX.Element;
};
const tabIdentifier = "id" as const;

interface Props {
  products: ExtendedSeller;
  sellerId: string;
  isErrorSellers: boolean;
  isPrivateProfile: boolean;
  isLoading: boolean;
}
export default function Tabs({
  products,
  isPrivateProfile,
  sellerId,
  isErrorSellers,
  isLoading
}: Props) {
  const tabsData = useMemo(() => {
    const tabsData: TabsData[] = [
      {
        id: "offers",
        title: "Products",
        content: (
          <Offers
            products={products}
            sellerId={sellerId}
            action={isPrivateProfile ? null : "commit"}
            showInvalidOffers={isPrivateProfile}
            isPrivateProfile={isPrivateProfile}
            isLoading={isLoading}
          />
        )
      },
      {
        id: "exchanges",
        title: "Exchanges",
        content: <Exchanges sellerId={sellerId} />
      },
      {
        id: "redemptions",
        title: "Redemptions",
        content: <Redemptions sellerId={sellerId} />
      }
    ];
    return tabsData;
  }, [sellerId, isPrivateProfile, products, isLoading]);
  const [currentTab, setCurrentTab] = useQueryParameter(
    AccountQueryParameters.tab
  );
  const tabIndex = tabsData.findIndex(
    (tab) => tab[tabIdentifier] === currentTab
  );
  const [indexActiveTab, setIndexActiveTab] = useState(Math.max(tabIndex, 0)); // 0 is the offers tab
  if (isErrorSellers) {
    return (
      <EmptyErrorMessage
        title="Error"
        message="There has been an error, please try again later..."
      />
    );
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
        <TabProfileSectionWrapper>
          {tabsData.map((tab, index) => {
            const isActive = indexActiveTab === index;
            return (
              <Grid key={tab.title} flexDirection="column" alignItems="stretch">
                {isActive && <>{tab.content}</>}
              </Grid>
            );
          })}
        </TabProfileSectionWrapper>
      </Content>
    </Grid>
  );
}
