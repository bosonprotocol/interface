import styled, { keyframes } from "styled-components";

import { colors } from "../../lib/styles/colors";
const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const LoadingBubble = styled.div<{
  height?: string;
  width?: string;
  round?: boolean;
  delay?: string;
  margin?: string;
}>`
  border-radius: 12px;
  border-radius: ${({ round }) => (round ? "50%" : "12px")};
  ${({ margin }) => margin && `margin: ${margin}`};
  height: ${({ height }) => height ?? "24px"};
  width: 50%;
  width: ${({ width }) => width ?? "50%"};
  animation: ${loadingAnimation} 1.5s infinite;
  ${({ delay }) => delay && `animation-delay: ${delay};`}
  animation-fill-mode: both;
  background: linear-gradient(
    to left,
    ${colors.darkGrey} 25%,
    ${colors.lightGrey} 50%,
    ${colors.darkGrey} 75%
  );
  will-change: background-position;
  background-size: 400%;
`;
