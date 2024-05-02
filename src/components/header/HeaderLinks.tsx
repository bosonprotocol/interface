import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { defaultFontFamily } from "lib/styles/fonts";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentDisputeResolverId } from "../../lib/utils/hooks/useCurrentDisputeResolverId";
import { ViewMode } from "../../lib/viewMode";
import { useCustomStoreQueryParameter } from "../../pages/custom-store/useCustomStoreQueryParameter";
import { UserRoles } from "../../router/routes";
import useUserRoles, { checkIfUserHaveRole } from "../../router/useUserRoles";
import { getSellerCenterPath } from "../seller/paths";
import ViewTxButton from "../transactions/ViewTxButton";
import { ViewModeLink } from "../viewMode/ViewMode";
import Search from "./Search";

export const HEADER_HEIGHT = "5.4rem";

const NavigationLinks = styled.div<{
  $isMobile: boolean;
  $isOpen: boolean;
  $navigationBarPosition?: string;
  $hoverHeaderTextColor: string;
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
    &:hover {
      background-color: ${colors.border};
      color: ${({ $hoverHeaderTextColor }) => $hoverHeaderTextColor};
    }
  }
  ${({ $isMobile, $isOpen, $navigationBarPosition }) =>
    $isMobile
      ? css`
          position: absolute;
          top: calc(${HEADER_HEIGHT} + 1px);
          left: 0;
          right: 0;
          bottom: 0;
          height: 100vh;
          transform: ${$isOpen ? "translateX(0%)" : "translateX(100%)"};

          a,
          [data-anchor] {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-family: ${defaultFontFamily};
            font-style: normal;
            font-size: 1rem;
            font-weight: 600;
            line-height: 150%;
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
                a,
                [data-anchor] {
                  justify-content: flex-start;
                  padding: 0.5rem;
                }
                a:last-child {
                  margin-bottom: 2rem;
                }
              `;
            }
            return css`
              margin-left: 1rem;
              display: flex;
              width: 100%;
              align-items: stretch;
              justify-content: space-between;
              a,
              [data-anchor] {
                justify-content: center;
                padding-top: 1rem;
                padding-bottom: 1rem;
                padding-left: 0.1rem;
                padding-right: 0.1rem;
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
            white-space: nowrap;
          }
        `};
`;

const ItemsList = styled.div<{
  $isMobile: boolean;
  $navigationBarPosition?: string;
}>`
  display: flex;
  justify-content: end;
  flex-direction: ${({ $isMobile, $navigationBarPosition }) =>
    $isMobile || ["left", "right"].includes($navigationBarPosition ?? "")
      ? "column"
      : "row"};
  align-items: ${({ $navigationBarPosition }) =>
    ["left", "right"].includes($navigationBarPosition ?? "") ? "center" : ""};
  > * {
    padding: 2rem;
  }
  ${({ $isMobile }) =>
    !$isMobile &&
    css`
      gap: 1rem;
    `}
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
  withSellerHub?: boolean;
  children?: ReactNode;
}
export default function HeaderLinks({
  isMobile,
  isOpen,
  navigationBarPosition,
  withSearch = true,
  withExploreProducts = true,
  withMyItems = true,
  withDisputeAdmin = true,
  withResolutionCenter,
  withSellerHub,
  children
}: Props) {
  const { roles } = useUserRoles({ role: [] });
  const { account: address } = useAccount();
  const supportFunctionality = useCustomStoreQueryParameter<
    ("buyer" | "seller" | "dr")[]
  >("supportFunctionality", { parseJson: true });

  const { disputeResolverId } = useCurrentDisputeResolverId();

  const onlySeller =
    typeof supportFunctionality != "string" &&
    supportFunctionality?.length === 1 &&
    supportFunctionality?.[0] === "seller";

  return (
    <NavigationLinks
      $isMobile={isMobile}
      $isOpen={isOpen}
      $navigationBarPosition={navigationBarPosition}
      $hoverHeaderTextColor={getColor1OverColor2WithContrast({
        color2: useCSSVariable("--headerBgColor") || colors.white,
        color1: useCSSVariable("--headerTextColor") || colors.darkGrey
      })}
    >
      {withSearch && (
        <Search
          isMobile={isMobile}
          navigationBarPosition={navigationBarPosition}
        />
      )}
      <ItemsList
        $isMobile={isMobile}
        $navigationBarPosition={navigationBarPosition}
      >
        {!onlySeller && withExploreProducts && (
          <ViewModeLink
            href={BosonRoutes.Explore}
            destinationViewMode={ViewMode.DAPP}
          >
            Explore Products
          </ViewModeLink>
        )}
        {withResolutionCenter && (
          <ViewModeLink
            href={DrCenterRoutes.Root}
            destinationViewMode={ViewMode.DR_CENTER}
          >
            Resolution Center
          </ViewModeLink>
        )}
        {address &&
          withSellerHub &&
          checkIfUserHaveRole(roles, [UserRoles.Seller], false) && (
            <ViewModeLink
              rel="noopener noreferrer"
              href={getSellerCenterPath("Dashboard")}
              destinationViewMode={ViewMode.DAPP}
            >
              Seller Hub
            </ViewModeLink>
          )}
        {!onlySeller &&
          address &&
          withMyItems &&
          checkIfUserHaveRole(roles, [UserRoles.Buyer], false) && (
            <ViewModeLink
              href={BosonRoutes.YourAccount}
              destinationViewMode={ViewMode.DAPP}
            >
              My Items
            </ViewModeLink>
          )}
        {!!disputeResolverId &&
          withDisputeAdmin &&
          checkIfUserHaveRole(roles, [UserRoles.DisputeResolver], true) && (
            <ViewModeLink
              href={`${BosonRoutes.DRAdmin}/disputes`}
              destinationViewMode={ViewMode.DAPP}
            >
              Dispute Admin
            </ViewModeLink>
          )}
        {address && <ViewTxButton />}
        {children}
      </ItemsList>
    </NavigationLinks>
  );
}
