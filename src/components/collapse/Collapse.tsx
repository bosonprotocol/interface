import { CaretDown, CaretUp } from "phosphor-react";
import { Fragment, useReducer } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

const CollapsibleButton = styled.button.attrs({ type: "button" })`
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.div`
  flex: 1 1;
`;

const ArrowContainer = styled.div`
  font-size: 1.5rem;
`;
const CollapseWrapper = styled.div`
  background: ${colors.lightGrey};
  padding: 1rem;
`;

const CollapsibleContent = styled.div``;

interface CollapseProps {
  children: React.ReactNode;
  isInitiallyOpen?: boolean;
  title: React.ReactNode;
  wrap?: boolean;
}
export default function Collapse({
  children,
  isInitiallyOpen = false,
  title,
  wrap = false
}: CollapseProps) {
  const [isOpen, toggleCollapsible] = useReducer(
    (state) => !state,
    isInitiallyOpen
  );

  const Wrapper = wrap ? CollapseWrapper : Fragment;
  return (
    <Wrapper>
      <CollapsibleButton onClick={toggleCollapsible}>
        <>
          <Title>{title}</Title>

          <ArrowContainer>
            {isOpen ? <CaretUp /> : <CaretDown />}
          </ArrowContainer>
        </>
      </CollapsibleButton>
      <CollapsibleContent hidden={!isOpen}>{children}</CollapsibleContent>
    </Wrapper>
  );
}
