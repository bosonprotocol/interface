import { Grid } from "components/ui/Grid";
import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import { Icon } from "phosphor-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import styled, { css } from "styled-components";
import useResizeObserver from "use-resize-observer";

const IconHoverText = styled.span`
  position: absolute;
  top: 28px;
  border-radius: 8px;
  transform: translateX(-50%);
  opacity: 0;
  font-size: 0.75rem;
  padding: 5px;
  left: 10px;
`;

const getWidthTransition = () => `width ease-in-out 125ms`;

const IconStyles = css<{ hideHorizontal?: boolean; $color: string }>`
  color: ${({ $color }) => $color};
  background-color: var(--buttonBgColor);
  transition: ${getWidthTransition};
  border-radius: 12px;
  display: flex;
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 32px;
  width: ${({ hideHorizontal }) => (hideHorizontal ? "0px" : "32px")};
  &:hover {
    background-color: color-mix(in srgb, var(--buttonBgColor) 90%, black);
    transition:
      125ms background-color ease-in,
      ${getWidthTransition};

    ${IconHoverText} {
      opacity: 1;
    }
  }
  &:active {
    background-color: var(--buttonBgColor);
    transition:
      background-color 125ms linear,
      ${getWidthTransition};
  }
`;

const IconBlockLink = styled.a<{ hideHorizontal?: boolean; $color: string }>`
  ${IconStyles};
`;

const IconBlockButton = styled.button<{
  hideHorizontal?: boolean;
  $color: string;
}>`
  ${IconStyles};
  border: none;
  outline: none;
`;

const IconWrapper = styled.span`
  width: 16px;
  height: 16px;
  margin: auto;
  display: flex;
`;
interface BaseProps {
  Icon: Icon;
  hideHorizontal?: boolean;
  children?: React.ReactNode;
}

interface IconLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    BaseProps {}
interface IconButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    BaseProps {}

type IconBlockProps = React.ComponentPropsWithoutRef<"a" | "button">;

const IconBlock = forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  IconBlockProps & { color: string }
>(function IconBlock(props, ref) {
  const $color = props.color;
  if ("href" in props) {
    return (
      <IconBlockLink
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        $color={$color}
        {...props}
      />
    );
  }
  // ignoring 'button' 'type' conflict between React and styled-components
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <IconBlockButton ref={ref} $color={$color} {...props} />;
});

type IconWithTextProps = (IconButtonProps | IconLinkProps) & {
  text: string;
  onConfirm?: () => void;
  onShowConfirm?: (on: boolean) => void;
  dismissOnHoverOut?: boolean;
  dismissOnHoverDurationMs?: number;
};

const TextWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  min-width: min-content;
`;

const TextHide = styled.div`
  overflow: hidden;
  transition:
    width ease-in-out 125ms,
    max-width ease-in-out 125ms;
`;

/**
 * Allows for hiding and showing some text next to an IconButton
 * Note that for width transitions to animate in CSS we need to always specify the width (no auto)
 * so there's resize observing and measuring going on here.
 */
export const IconWithConfirmTextButton = ({
  Icon,
  text,
  onConfirm,
  onShowConfirm,
  onClick,
  dismissOnHoverOut,
  dismissOnHoverDurationMs = 500,
  ...rest
}: IconWithTextProps) => {
  const [showText, setShowTextWithoutCallback] = useState(false);
  const [frame, setFrame] = useState<HTMLElement | null>();
  const frameObserver = useResizeObserver<HTMLElement>();
  const hiddenObserver = useResizeObserver<HTMLElement>();

  const setShowText = useCallback(
    (val: boolean) => {
      setShowTextWithoutCallback(val);
      onShowConfirm?.(val);
    },
    [onShowConfirm]
  );

  const dimensionsRef = useRef({
    frame: 0,
    innerText: 0
  });
  const dimensions = (() => {
    // once opened, we avoid updating it to prevent constant resize loop
    if (!showText) {
      dimensionsRef.current = {
        frame: frameObserver.width || 0,
        innerText: hiddenObserver.width || 0
      };
    }
    return dimensionsRef.current;
  })();

  // keyboard action to cancel
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!showText || !frame) return;

    const closeAndPrevent = (e: Event) => {
      setShowText(false);
      e.preventDefault();
      e.stopPropagation();
    };

    const clickHandler = (e: MouseEvent) => {
      const { target } = e;
      const shouldClose =
        !(target instanceof HTMLElement) || !frame.contains(target);
      if (shouldClose) {
        closeAndPrevent(e);
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAndPrevent(e);
      }
    };

    window.addEventListener("click", clickHandler, { capture: true });
    window.addEventListener("keydown", keyHandler, { capture: true });

    return () => {
      window.removeEventListener("click", clickHandler, { capture: true });
      window.removeEventListener("keydown", keyHandler, { capture: true });
    };
  }, [frame, setShowText, showText]);

  const xPad = showText ? 8 : 0;
  const width = showText ? dimensions.frame + dimensions.innerText + xPad : 32;
  const mouseLeaveTimeout = useRef<NodeJS.Timeout>();
  const color = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--buttonBgColor") || colors.primary,
    color1: useCSSVariable("--textColor") || colors.black
  });
  return (
    <IconBlock
      ref={(node) => {
        frameObserver.ref(node);
        setFrame(node);
      }}
      {...rest}
      style={{
        width,
        paddingLeft: xPad,
        paddingRight: xPad
      }}
      color={color}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore MouseEvent is valid, its a subset of the two mouse events,
      // even manually typing this all out more specifically it still gets mad about any casting for some reason
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (showText) {
          onConfirm?.();
        } else {
          onClick?.(e);
          setShowText(!showText);
        }
      }}
      {...(dismissOnHoverOut && {
        onMouseLeave() {
          mouseLeaveTimeout.current = setTimeout(() => {
            setShowText(false);
          }, dismissOnHoverDurationMs);
        },
        onMouseEnter() {
          if (mouseLeaveTimeout.current) {
            clearTimeout(mouseLeaveTimeout.current);
          }
        }
      })}
    >
      <Grid style={{ height: "100%" }} gap="2px">
        <IconWrapper>
          <Icon strokeWidth={1.5} size={16} />
        </IconWrapper>

        {/* this outer div is so we can cut it off but keep the inner text width full-width so we can measure it */}
        <TextHide
          style={{
            maxWidth: showText ? dimensions.innerText : 0,
            width: showText ? dimensions.innerText : 0,
            // this negative transform offsets for the shift it does due to being 0 width
            transform: showText ? undefined : `translateX(-8px)`,
            minWidth: showText ? dimensions.innerText : 0
          }}
        >
          <TextWrapper ref={hiddenObserver.ref}>{text}</TextWrapper>
        </TextHide>
      </Grid>
    </IconBlock>
  );
};
