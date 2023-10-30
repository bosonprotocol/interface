import { CaretDown, CaretUp } from "phosphor-react";
import { ReactNode, useReducer } from "react";
import styled from "styled-components";

import Grid from "../ui/Grid";

const ArrowContainer = styled(Grid)``;

interface Props {
  trigger: JSX.Element;
  children: ReactNode;
  isInitiallyOpen?: boolean;
}

export default function CollapseWithTrigger({
  trigger: Trigger,
  children,
  isInitiallyOpen = false
}: Props) {
  const [isOpen, toggleCollapsible] = useReducer(
    (state) => !state,
    isInitiallyOpen
  );
  return (
    <>
      <Grid flexDirection="row" gap="0.5rem">
        <div onClick={toggleCollapsible} style={{ cursor: "pointer" }}>
          {Trigger}
        </div>
        <ArrowContainer>
          {isOpen ? (
            <CaretUp
              onClick={toggleCollapsible}
              style={{ cursor: "pointer" }}
              size={18}
            />
          ) : (
            <CaretDown
              onClick={toggleCollapsible}
              style={{ cursor: "pointer" }}
              size={18}
            />
          )}
        </ArrowContainer>
      </Grid>
      <Grid hidden={!isOpen} style={{ display: isOpen ? "flex" : "none" }}>
        {children}
      </Grid>
    </>
  );
}
