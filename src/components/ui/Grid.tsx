import styled from "styled-components";

type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around";
type AlignItems = "flex-start" | "center" | "flex-end";
type FlexDirection = "row" | "column";
interface IGrid {
  alignItems?: AlignItems;
  flexBasis?: string;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  padding?: string;
}

const Container = styled.div<IGrid>`
  display: flex;
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-basis: ${({ flexBasis }) => flexBasis || "auto"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};
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
