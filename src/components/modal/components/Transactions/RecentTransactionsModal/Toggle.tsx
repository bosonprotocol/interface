import { useState } from "react";
import styled, { css } from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import Button from "../../../../ui/Button";
import { Grid } from "../../../../ui/Grid";

const StyledGrid = styled(Grid)`
  background-color: ${colors.greyLight};
`;

const StyledButton = styled(Button)<{ $isActive: boolean }>`
  margin: 0.5rem;
  width: 100%;
  ${({ $isActive }) =>
    !$isActive &&
    css`
      border-color: transparent;
      background-color: ${colors.greyLight};
    `}
`;

interface Props {
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  initiallySelected?: "left" | "right";
}

export default function Toggle({
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  initiallySelected = "left"
}: Props) {
  const [isLeftActive, setLeftActive] = useState<boolean>(
    initiallySelected === "left"
  );
  return (
    <StyledGrid>
      <StyledButton
        themeVal="white"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          setLeftActive(true);
          onLeftButtonClick(e);
        }}
        $isActive={isLeftActive}
      >
        {leftButtonText}
      </StyledButton>
      <StyledButton
        themeVal="white"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          setLeftActive(false);
          onRightButtonClick(e);
        }}
        $isActive={!isLeftActive}
      >
        {rightButtonText}
      </StyledButton>
    </StyledGrid>
  );
}
