import React, { forwardRef } from "react";
import styled from "styled-components";

import { IGrid } from "./Grid";

interface WrapperProps extends IGrid {
  $fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  background?: string;
  cursor?: string;
  letterSpacing?: string;
  textAlign?: string;
  opacity?: string;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  ${({ alignItems }) => alignItems && `align-items: ${alignItems}`};
  ${({ flexBasis }) => flexBasis && `flex-basis: ${flexBasis}`};
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection}`};
  ${({ flexGrow }) => flexGrow && `flex-grow: ${flexGrow}`};
  ${({ justifyContent }) =>
    justifyContent && `justify-content: ${justifyContent}`};
  ${({ flexWrap }) => (flexWrap ? `flex-wrap:${flexWrap};` : "")}
  ${({ rowGap }) => (rowGap ? `row-gap:${rowGap};` : "")}
  ${({ columnGap }) => (columnGap ? `column-gap:${columnGap};` : "")}
  ${({ gap }) => (gap ? `gap:${gap};` : "")}
  ${({ flex }) => (flex ? `> * { flex: ${flex}; }` : "")}
  ${({ padding }) => (padding ? `padding:${padding};` : "")}
  ${({ margin }) => (margin ? `margin:${margin};` : "")}


  ${({ $fontSize }) => ($fontSize ? `font-size:${$fontSize};` : "")}
  ${({ fontWeight }) => (fontWeight ? `font-weight:${fontWeight};` : "")}
  ${({ lineHeight }) => (lineHeight ? `line-height:${lineHeight};` : "")}
  ${({ color }) => (color ? `color:${color};` : "")}
  ${({ background }) => (background ? `background:${background};` : "")}
  ${({ cursor }) => (cursor ? `cursor:${cursor};` : "")}
  ${({ letterSpacing }) =>
    letterSpacing ? `letter-spacing:${letterSpacing};` : ""}
    ${({ textAlign }) => (textAlign ? `text-align:${textAlign};` : "")}
    ${({ opacity }) => (opacity ? `opacity:${opacity};` : "")}
`;

interface ITypography extends WrapperProps {
  children?: string | React.ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Typography = forwardRef<HTMLElement, ITypography>(
  ({ tag = "div", children, style = {}, ...props }, ref) => {
    return (
      <Wrapper style={style} {...props} as={tag} ref={ref}>
        {children}
      </Wrapper>
    );
  }
);

export default Typography;
