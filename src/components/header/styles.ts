import { colors } from "lib/styles/colors";
import { css, keyframes } from "styled-components";

export const ClickableStyle = css`
  text-decoration: none;
  cursor: pointer;
  transition-duration: 125ms;

  :hover {
    opacity: 0.6;
  }
  :active {
    opacity: 0.4;
  }
`;
export const ScrollBarStyles = css<{ $isHorizontalScroll?: boolean }>`
  // Firefox scrollbar styling
  scrollbar-width: thin;
  scrollbar-color: ${colors.lightGrey} transparent;
  height: 100%;

  // safari and chrome scrollbar styling
  ::-webkit-scrollbar {
    background: transparent;

    // Set height for horizontal scrolls
    ${({ $isHorizontalScroll }) => {
      return $isHorizontalScroll
        ? css`
            height: 4px;
            overflow-x: scroll;
          `
        : css`
            width: 4px;
            overflow-y: scroll;
          `;
    }}
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.lightGrey};
    border-radius: 8px;
  }
`;
export const EllipsisStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const flexColumnNoWrap = css`
  display: flex;
  flex-flow: column nowrap;
`;

export const flexRowNoWrap = css`
  display: flex;
  flex-flow: row nowrap;
`;

export enum TRANSITION_DURATIONS {
  slow = 500,
  medium = 250,
  fast = 125
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const textFadeIn = css`
  animation: ${fadeIn} 125ms ease-in;
`;
