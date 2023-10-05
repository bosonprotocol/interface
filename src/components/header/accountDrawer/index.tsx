import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { colors } from "lib/styles/colors";
import { CaretDoubleRight } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import styled from "styled-components";

import { breakpointNumbers } from "../../../lib/styles/breakpoint";
import { zIndex } from "../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import useDisableScrolling from "../../../lib/utils/hooks/useDisableScrolling";
import { useWindowSize } from "../../../lib/utils/hooks/useWindowSize";
import { ClickableStyle, ScrollBarStyles } from "../styles";
import DefaultMenu from "./DefaultMenu";

const DRAWER_WIDTH_XL = "390px";
const DRAWER_WIDTH = "330px";
const DRAWER_MARGIN = "0px";
const DRAWER_OFFSET = "10px";
const DRAWER_TOP_MARGIN_MOBILE_WEB = "72px";

const accountDrawerOpenAtom = atom(false);

export function useToggleAccountDrawer() {
  const updateAccountDrawerOpen = useUpdateAtom(accountDrawerOpenAtom);
  return useCallback(() => {
    updateAccountDrawerOpen((open) => !open);
  }, [updateAccountDrawerOpen]);
}

export function useCloseAccountDrawer() {
  const updateAccountDrawerOpen = useUpdateAtom(accountDrawerOpenAtom);
  return useCallback(
    () => updateAccountDrawerOpen(false),
    [updateAccountDrawerOpen]
  );
}

export function useAccountDrawer(): [boolean, () => void] {
  const accountDrawerOpen = useAtomValue(accountDrawerOpenAtom);
  return [accountDrawerOpen, useToggleAccountDrawer()];
}

export function useOpenAccountDrawer(): [boolean, () => void] {
  const accountDrawerOpen = useAtomValue(accountDrawerOpenAtom);
  const updateAccountDrawerOpen = useUpdateAtom(accountDrawerOpenAtom);
  return [
    accountDrawerOpen,
    useCallback(() => updateAccountDrawerOpen(true), [updateAccountDrawerOpen])
  ];
}

const ScrimBackground = styled.div<{ open: boolean }>`
  z-index: ${zIndex.Modal - 1};
  overflow: hidden;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: ${colors.darkGrey};

  opacity: 0;
  pointer-events: none;
  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    opacity: ${({ open }) => (open ? 1 : 0)};
    pointer-events: ${({ open }) => (open ? "auto" : "none")};
    transition: opacity 250ms ease-in-out;
  }
`;
export const Scrim = ({
  onClick,
  open,
  testId
}: {
  onClick: () => void;
  open: boolean;
  testId?: string;
}) => {
  const { width } = useWindowSize();

  useEffect(() => {
    if (width && width < breakpointNumbers.s && open)
      document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [open, width]);

  return <ScrimBackground data-testid={testId} onClick={onClick} open={open} />;
};

const AccountDrawerScrollWrapper = styled.div`
  overflow: hidden;
  &:hover {
    overflow-y: auto;
  }

  ${ScrollBarStyles}

  scrollbar-gutter: stable;
  overscroll-behavior: contain;
  border-radius: 12px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 2 * ${DRAWER_MARGIN});
  overflow: hidden;
  position: fixed;
  right: ${DRAWER_MARGIN};
  top: ${DRAWER_MARGIN};

  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    top: 100vh;
    left: 0;
    right: 0;
    width: 100%;
    overflow: visible;
  }
  z-index: ${zIndex.ConnectWallet};
`;

const AccountDrawerWrapper = styled.div<{ open: boolean }>`
  margin-right: ${({ open }) => (open ? 0 : "-" + DRAWER_WIDTH)};
  height: 100%;
  overflow: hidden;

  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    z-index: ${zIndex.Modal};
    position: absolute;
    margin-right: 0;
    top: ${({ open }) =>
      open ? `calc(-1 * (100% - ${DRAWER_TOP_MARGIN_MOBILE_WEB}))` : 0};

    width: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    box-shadow: unset;
    transition: top 250ms;
  }

  @media screen and (min-width: 1440px) {
    margin-right: ${({ open }) => (open ? 0 : `-${DRAWER_WIDTH_XL}`)};
    width: ${DRAWER_WIDTH_XL};
  }

  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  width: ${DRAWER_WIDTH};
  font-size: 16px;
  background-color: var(--primaryBgColor);

  border: 1px solid var(--primaryBgColor);

  box-shadow: 12px 16px 24px rgba(0, 0, 0, 0.24),
    12px 8px 12px rgba(0, 0, 0, 0.24), 4px 4px 8px rgba(0, 0, 0, 0.32);
  transition: margin-right 250ms;
`;

const CloseIcon = styled(CaretDoubleRight).attrs({ size: 24 })`
  stroke: var(--primaryBgColor);
`;

const CloseDrawer = styled.div`
  ${ClickableStyle}
  opacity: 0.6;
  z-index: -1;
  background-color: color-mix(in srgb, var(--primaryBgColor) 90%, black);
  cursor: pointer;
  height: 100%;
  margin: 0 -8px 0 0;
  // When the drawer is not hovered, the icon should be 18px from the edge of the sidebar.
  padding: 24px calc(18px + ${DRAWER_OFFSET}) 24px 14px;
  border-radius: 20px 0 0 20px;
  transition: 250ms ease background-color, 250ms ease margin;
  &:hover {
    margin: 0 -16px 0 0;
    filter: brightness(0.85);
  }
  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    display: none;
  }
`;

export function AccountDrawer() {
  const { isLteS: isMobile } = useBreakpoints();
  const [walletDrawerOpen, toggleWalletDrawer] = useAccountDrawer();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!walletDrawerOpen) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [walletDrawerOpen]);

  // close on escape keypress
  useEffect(() => {
    const escapeKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && walletDrawerOpen) {
        event.preventDefault();
        toggleWalletDrawer();
      }
    };

    document.addEventListener("keydown", escapeKeyDownHandler);

    return () => {
      document.removeEventListener("keydown", escapeKeyDownHandler);
    };
  }, [walletDrawerOpen, toggleWalletDrawer]);

  // useStates for detecting swipe gestures
  const [yPosition, setYPosition] = useState(0);
  const [dragStartTop, setDragStartTop] = useState(true);
  useDisableScrolling(walletDrawerOpen);

  // useGesture hook for detecting swipe gestures
  const bind = useGesture({
    // if the drawer is open and the user is dragging down, close the drawer
    onDrag: (state) => {
      // if the user is dragging up, set dragStartTop to false
      if (state.movement[1] < 0) {
        setDragStartTop(false);
        if (scrollRef.current) {
          scrollRef.current.style.overflowY = "auto";
        }
      } else if (
        (state.movement[1] > 300 ||
          (state.velocity > 3 && state.direction[1] > 0)) &&
        walletDrawerOpen &&
        dragStartTop
      ) {
        toggleWalletDrawer();
      } else if (walletDrawerOpen && dragStartTop && state.movement[1] > 0) {
        setYPosition(state.movement[1]);
        if (scrollRef.current) {
          scrollRef.current.style.overflowY = "hidden";
        }
      }
    },
    // reset the yPosition when the user stops dragging
    onDragEnd: () => {
      setYPosition(0);
      if (scrollRef.current) {
        scrollRef.current.style.overflowY = "auto";
      }
    },
    // set dragStartTop to true if the user starts dragging from the top of the drawer
    onDragStart: () => {
      if (!scrollRef.current?.scrollTop || scrollRef.current?.scrollTop < 30) {
        setDragStartTop(true);
      } else {
        setDragStartTop(false);
        if (scrollRef.current) {
          scrollRef.current.style.overflowY = "auto";
        }
      }
    }
  });

  return (
    <Container>
      {walletDrawerOpen && (
        <CloseDrawer
          onClick={toggleWalletDrawer}
          data-testid="close-account-drawer"
        >
          <CloseIcon />
        </CloseDrawer>
      )}
      <Scrim onClick={toggleWalletDrawer} open={walletDrawerOpen} />
      <AccountDrawerWrapper
        open={walletDrawerOpen}
        {...(isMobile
          ? {
              ...bind(),
              style: { transform: `translateY(${yPosition}px)` }
            }
          : {})}
      >
        {/* id used for child InfiniteScrolls to reference when it has reached the bottom of the component */}
        <AccountDrawerScrollWrapper
          ref={scrollRef}
          id="wallet-dropdown-scroll-wrapper"
        >
          <DefaultMenu />
        </AccountDrawerScrollWrapper>
      </AccountDrawerWrapper>
    </Container>
  );
}
