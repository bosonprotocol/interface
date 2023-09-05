import { colors } from "lib/styles/colors";
import styled, { css, keyframes } from "styled-components";

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmerMixin = css`
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  background: linear-gradient(
    to left,
    ${colors.darkGrey} 25%,
    ${colors.lightGrey} 50%,
    ${colors.darkGrey} 75%
  );
  background-size: 400%;
  will-change: background-position;
`;

export const LoadingRows = styled.div`
  display: grid;

  & > div {
    ${shimmerMixin}
    border-radius: 12px;
    height: 2.4em;
  }
`;

export const loadingOpacityMixin = css<{ $loading: boolean }>`
  filter: ${({ $loading }) => ($loading ? "grayscale(1)" : "none")};
  opacity: ${({ $loading }) => ($loading ? "0.4" : "1")};
  transition: opacity 0.2s ease-in-out;
`;

export const LoadingOpacityContainer = styled.div<{ $loading: boolean }>`
  ${loadingOpacityMixin}
`;
