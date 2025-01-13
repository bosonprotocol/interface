import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import styled from "styled-components";

const Button = styled.button<{ $backgroundColor: string }>`
  all: unset;
  cursor: pointer;

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0.5rem;
  padding: 0.5rem;
  > div {
    width: 1.25rem;
    height: 2px;
    border-radius: 5px;
    background: ${({ $backgroundColor }) => $backgroundColor};
  }
`;

type BurgerButtonProps = {
  onClick: () => void;
};

export const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick }) => {
  const backgroundColor = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--headerBgColor") || colors.white,
    color1: useCSSVariable("--accent") || colors.greyDark,
    contrastThreshold: 4
  });
  return (
    <Button onClick={onClick} $backgroundColor={backgroundColor}>
      <div />
      <div />
      <div />
    </Button>
  );
};
