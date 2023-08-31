import { CaretDoubleDown } from "phosphor-react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";

const ExpandIcon = styled(CaretDoubleDown)<{ $expanded: boolean }>`
  transform: ${({ $expanded }) =>
    $expanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 250ms;
`;

const ToggleButton = styled(Grid)`
  border-radius: 12px;
  padding: 4px 8px 4px 12px;
  height: 100%;
  width: fit-content;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const Wrapper = styled.div<{ numItems: number; isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: ${({ numItems, isExpanded }) =>
    isExpanded ? numItems * 68 + "px" : 0};
  transition: height 250ms ease-in-out;
  overflow: hidden;
  align-items: center;
`;

// TODO(WEB-1982): Replace this component to use `components/Expand` under the hood
type ExpandoRowProps = PropsWithChildren<{
  title?: string;
  numItems: number;
  isExpanded: boolean;
  toggle: () => void;
}>;
export function ExpandoRow({
  title = `Hidden`,
  numItems,
  isExpanded,
  toggle,
  children
}: ExpandoRowProps) {
  if (numItems === 0) return null;
  return (
    <>
      <Grid alignItems="center" justifyContent="space-between" padding="16px">
        <Typography>{`${title} (${numItems})`}</Typography>
        <ToggleButton onClick={toggle}>
          <Typography color="textSecondary">
            {isExpanded ? `Hide` : `Show`}
          </Typography>
          <ExpandIcon $expanded={isExpanded} />
        </ToggleButton>
      </Grid>
      <Wrapper numItems={numItems} isExpanded={isExpanded}>
        {children}
      </Wrapper>
    </>
  );
}
