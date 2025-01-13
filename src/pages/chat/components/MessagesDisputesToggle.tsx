import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "../../../components/ui/Button";
import { Grid } from "../../../components/ui/Grid";
import { colors } from "../../../lib/styles/colors";

const StyledButton = styled(Button)<{ $isActive: boolean }>`
  width: 100%;
  ${({ $isActive }) =>
    $isActive &&
    css`
      && {
        border-color: transparent;
        background-color: ${colors.greyLight};
      }
    `}
`;

interface Props {
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  initiallySelected?: "left" | "right";
  isLeftActive?: boolean;
}

export function MessagesDisputesToggle({
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  initiallySelected = "left",
  isLeftActive: outerLeftActive
}: Props) {
  const [isLeftActive, setLeftActive] = useState<boolean>(
    initiallySelected === "left"
  );
  useEffect(() => {
    if (outerLeftActive || outerLeftActive === false) {
      setLeftActive(outerLeftActive);
    }
  }, [outerLeftActive]);
  return (
    <Grid gap="1rem">
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
    </Grid>
  );
}
