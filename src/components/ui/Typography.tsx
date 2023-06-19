import React, { CSSProperties, forwardRef, HTMLAttributes } from "react";
import styled from "styled-components";

import { IGrid } from "./Grid";

interface WrapperProps extends IGrid {
  $fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  lineHeight?: CSSProperties["lineHeight"];
  color?: CSSProperties["color"];
  background?: CSSProperties["background"];
  cursor?: CSSProperties["cursor"];
  letterSpacing?: CSSProperties["letterSpacing"];
  textAlign?: CSSProperties["textAlign"];
  opacity?: CSSProperties["opacity"];
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
  ${({ marginTop }) => (marginTop ? `margin-top:${marginTop};` : "")}
  ${({ marginRight }) => (marginRight ? `margin-right:${marginRight};` : "")}
  ${({ marginBottom }) =>
    marginBottom ? `margin-bottom:${marginBottom};` : ""}
  ${({ marginLeft }) => (marginLeft ? `margin-left:${marginLeft};` : "")}

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
type Tag = keyof JSX.IntrinsicElements;

type ITypography<T extends Tag> = WrapperProps &
  Omit<HTMLAttributes<T>, "color"> & {
    children?: string | React.ReactNode;
    tag?: Tag;
    style?: React.CSSProperties;
    onClick?: () => void;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Typography = forwardRef<HTMLElement, ITypography<any>>(
  ({ tag = "div", children, style = {}, ...props }, ref) => {
    return (
      <Wrapper style={style} {...props} as={tag} ref={ref}>
        {children}
      </Wrapper>
    );
  }
);

export default Typography;
