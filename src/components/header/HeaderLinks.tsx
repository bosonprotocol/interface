import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { useCurrentDisputeResolverId } from "../../lib/utils/hooks/useCurrentDisputeResolverId";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { UserRoles } from "../../router/routes";
import useUserRoles, { checkIfUserHaveRole } from "../../router/useUserRoles";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import { DEFAULT_SELLER_PAGE } from "../seller/SellerPages";
import Search from "./Search";

export const HEADER_HEIGHT = "5.4rem";

const NavigationLinks = styled.div<{
  isMobile: boolean;
  isOpen: boolean;
  $navigationBarPosition: string;
}>`
  background-color: var(--headerBgColor);
  color: var(--headerTextColor);
  > * {
    flex: 1;
  }
  height: 100%;
  a {
    color: var(--headerTextColor, ${colors.black});
    :hover {
      background-color: ${colors.border};
      color: var(--accent);
    }
  }
  ${({ isMobile, isOpen, $navigationBarPosition }) =>
    isMobile
      ? css`
          position: absolute;
          top: calc(${HEADER_HEIGHT} + 2px);
          left: 0;
          right: 0;
          bottom: 0;
          height: 100vh;
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
              &:before {
                height: 100%;
              }
            }
          }
        `
      : css`
          ${() => {
            if (["left", "right"].includes($navigationBarPosition)) {
              return css`
                display: flex;
                flex-direction: column;
                width: 100%;
                align-items: stretch;
                justify-content: space-between;
                gap: 2rem;
                a {
                  justify-content: flex-start;
                  padding: 0.5rem;
                }
                a:last-child {
                  margin-bottom: 2rem;
                }
              `;
            }
            return css`
              margin: 0 1rem;
              display: flex;
              width: 100%;
              align-items: stretch;
              justify-content: space-between;
              a {
                justify-content: center;
                padding: 1rem;
              }
            `;
          }}
          a {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-style: normal;
            font-size: 1rem;
            font-weight: 600;
            line-height: 150%;
            height: 100%;
          }
        `};
`;

const Links = styled.div<{ isMobile: boolean; $navigationBarPosition: string }>`
  display: flex;
  justify-content: end;
  flex-direction: ${({ isMobile, $navigationBarPosition }) =>
    isMobile || ["left", "right"].includes($navigationBarPosition)
      ? "column"
      : "row"};
`;

interface Props {
  isMobile: boolean;
  isOpen: boolean;
  navigationBarPosition: string;
}
export default function HeaderLinks({
  isMobile,
  isOpen,
  navigationBarPosition
}: Props) {
  const { roles } = useUserRoles({ role: [] });
  const { address } = useAccount();
  const supportFunctionality = useCustomStoreQueryParameter<
    ("buyer" | "seller" | "dr")[]
  >("supportFunctionality", { parseJson: true });
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const {
    buyer: { buyerId },
    seller: { sellerId }
  } = useBuyerSellerAccounts(address || "");
  const isAccountSeller = useMemo(() => !!sellerId, [sellerId]);
  const isAccountBuyer = useMemo(() => !!buyerId, [buyerId]);
  const { disputeResolverId } = useCurrentDisputeResolverId();
  const sellUrl = useMemo(
    () =>
      isAccountSeller
        ? generatePath(SellerCenterRoutes.SellerCenter, {
            [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
          })
        : SellerCenterRoutes.CreateProduct,
    [isAccountSeller]
  );

  const isSupportFunctionalityDefined = supportFunctionality !== "";

  const onlyBuyer =
    typeof supportFunctionality != "string" &&
    supportFunctionality?.length === 1 &&
    supportFunctionality?.[0] === "buyer";

  const onlySeller =
    typeof supportFunctionality != "string" &&
    supportFunctionality?.length === 1 &&
    supportFunctionality?.[0] === "seller";

  return (
    <NavigationLinks
      isMobile={isMobile}
      isOpen={isOpen}
      $navigationBarPosition={navigationBarPosition}
    >
      <Search
        isMobile={isMobile}
        navigationBarPosition={navigationBarPosition}
      />
      <Links isMobile={isMobile} $navigationBarPosition={navigationBarPosition}>
        {((isSupportFunctionalityDefined && !onlyBuyer) ||
          !isSupportFunctionalityDefined) &&
          checkIfUserHaveRole(
            roles,
            [UserRoles.Guest, UserRoles.Seller],
            false
          ) &&
          !isCustomStoreFront && (
            <LinkWithQuery to={sellUrl}>Sell</LinkWithQuery>
          )}
        {!onlySeller && (
          <LinkWithQuery to={BosonRoutes.Explore}>
            Explore Products
          </LinkWithQuery>
        )}
        {isAccountBuyer &&
          !onlySeller &&
          address &&
          checkIfUserHaveRole(roles, [UserRoles.Buyer], false) && (
            <LinkWithQuery to={BosonRoutes.YourAccount}>My Items</LinkWithQuery>
          )}
        {!!disputeResolverId &&
          checkIfUserHaveRole(roles, [UserRoles.DisputeResolver], true) && (
            <LinkWithQuery to={`${BosonRoutes.DRAdmin}/disputes`}>
              Dispute Admin
            </LinkWithQuery>
          )}
      </Links>
    </NavigationLinks>
  );
}
