import React, { CSSProperties, forwardRef } from "react";
import styled from "styled-components";

type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-evently"
  | "space-between"
  | "space-around"
  | "stretch";
type AlignItems = "flex-start" | "center" | "flex-end" | "baseline" | "stretch";
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type AlignSelf =
  | "auto"
  | "normal"
  | "self-start"
  | "self-end"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline"
  | "first baseline"
  | "last baseline"
  | "stretch"
  | "safe"
  | "unsafe";
type JustifySelf =
  | "auto"
  | "normal"
  | "start"
  | "end"
  | "flex-start"
  | "flex-end"
  | "self-start"
  | "self-end"
  | "center"
  | "left"
  | "right"
  | "baseline"
  | "first baseline"
  | "last baseline"
  | "stretch"
  | "safe"
  | "unsafe";
export interface IGrid {
  $width?: CSSProperties["width"];
  $height?: CSSProperties["height"];
  alignItems?: AlignItems;
  flexBasis?: string;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  flexGrow?: string;
  flexShrink?: string;
  flexWrap?: string;
  gap?: string;
  flex?: CSSProperties["flex"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  marginTop?: CSSProperties["marginTop"];
  marginRight?: CSSProperties["marginRight"];
  marginBottom?: CSSProperties["marginBottom"];
  marginLeft?: CSSProperties["marginLeft"];
  rowGap?: string;
  columnGap?: string;
  alignSelf?: AlignSelf;
  justifySelf?: JustifySelf;
}

const Container = styled.div<IGrid>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "initial"};
  display: flex;
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-basis: ${({ flexBasis }) => flexBasis || "auto"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  flex-grow: ${({ flexGrow }) => flexGrow || "initial"};
  flex-shrink: ${({ flexShrink }) => flexShrink || "initial"};
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};

  ${({ flexWrap }) => (flexWrap ? `flex-wrap:${flexWrap};` : "")}
  ${({ rowGap }) => (rowGap ? `row-gap:${rowGap};` : "")}
  ${({ columnGap }) => (columnGap ? `column-gap:${columnGap};` : "")}
  ${({ gap }) => (gap ? `gap:${gap};` : "")}
  ${({ flex }) => (flex ? `> * { flex: ${flex}; }` : "")}
  ${({ padding }) => (padding ? `padding:${padding};` : "")}
  ${({ margin }) => (margin ? `margin:${margin};` : "")}
  ${({ marginTop }) => (marginTop ? `margin-top:${marginTop};` : "")}
  ${({ marginRight }) => (marginRight ? `margin-right:${marginRight};` : "")}
  ${({ marginBottom }) =>
    marginBottom ? `margin-bottom:${marginBottom};` : ""}
  ${({ marginLeft }) => (marginLeft ? `margin-left:${marginLeft};` : "")}
  ${({ alignSelf }) => (alignSelf ? `align-self:${alignSelf};` : "")}
  ${({ justifySelf }) => (justifySelf ? `justify-self:${justifySelf};` : "")}
`;
type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  src?: string;
  // [x: string]: unknown;
} & IGrid &
  React.HTMLAttributes<HTMLDivElement>;

const Grid = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => {
    return (
      <Container {...props} ref={ref}>
        {children}
      </Container>
    );
  }
);

export default Grid;
