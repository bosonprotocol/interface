import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellerId } from "../../lib/utils/hooks/useCurrentSellerId";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import { DEFAULT_SELLER_PAGE } from "../seller/SellerPages";
import Search from "./Search";

export const HEADER_HEIGHT = "5.4rem";

const NavigationLinks = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  > * {
    flex: 1;
  }
  height: 100%;
  ${({ isMobile, isOpen }) =>
    isMobile
      ? `
  position: absolute;
  top: calc(${HEADER_HEIGHT} + 2px);
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: white;
  transform: ${isOpen ? "translateX(0%)" : "translateX(100%)"};

   a {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-size: 16px;
    font-weight: 600;
    line-height: 150%;
    padding: 2rem;
    color: ${colors.black};
    background-color: ${colors.lightGrey};
    border-bottom: 2px solid ${colors.border};
    position: relative;
    white-space: pre;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: ${colors.border};
      transition: all 150ms ease-in-out;
    }

    &:hover {
      color:var(--secondary);
      &:before {
        height: 100%;
      }
    }
  }
`
      : `
    margin: 0 1rem;
    display: flex;
    width: 100%;
    align-items: stretch;
    justify-content: space-between;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-family: "Plus Jakarta Sans";
      font-style: normal;
      font-size: 16px;
      font-weight: 600;
      line-height: 150%;
      padding: 1rem;
      height: 100%;
      color: ${colors.black};
    }
    a:hover {
      background-color: ${colors.border};
      color: var(--secondary);
    }
`};
`;

const Links = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: end;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
`;

interface Props {
  isMobile: boolean;
  isOpen: boolean;
}
export default function HeaderLinks({ isMobile, isOpen }: Props) {
  const { address } = useAccount();
  const { isLoading, sellerId } = useCurrentSellerId();
  const isAccountSeller = useMemo(
    () => !isLoading && sellerId !== null,
    [isLoading, sellerId]
  );

  const sellUrl = useMemo(
    () =>
      isAccountSeller
        ? generatePath(SellerCenterRoutes.SellerCenter, {
            [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
          })
        : SellerCenterRoutes.CreateProduct,
    [isAccountSeller]
  );

  return (
    <NavigationLinks isMobile={isMobile} isOpen={isOpen}>
      <Search isMobile={isMobile} />
      <Links isMobile={isMobile}>
        <LinkWithQuery to={sellUrl}>Sell</LinkWithQuery>
        <LinkWithQuery to={BosonRoutes.Explore}>Explore Products</LinkWithQuery>
        {address && (
          <LinkWithQuery to={BosonRoutes.YourAccount}>My Items</LinkWithQuery>
        )}
      </Links>
    </NavigationLinks>
  );
}
