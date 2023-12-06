import { ChainId } from "@uniswap/sdk-core";
import { AutoColumn } from "components/ui/column";
import { breakpointNumbers } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { Warning } from "phosphor-react";
import { transparentize } from "polished";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

export const PageWrapper = styled.div`
  padding: 68px 8px;
  max-width: 480px;
  width: 100%;
  @media only screen and (max-width: ${breakpointNumbers.m}px) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    padding-top: 20px;
  }
`;

// Mostly copied from `AppBody` but it was getting too hard to maintain backwards compatibility.
export const SwapWrapper = styled.main<{ chainId?: number }>`
  position: relative;
  background: ${colors.lightGrey};
  border-radius: 24px;
  border: 1px solid ${colors.lightGrey};
  padding: 8px;
  padding-top: 12px;
  box-shadow: ${({ chainId }) =>
    !!chainId && chainId === ChainId.BNB && "0px 40px 120px 0px #f0b90b29"};
  // TODO: z-index: zIndex.default
  transition: transform 250ms ease;

  &:hover {
    border: 1px solid ${colors.lightGrey};
  }
`;

export const UniswapPopoverContainer = styled.div`
  padding: 18px;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 16px;
  word-break: break-word;
  background: ${colors.lightGrey};
  border-radius: 20px;
  border: 1px solid ${colors.lightGrey};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
  position: relative;
  overflow: hidden;
`;

const springDownKeyframes = `@keyframes spring-down {
  0% { transform: translateY(-80px); }
  25% { transform: translateY(4px); }
  50% { transform: translateY(-1px); }
  75% { transform: translateY(0px); }
  100% { transform: translateY(0px); }
}`;

const backUpKeyframes = `@keyframes back-up {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-80px); }
}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UniswapXShine = (props: Record<string, any>) => {
  return (
    <UniswapXShineInner {...props} style={{ opacity: 0.05, ...props.style }} />
  );
};

const UniswapXShineInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    130deg,
    transparent 20%,
    ${colors.blue},
    transparent 80%
  );
  opacity: 0.15;
`;

// overflow hidden to hide the SwapMustacheShadow
export const SwapOptInSmallContainer = styled.div<{
  visible: boolean;
  shouldAnimate: boolean;
}>`
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  overflow: hidden;
  margin-top: -14px;
  transform: translateY(${({ visible }) => (visible ? 0 : -80)}px);
  transition: all ease 400ms;
  animation: ${({ visible, shouldAnimate }) =>
    !shouldAnimate
      ? ""
      : visible
      ? `spring-down 900ms ease forwards`
      : "back-up 200ms ease forwards"};

  ${springDownKeyframes}
  ${backUpKeyframes}
`;

export const UniswapXOptInLargeContainerPositioner = styled.div`
  position: absolute;
  top: 211px;
  right: ${-320 - 15}px;
  width: 320px;
  align-items: center;
  min-height: 170px;
  display: flex;
  pointer-events: none;
`;

export const UniswapXOptInLargeContainer = styled.div<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => `translateY(${visible ? 0 : -6}px)`};
  transition: all ease-in 300ms;
  transition-delay: ${({ visible }) => (visible ? "350ms" : "0")};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
`;

export const SwapMustache = styled.main`
  position: relative;
  background: ${colors.lightGrey};
  border-radius: 16px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid ${colors.lightGrey};
  border-top-width: 0;
  padding: 18px;
  padding-top: calc(12px + 18px);
  z-index: 0;
  transition: transform 250ms ease;
`;

export const SwapMustacheShadow = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16px;
  height: 100%;
  width: 100%;
  transform: translateY(-100%);
  box-shadow: 0 0 20px 20px ${({ theme }) => theme.backgroundBackdrop};
  background: red;
`;

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  border-radius: 12px;
  height: 40px;
  width: 40px;
  position: relative;
  margin-top: -18px;
  margin-bottom: -18px;
  margin-left: auto;
  margin-right: auto;
  background-color: ${colors.lightGrey};
  border: 4px solid;
  border-color: ${colors.white};

  z-index: 2;
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.accentFailure)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.accentFailure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`;

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.accentFailure)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`;

export function SwapCallbackError({ error }: { error: ReactNode }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <Warning size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p style={{ wordBreak: "break-word" }}>{error}</p>
    </SwapCallbackErrorInner>
  );
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: ${({ theme }) =>
    transparentize(0.95, theme.deprecated_primary3)};
  color: ${colors.secondary};
  padding: 12px;
  border-radius: 12px;
  margin-top: 8px;
`;
