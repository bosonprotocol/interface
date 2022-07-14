import styled from "styled-components";

type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "stretch";
type AlignItems = "flex-start" | "center" | "flex-end";
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export interface IGrid {
  alignItems?: AlignItems;
  flexBasis?: string;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  flexGrow?: string;
  flexWrap?: string;
  gap?: string;
  flex?: string;
  padding?: string;
  rowGap?: string;
  columnGap?: string;
}

const Container = styled.div<IGrid>`
  width: 100%;
  display: flex;
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-basis: ${({ flexBasis }) => flexBasis || "auto"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  flex-grow: ${({ flexGrow }) => flexGrow || "0"};
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};

  ${({ flexWrap }) => (flexWrap ? `flex-wrap:${flexWrap};` : "")}
  ${({ rowGap }) => (rowGap ? `row-gap:${rowGap};` : "")}
  ${({ columnGap }) => (columnGap ? `column-gap:${columnGap};` : "")}
  ${({ gap }) => (gap ? `gap:${gap};` : "")}
  ${({ flex }) => (flex ? `> * { flex: ${flex}; }` : "")}
  ${({ padding }) => (padding ? `padding:${padding};` : "")}
`;

const Grid: React.FC<
  {
    children: React.ReactNode;
  } & IGrid &
    React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default Grid;
