import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";

const Container = styled.div`
  color: ${colors.primary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 12px;
  border-radius: 6px;
  gap: 4px;
`;

const ToggleTabs = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 30%;
`;

const ToggleTab = styled("button")<{ $isLeft: boolean; $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  border: 1px solid ${colors.primary};
  border-radius: ${(props) =>
    props.$isLeft ? "30px 0 0 30px" : "0 30px 30px 0"};
  background-color: ${(props) =>
    props.$isSelected ? colors.primary : colors.primaryBgColor};
  ${(props) =>
    props.$isSelected
      ? "box-shadow: inset 1px 2px 5px #777;"
      : `box-shadow: 0px 2px 9px -3px ${colors.primary};`}
  padding: 7px;
  font-size: 14px;
  color: ${(props) => (props.$isSelected ? colors.black : colors.primary)};
  width: 200px;
  max-width: 100%;
  text-align: center;
`;

interface Props {
  isTabSellerSelected: boolean;
  setTabSellerSelected: (selected: boolean) => void;
}
export default function Toggle({
  isTabSellerSelected,
  setTabSellerSelected
}: Props) {
  return (
    <Container>
      <ToggleTabs>
        <ToggleTab
          $isLeft
          $isSelected={!isTabSellerSelected}
          onClick={() => setTabSellerSelected(false)}
        >
          Buyer
        </ToggleTab>
        <ToggleTab
          $isLeft={false}
          $isSelected={isTabSellerSelected}
          onClick={() => setTabSellerSelected(true)}
        >
          Seller
        </ToggleTab>
      </ToggleTabs>
    </Container>
  );
}
