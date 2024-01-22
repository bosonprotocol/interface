import styled from "styled-components";

const gapValues = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "24px",
  xl: "32px"
};
type Gap = keyof typeof gapValues;
export const Column = styled.div<{
  gap?: Gap;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${({ gap }) => gap && gapValues[gap]};
`;
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`;

export const AutoColumn = styled.div<{
  $gap?: Gap | string;
  $justify?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "space-between";
  $grow?: true;
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ $gap }) => $gap};
  justify-items: ${({ $justify }) => $justify && $justify};
  flex-grow: ${({ $grow }) => $grow && 1};
`;

export default Column;
