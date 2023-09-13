import UniswapXBrandMark from "components/logo/UniswapXBrandMark";
import UniswapXRouterLabel from "components/routerLabel/UniswapXRouterLabel";
import {
  SwapMustache,
  SwapMustacheShadow,
  SwapOptInSmallContainer,
  UniswapPopoverContainer,
  UniswapXOptInLargeContainer,
  UniswapXOptInLargeContainerPositioner,
  UniswapXShine
} from "components/swap/styled";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { X } from "phosphor-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "state/hooks";
import { RouterPreference } from "state/routing/types";
import { isClassicTrade } from "state/routing/utils";
import { SwapInfo } from "state/swap/hooks";
import { useRouterPreference, useUserDisabledUniswapX } from "state/user/hooks";
import { updateDisabledUniswapX } from "state/user/reducer";
import styled from "styled-components";
export const Arrow = styled.div`
  width: 8px;
  height: 8px;
  z-index: 9998;

  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    z-index: 9998;

    content: "";
    border: 1px solid ${colors.lightGrey};
    transform: rotate(45deg);
    background: ${colors.lightGrey};
  }

  &.arrow-top {
    bottom: -4px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }

  &.arrow-bottom {
    top: -4px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }

  &.arrow-left {
    right: -4px;

    ::before {
      border-bottom: none;
      border-left: none;
    }
  }

  &.arrow-right {
    left: -4px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`;
export const UniswapXOptIn = (props: {
  swapInfo: SwapInfo;
  isSmall: boolean;
}) => {
  const {
    trade: { trade }
  } = props.swapInfo;
  const userDisabledUniswapX = useUserDisabledUniswapX();
  const isOnClassic = Boolean(
    trade &&
      isClassicTrade(trade) &&
      trade.isUniswapXBetter &&
      !userDisabledUniswapX
  );
  const [hasEverShown, setHasEverShown] = useState(false);

  if (isOnClassic && !hasEverShown) {
    setHasEverShown(true);
  }

  // avoid some work if never needed to show
  if (!hasEverShown) {
    return null;
  }

  return <OptInContents isOnClassic={isOnClassic} {...props} />;
};

const OptInContents = ({
  swapInfo,
  isOnClassic,
  isSmall
}: {
  swapInfo: SwapInfo;
  isOnClassic: boolean;
  isSmall: boolean;
}) => {
  const {
    trade: { trade }
  } = swapInfo;
  const [, setRouterPreference] = useRouterPreference();
  const dispatch = useAppDispatch();
  const [showYoureIn, setShowYoureIn] = useState(false);
  const isVisible = isOnClassic;

  // adding this as we need to mount and then set shouldAnimate = true after it mounts to avoid a flicker on initial mount
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!isVisible || shouldAnimate) return;
    // delay visible animation a bit
    const tm = setTimeout(() => setShouldAnimate(true), 350);
    return () => clearTimeout(tm);
  }, [isVisible, shouldAnimate]);

  const tryItNowElement = (
    <Typography
      color="accentAction"
      $fontSize={14}
      fontWeight="500"
      onClick={() => {
        // slight delay before hiding
        setTimeout(() => {
          setShowYoureIn(true);
          setTimeout(() => {
            setShowYoureIn(false);
          }, 5000);
        }, 200);

        if (!trade) return;

        setRouterPreference(RouterPreference.X);
      }}
      style={{
        cursor: "pointer"
      }}
    >
      Try it now
    </Typography>
  );

  const containerRef = useRef<HTMLDivElement>();

  if (isSmall) {
    return (
      <SwapOptInSmallContainer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={containerRef as any}
        visible={isVisible}
        shouldAnimate={shouldAnimate}
      >
        <SwapMustache>
          <UniswapXShine />
          <SwapMustacheShadow />
          <Grid
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography $fontSize={14} fontWeight={400} lineHeight="20px">
              <>Try gas free swaps with the</>
              <br />
              <UniswapXBrandMark
                fontWeight="bold"
                style={{ transform: `translateY(1px)`, margin: "0 2px" }}
              />{" "}
              <>Beta</>
            </Typography>
            {tryItNowElement}
          </Grid>
        </SwapMustache>
      </SwapOptInSmallContainer>
    );
  }

  return (
    <>
      {/* first popover: intro */}
      <UniswapXOptInPopover shiny visible={isVisible && !showYoureIn}>
        <CloseIcon
          size={18}
          onClick={() => {
            if (!trade) return;

            setRouterPreference(RouterPreference.API);
            dispatch(updateDisabledUniswapX({ disabledUniswapX: true }));
          }}
        />

        <Column>
          <Typography $fontSize={14} fontWeight={400} lineHeight="20px">
            <>Try the</>{" "}
            <UniswapXBrandMark
              fontWeight="bold"
              style={{ transform: `translateY(2px)`, margin: "0 1px" }}
            />{" "}
            <>Beta</>
            <ul
              style={{
                margin: "5px 0 12px 24px",
                lineHeight: "24px",
                padding: 0
              }}
            >
              <li>
                <>Gas free swaps</>
              </li>
              <li>
                <>MEV protection</>
              </li>
              <li>
                <>Better prices and more liquidity</>
              </li>
            </ul>
          </Typography>
        </Column>

        {tryItNowElement}
      </UniswapXOptInPopover>

      {/* second popover: you're in! */}
      <UniswapXOptInPopover visible={showYoureIn}>
        <UniswapXRouterLabel disableTextGradient>
          <Typography $fontSize={14} fontWeight={500} lineHeight="20px">
            <>You&apos;re in!</>
          </Typography>
        </UniswapXRouterLabel>

        <Typography style={{ marginTop: 8 }} $fontSize={14}>
          <>You can turn it off at anytime in settings</>
        </Typography>
      </UniswapXOptInPopover>
    </>
  );
};

const UniswapXOptInPopover = (
  props: PropsWithChildren<{ visible: boolean; shiny?: boolean }>
) => {
  return (
    // positioner ensures no matter the height of the inner content
    // it sits at the same position from the top of the swap area
    <UniswapXOptInLargeContainerPositioner>
      <UniswapXOptInLargeContainer visible={props.visible}>
        <Arrow
          className="arrow-right"
          style={{
            position: "absolute",
            bottom: "50%",
            left: -3.5,
            zIndex: 100
          }}
        />
        <UniswapPopoverContainer>
          {props.shiny && <UniswapXShine style={{ zIndex: 0 }} />}
          {props.children}
        </UniswapPopoverContainer>
      </UniswapXOptInLargeContainer>
    </UniswapXOptInLargeContainerPositioner>
  );
};

const CloseIcon = styled(X)`
  /* color: ${({ theme }) => theme.textTertiary}; */
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;
`;
