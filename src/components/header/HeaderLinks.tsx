import { useMemo } from "react";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { useCurrentDisputeResolverId } from "../../lib/utils/hooks/useCurrentDisputeResolverId";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { UserRoles } from "../../router/routes";
import useUserRoles, { checkIfUserHaveRole } from "../../router/useUserRoles";
import { LinkWithQuery } from "../customNavigation/LinkWithQuery";
import ViewTxButton from "../transactions/ViewTxButton";
import Search from "./Search";

export const HEADER_HEIGHT = "5.4rem";

const NavigationLinks = styled.div<{
  isMobile: boolean;
  isOpen: boolean;
  $navigationBarPosition?: string;
}>`
  background-color: var(--headerBgColor);
  color: var(--headerTextColor);
  > * {
    flex: 1;
  }
  height: 100%;
  a,
  [data-anchor] {
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
          ${() => {
            return css`
              top: calc(${HEADER_HEIGHT} + 1px);
            `;
          }}
          left: 0;
          right: 0;
          bottom: 0;
          height: 100vh;
          transform: ${isOpen ? "translateX(0%)" : "translateX(100%)"};
          a,
          [data-anchor] {
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
            if (["left", "right"].includes($navigationBarPosition ?? "")) {
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
              a,
              [data-anchor] {
                justify-content: center;
                padding: 1rem 0;
              }
            `;
          }}
          a, [data-anchor] {
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

const Links = styled.div<{
  isMobile: boolean;
  $navigationBarPosition?: string;
}>`
  display: flex;
  justify-content: end;
  gap: 1rem;
  flex-direction: ${({ isMobile, $navigationBarPosition }) =>
    isMobile || ["left", "right"].includes($navigationBarPosition ?? "")
      ? "column"
      : "row"};
  align-items: ${({ $navigationBarPosition }) =>
    ["left", "right"].includes($navigationBarPosition ?? "") ? "center" : ""};
`;

interface Props {
  isMobile: boolean;
  isOpen: boolean;
  navigationBarPosition?: string;
  withSearch?: boolean;
  withExploreProducts?: boolean;
  withMyItems?: boolean;
  withDisputeAdmin?: boolean;
  withResolutionCenter?: boolean;
}
export default function HeaderLinks({
  isMobile,
  isOpen,
  navigationBarPosition,
  withSearch = true,
  withExploreProducts = true,
  withMyItems = true,
  withDisputeAdmin = true,
  withResolutionCenter
}: Props) {
  const { roles } = useUserRoles({ role: [] });
  const { address } = useAccount();
  const supportFunctionality = useCustomStoreQueryParameter<
    ("buyer" | "seller" | "dr")[]
  >("supportFunctionality", { parseJson: true });

  const {
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");

  const isAccountBuyer = useMemo(() => !!buyerId, [buyerId]);
  const { disputeResolverId } = useCurrentDisputeResolverId();

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
      {withSearch && (
        <Search
          isMobile={isMobile}
          navigationBarPosition={navigationBarPosition}
        />
      )}
      <Links isMobile={isMobile} $navigationBarPosition={navigationBarPosition}>
        {!onlySeller && withExploreProducts && (
          <LinkWithQuery to={BosonRoutes.Explore}>
            Explore Products
          </LinkWithQuery>
        )}
        {withResolutionCenter && (
          <LinkWithQuery to={DrCenterRoutes.Root}>
            Resolution Center
          </LinkWithQuery>
        )}
        {isAccountBuyer &&
          !onlySeller &&
          address &&
          withMyItems &&
          checkIfUserHaveRole(roles, [UserRoles.Buyer], false) && (
            <LinkWithQuery to={BosonRoutes.YourAccount}>My Items</LinkWithQuery>
          )}
        {!!disputeResolverId &&
          withDisputeAdmin &&
          checkIfUserHaveRole(roles, [UserRoles.DisputeResolver], true) && (
            <LinkWithQuery to={`${BosonRoutes.DRAdmin}/disputes`}>
              Dispute Admin
            </LinkWithQuery>
          )}
        {address && <ViewTxButton />}
      </Links>
    </NavigationLinks>
  );
}
