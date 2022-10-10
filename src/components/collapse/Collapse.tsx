import { CaretDown, CaretUp } from "phosphor-react";
import { Fragment, useCallback, useEffect, useState } from "react";
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

const CollapsibleContent = styled.div`
  width: 100%;
`;

interface CollapseProps {
  children: React.ReactNode;
  isInitiallyOpen?: boolean;
  title: React.ReactNode;
  wrap?: boolean;
  disable?: boolean;
}
export default function Collapse({
  children,
  isInitiallyOpen = false,
  title,
  wrap = false,
  disable = false
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState<boolean>(isInitiallyOpen);

  const toggleCollapsible = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isInitiallyOpen !== isOpen) {
      setIsOpen(isInitiallyOpen);
    }
  }, [isInitiallyOpen]); // eslint-disable-line

  const Wrapper = wrap ? CollapseWrapper : Fragment;
  return (
    <Wrapper>
      <CollapsibleButton onClick={disable ? () => null : toggleCollapsible}>
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
