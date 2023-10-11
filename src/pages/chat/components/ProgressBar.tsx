import { darken } from "polished";
import React, { CSSProperties } from "react";
import styled, { css } from "styled-components";

import { colors } from "../../../lib/styles/colors";

const Container = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;

  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`;

const commonStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1px solid ${colors.lightGrey};
  padding: 0.5rem;
  width: 100%;
`;

const Back = styled.div<{ $backgroundColor: CSSProperties["background"] }>`
  ${commonStyles};
  width: 100%;
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${colors.white};
`;

const Front = styled.div<{ $progress: number }>`
  ${commonStyles};
  color: ${colors.black};
  background: ${darken(0.05, colors.lightGrey)};
  clip-path: inset(0 0 0 ${({ $progress }) => $progress}%);
  transition: clip-path 1s linear;
`;

interface ProgressBarProps {
  progress: number;
  text: string;
  threshold?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  text,
  threshold = 15
}) => {
  const background = progress < threshold ? colors.orange : colors.black;
  return (
    <Container>
      <Back $backgroundColor={background}>{text}</Back>
      <Front $progress={progress}>{text}</Front>
      <Front $progress={progress} style={{ position: "relative" }}>
        {text}
      </Front>
    </Container>
  );
};

export default ProgressBar;
