import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";

const Container = styled.div`
  color: ${colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.75rem;
  border-radius: 0.375rem;
  gap: 0.25rem;
`;

const ToggleTabs = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 30%;
`;

const ToggleTab = styled("button")<{
  $isSelected: boolean;
}>`
  all: unset;
  cursor: pointer;
  border: 0.0625rem solid ${colors.bosonSkyBlue};
  :first-child {
    border-radius: 1.875rem 0 0 1.875rem;
  }
  :last-child {
    border-radius: 0 1.875rem 1.875rem 0;
  }
  background-color: ${(props) =>
    props.$isSelected ? colors.bosonSkyBlue : colors.navy};
  ${(props) =>
    props.$isSelected
      ? "box-shadow: inset 0.0625rem 0.125rem 0.3125rem #777;"
      : `box-shadow: 0 0.125rem 0.5625rem -0.1875rem ${colors.bosonSkyBlue};`}
  padding: 0.4375rem;
  font-size: 0.875rem;
  color: ${(props) => (props.$isSelected ? colors.black : colors.bosonSkyBlue)};
  width: 12.5rem;
  max-width: 100%;
  text-align: center;
`;

interface Props {
  isTabSellerSelected: boolean;
  setTabSellerSelected: (selected: boolean) => void;
  $containerStyles?: React.CSSProperties;
  $toggleTabStyles?: React.CSSProperties;
}
export default function Toggle({
  isTabSellerSelected,
  setTabSellerSelected,
  $containerStyles,
  $toggleTabStyles
}: Props) {
  return (
    <Container style={$containerStyles}>
      <ToggleTabs>
        <ToggleTab
          style={$toggleTabStyles}
          $isSelected={!isTabSellerSelected}
          onClick={() => setTabSellerSelected(false)}
        >
          Buyer
        </ToggleTab>
        <ToggleTab
          style={$toggleTabStyles}
          $isSelected={isTabSellerSelected}
          onClick={() => setTabSellerSelected(true)}
        >
          Seller
        </ToggleTab>
      </ToggleTabs>
    </Container>
  );
}
