import { useState } from "react";
import styled from "styled-components";

import { breakpointNumbers } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import Column from "../../../ui/column";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { PortfolioRowWrapper } from "./PortfolioRow";
import Tokens from "./tokens";

const Wrapper = styled(Column)`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;

  @media screen and (max-width: ${breakpointNumbers.s}px) {
    margin-bottom: 48px;
  }

  ${PortfolioRowWrapper} {
    &:hover {
      background: ${colors.lightGrey};
    }
  }
`;

const Nav = styled(Grid)`
  gap: 20px;
`;

const NavItem = styled(Typography)<{ active?: boolean }>`
  align-items: center;
  color: ${({ theme, active }) => (active ? colors.white : theme.textTertiary)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: ${({ theme }) =>
    `${theme.transition.duration.medium} ${theme.transition.timing.ease} color`};

  &:hover {
    ${({ theme, active }) => !active && `color: ${theme.textSecondary}`};
  }
`;

const PageWrapper = styled.div`
  border-radius: 12px;
  margin-right: -16px;
  margin-left: -16px;
  width: calc(100% + 32px);
  flex: 1;
`;

interface Page {
  title: React.ReactNode;
  key: string;
  component: ({ account }: { account: string }) => JSX.Element;
}

const Pages: Array<Page> = [
  {
    title: "Tokens",
    key: "tokens",
    component: Tokens
  }
];

export default function MiniPortfolio({ account }: { account: string }) {
  const [currentPage, setCurrentPage] = useState(0);

  const { component: Page } = Pages[currentPage];

  return (
    <Wrapper>
      <Nav data-testid="mini-portfolio-navbar">
        {Pages.map(({ title, key }, index) => {
          const handleNavItemClick = () => {
            setCurrentPage(index);
          };
          return (
            <NavItem
              onClick={handleNavItemClick}
              active={currentPage === index}
              key={key}
            >
              <span>{title}</span>
            </NavItem>
          );
        })}
      </Nav>
      <PageWrapper data-testid="mini-portfolio-page">
        <Page account={account} />
      </PageWrapper>
    </Wrapper>
  );
}
