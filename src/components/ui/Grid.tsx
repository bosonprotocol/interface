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
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexDirection?: FlexDirection;
  padding?: string;
}

const Container = styled.div<IGrid>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-directions: ${({ flexDirection }) => flexDirection || "center"};
  padding: ${({ padding }) => padding || "0"};
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
