import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "./Grid";

const LoadingPlaceholder = styled.div<{ size: number }>`
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem;
  border: 5px solid ${colors.secondary};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface ILoading {
  size?: number;
  style?: React.CSSProperties;
  [x: string]: unknown;
}

const Loading: React.FC<ILoading> = ({ style = {}, size = 5, ...props }) => {
  return (
    <Grid justifyContent="center" padding="5rem">
      <LoadingPlaceholder style={style} size={size} {...props} />
    </Grid>
  );
};

export default Loading;
