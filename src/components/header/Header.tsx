import logo from "assets/logo.svg";
import { LinkWithQuery } from "components/customNavigation/LinkWithQuery";
import { ChainSelector } from "components/header/selector/ChainSelector";
import Layout from "components/layout/Layout";
import { Spinner } from "components/loading/Spinner";
import { Portal } from "components/portal/Portal";
import { DEFAULT_SELLER_PAGE } from "components/seller/SellerPages";
import BosonButton from "components/ui/BosonButton";
import { Grid } from "components/ui/Grid";
import { UrlParameters } from "lib/routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "lib/routing/routes";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { zIndex } from "lib/styles/zIndex";
import { useOffers } from "lib/utils/hooks/offers";
import { useBreakpoints } from "lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCustomStoreQueryParameter } from "pages/custom-store/useCustomStoreQueryParameter";
import { X } from "phosphor-react";
import {
  ElementRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { generatePath, useLocation } from "react-router-dom";
import useUserRoles from "router/useUserRoles";
import styled, { css } from "styled-components";

import { AccountDrawer } from "./accountDrawer";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { BurgerButton } from "./BurgerButton";
import ConnectButton from "./ConnectButton";
import HeaderLinks, { HEADER_HEIGHT } from "./HeaderLinks";

const smallWidth = "180px";
const mediumWidth = "225px";
const sideMargin = "1rem";
const closedHeaderWidth = "75px";

const Header = styled.header<{
  $navigationBarPosition: string;
  $isSideBarOpen: boolean;
}>`
  position: fixed;
  transition: width 300ms;

  ${({ $navigationBarPosition, $isSideBarOpen }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        ${$isSideBarOpen
          ? css`
              width: ${smallWidth};
            `
          : css`
              width: ${closedHeaderWidth};
            `}
        top: 0;
        ${$navigationBarPosition === "left"
          ? css`
              left: 0;
              border-right: 2px solid ${colors.border};

              && {
                ~ * {
                  ${$isSideBarOpen
                    ? css`
                        padding-left: calc(${smallWidth} + ${sideMargin});
                      `
                    : css`
                        padding-left: calc(
                          ${closedHeaderWidth} + ${sideMargin}
                        );
                      `}

                  ${breakpoint.m} {
                    ${$isSideBarOpen
                      ? css`
                          padding-left: calc(${mediumWidth} + ${sideMargin});
                        `
                      : css`
                          padding-left: calc(
                            ${closedHeaderWidth} + ${sideMargin}
                          );
                        `}
                  }
                }
              }
            `
          : css`
              right: 0;
              border-left: 2px solid ${colors.border};
              && {
                ~ * {
                  ${$isSideBarOpen
                    ? css`
                        padding-right: calc(${smallWidth} + ${sideMargin});
                      `
                    : css`
                        padding-right: calc(
                          ${closedHeaderWidth} + ${sideMargin}
                        );
                      `}
                  ${breakpoint.m} {
                    ${$isSideBarOpen
                      ? css`
                          padding-right: calc(${mediumWidth} + ${sideMargin});
                        `
                      : css`
                          padding-right: calc(
                            ${closedHeaderWidth} + ${sideMargin}
                          );
                        `}
                  }
                }
              }
            `}
        height: 100%;

        ${breakpoint.m} {
          width: ${mediumWidth};
        }
      `;
    }
    return css`
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      border-bottom: 2px solid ${colors.border};
      > div {
        > * {
          height: ${HEADER_HEIGHT};
          display: flex;
          align-items: center;
        }
      }
    `;
  }}

  background-color: var(--headerBgColor);
  color: var(--headerTextColor);
  z-index: ${zIndex.Header};
`;

const HeaderContainer = styled(Layout)<{
  fluidHeader?: boolean;
  $navigationBarPosition: string;
}>`
  ${({ $navigationBarPosition, fluidHeader }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        padding: 1rem;
        gap: 2rem;

        ${breakpoint.m} {
          align-items: center;
        }
      `;
    }
    return css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: ${HEADER_HEIGHT};
      ${breakpoint.xs} {
        max-width: ${fluidHeader ? "none" : "93.75rem;"};
      }
    `;
  }}
`;

const HeaderItems = styled.nav<{
  $navigationBarPosition: string;
}>`
  gap: 1rem;
  ${({ $navigationBarPosition }) => {
    if (["left", "right"].includes($navigationBarPosition)) {
      return css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        width: 100%;
      `;
    }
    return css`
      display: flex;
      align-items: center;
      justify-content: end;
      width: 100%;
    `;
  }}
`;
const logoXXSHeightPx = 24;
const logoSHeightPx = 47;
const LogoImg = styled.img`
  height: ${logoXXSHeightPx}px;
  cursor: pointer;
  ${breakpoint.s} {
    height: ${logoSHeightPx}px;
  }
`;

interface Props {
  fluidHeader: boolean | undefined;
}
export const HeaderComponent = forwardRef<HTMLElement, Props>(
  ({ fluidHeader = false }) => {
    const navigate = useKeepQueryParamsNavigate();
    const [isOpen, setOpen] = useState(false);
    const { pathname, search } = useLocation();
    const { isLteS, isLteL, isLteM, isM, isLteXS, isXXS } = useBreakpoints();
    const logoUrl = useCustomStoreQueryParameter("logoUrl");
    const navigationBarPosition = useCustomStoreQueryParameter(
      "navigationBarPosition"
    );
    const isSideNavBar = ["left", "right"].includes(navigationBarPosition);
    const burgerMenuBreakpoint = isLteL && !isSideNavBar;
    const isSideCrossVisible = isSideNavBar && isOpen && isLteS;
    const isSideBurgerVisible = isSideNavBar && !isOpen && isLteS;

    const toggleMenu = () => {
      setOpen(!isOpen);
    };

    useEffect(() => {
      if (!isSideNavBar) {
        setOpen(false);
      }
    }, [pathname, search, isSideNavBar, setOpen]);

    useEffect(() => {
      if ((!isLteM || isM) && !isOpen && isSideNavBar) {
        setOpen(true);
      }
    }, [isLteM, isM, isOpen, setOpen, isSideNavBar]);
    const { sellerId, isFetching } = useUserRoles({
      role: []
    });
    const isSeller = !!sellerId;
    const { data: sellerOffers } = useOffers(
      { sellerId },
      {
        enabled: !!sellerId
      }
    );
    const hasSellerOffers = !!sellerOffers?.length;
    const isCustomStoreFront =
      useCustomStoreQueryParameter("isCustomStoreFront");
    const showSellButton = !isCustomStoreFront;

    const sellUrl = useMemo(() => {
      if (isSeller && hasSellerOffers) {
        return generatePath(SellerCenterRoutes.SellerCenter, {
          [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
        });
      }
      if (!isSeller) {
        return BosonRoutes.Sell;
      }
      return SellerCenterRoutes.CreateProduct;
    }, [isSeller, hasSellerOffers]);
    const CTA = useMemo(() => {
      const commonStyles = { minWidth: "200px" };
      return (
        <>
          {isFetching ? (
            <BosonButton
              variant="accentInverted"
              size="regular"
              {...(!isLteS && { style: commonStyles })}
            >
              <Spinner size={18} />
            </BosonButton>
          ) : (
            showSellButton && (
              <Grid
                flexBasis="content"
                flexShrink="0"
                {...(isSideNavBar && { justifyContent: "center" })}
              >
                <BosonButton
                  variant="accentInverted"
                  style={{
                    whiteSpace: "pre",
                    marginLeft: isLteXS ? "1rem" : "",
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    ...(!isLteS && commonStyles)
                  }}
                  size="regular"
                  onClick={() => {
                    navigate({ pathname: sellUrl });
                  }}
                >
                  {isSeller
                    ? hasSellerOffers
                      ? "Seller Hub"
                      : "Create Products"
                    : "Sell on Boson"}
                </BosonButton>
              </Grid>
            )
          )}
        </>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      isSideNavBar,
      isSeller,
      showSellButton,
      hasSellerOffers,
      sellUrl,
      isFetching,
      isLteXS
    ]);
    const ref = useRef<ElementRef<"header">>(null);
    return (
      <>
        <div
          style={{
            height: ref?.current?.offsetHeight
          }}
        />
        <Header
          $navigationBarPosition={navigationBarPosition}
          $isSideBarOpen={isOpen}
          ref={ref}
        >
          <AnnouncementBanner />
          <HeaderContainer
            fluidHeader={fluidHeader}
            $navigationBarPosition={navigationBarPosition}
          >
            {isSideBurgerVisible ? (
              <Grid justifyContent="center">
                <BurgerButton onClick={toggleMenu} />
              </Grid>
            ) : (
              <>
                <Grid
                  flexDirection="row"
                  alignItems="center"
                  width="initial"
                  gap="1rem"
                >
                  <LinkWithQuery
                    to={BosonRoutes.Root}
                    style={{ display: "flex" }}
                  >
                    <LogoImg
                      src={logoUrl || logo}
                      alt="logo image"
                      data-testid="logo"
                      style={{ maxWidth: "100%" }}
                      width={logoUrl ? undefined : isLteXS ? 104 : 204}
                      height={
                        logoUrl
                          ? undefined
                          : isLteXS
                          ? logoXXSHeightPx
                          : logoSHeightPx
                      }
                    />
                  </LinkWithQuery>
                  {isSideCrossVisible && (
                    <X
                      color={colors.secondary}
                      onClick={toggleMenu}
                      style={{
                        cursor: "pointer",
                        minWidth: "24px",
                        maxWidth: "24px"
                      }}
                      size="24"
                    />
                  )}
                </Grid>
                <HeaderItems $navigationBarPosition={navigationBarPosition}>
                  {burgerMenuBreakpoint && (
                    <>
                      {CTA}
                      {!isLteXS && <ChainSelector />}
                      {!isXXS && <ConnectButton showOnlyIcon />}
                      <BurgerButton onClick={toggleMenu} />
                    </>
                  )}
                  <HeaderLinks
                    isMobile={burgerMenuBreakpoint}
                    isOpen={isOpen}
                    navigationBarPosition={navigationBarPosition}
                  >
                    {burgerMenuBreakpoint && (
                      <Grid justifyContent="flex-start">
                        <ChainSelector leftAlign={true} />
                        <ConnectButton />
                      </Grid>
                    )}
                  </HeaderLinks>
                  {!burgerMenuBreakpoint && (
                    <>
                      {CTA}
                      <ChainSelector
                        leftAlign={navigationBarPosition === "left"}
                      />
                      <ConnectButton />
                    </>
                  )}
                </HeaderItems>
              </>
            )}
          </HeaderContainer>
          <Portal>
            <AccountDrawer />
          </Portal>
        </Header>
      </>
    );
  }
);
