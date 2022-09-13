import { CaretDown, CaretUp } from "phosphor-react";
import { ReactNode, useReducer } from "react";
import styled from "styled-components";

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

const CollapsibleContent = styled.div``;

interface Props {
  title: ReactNode;
  children: ReactNode;
  isInitiallyOpen?: boolean;
}

export default function Collapse({
  title,
  children,
  isInitiallyOpen = false
}: Props) {
  const [isOpen, toggleCollapsible] = useReducer(
    (state) => !state,
    isInitiallyOpen
  );
  return (
    <>
      <CollapsibleButton onClick={toggleCollapsible}>
        <>
          <Title>{title}</Title>

          <ArrowContainer>
            {isOpen ? <CaretUp /> : <CaretDown />}
          </ArrowContainer>
        </>
      </CollapsibleButton>
      <CollapsibleContent hidden={!isOpen}>{children}</CollapsibleContent>
    </>
  );
}
