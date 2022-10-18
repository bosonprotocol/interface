import { createGlobalStyle } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const GlobalStyle = createGlobalStyle<{
  $withBosonStyles: boolean;
  $headerBgColor: string;
  $headerTextColor: string;
  $primaryBgColor: string;
  $secondaryBgColor: string;
  $accentColor: string;
  $textColor: string;
  $footerBgColor: string;
  $footerTextColor: string;
  $fontFamily: string;
  $buttonBgColor: string;
  $buttonTextColor: string;
}>`

  * {
    box-sizing: border-box;
  }
  :root {
    --l: 50%;
    --headerBgColor: ${(props) =>
      props.$headerBgColor && !props.$withBosonStyles
        ? props.$headerBgColor
        : colors.white};
    --headerTextColor: ${(props) =>
      props.$headerTextColor && !props.$withBosonStyles
        ? props.$headerTextColor
        : colors.darkGrey};
    --primary: ${(props) =>
      props.$primaryBgColor && !props.$withBosonStyles
        ? props.$primaryBgColor
        : colors.primary};
    --secondary: ${(props) =>
      props.$secondaryBgColor && !props.$withBosonStyles
        ? props.$secondaryBgColor
        : colors.lightGrey};
    --accent: ${(props) =>
      props.$accentColor && !props.$withBosonStyles
        ? props.$accentColor
        : colors.secondary};
    --accentNoDefault : ${(props) =>
      props.$accentColor && !props.$withBosonStyles ? props.$accentColor : ""};
    --accentDark: ${(props) =>
      props.$accentColor && !props.$withBosonStyles
        ? props.$accentColor
        : colors.arsenic};
    --textColor: ${(props) =>
      props.$textColor && !props.$withBosonStyles
        ? props.$textColor
        : colors.black};
    --primaryBgColor: ${(props) =>
      props.$primaryBgColor && !props.$withBosonStyles
        ? props.$primaryBgColor
        : colors.primaryBgColor};
    --secondaryBgColor: ${(props) =>
      props.$secondaryBgColor && !props.$withBosonStyles
        ? props.$secondaryBgColor
        : colors.secondary};
    --footerBgColor: ${(props) =>
      props.$footerBgColor && !props.$withBosonStyles
        ? props.$footerBgColor
        : colors.black};
    --footerTextColor: ${(props) =>
      props.$footerTextColor && !props.$withBosonStyles
        ? props.$footerTextColor
        : colors.white};
    --buttonBgColor: ${(props) =>
      props.$buttonBgColor && !props.$withBosonStyles
        ? props.$buttonBgColor
        : colors.primary};
    --buttonTextColor: ${(props) =>
      props.$buttonTextColor && !props.$withBosonStyles
        ? props.$buttonTextColor
        : colors.black};

    font-size: 12px;
    ${breakpoint.xs} {
      font-size: 12px;
    }
    ${breakpoint.s} {
      font-size: 14px;
    }
    ${breakpoint.m} {
      font-size: 14px;
    }
    ${breakpoint.l} {
      font-size: 16px;
    }
    ${breakpoint.xl} {
      font-size: 16px;
    }
  }

  button {
    all: unset;
  }

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;

    background-color: var(--primaryBgColor);
    color: var(--textColor);

    font-family: ${(props) => props.$fontFamily || "Plus Jakarta Sans"};
    font-style: normal;

    max-height: 100vh;
  }



  a,
  button,
  input,
  select,
  textarea {
    text-decoration: none;
    &:focus,
    &:hover {
      outline: none;
    }
    cursor: pointer;
  }

  select {
    -webkit-appearance: none;
  }

  input {
    user-select: text;
  }

  * > small {
    font-size: 65%;
    margin: 0 0.5rem;
    opacity: 0.75;
    white-space: pre;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 600;
    line-height: 1.2;
  }
  h2 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.5;
  }
  h4, h5, h6 {
    font-size: 1.25rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }
  a, p, span, div {
    font-size: 1rem;
    line-height: 1.5;
  }
  img, svg {
    user-select: none;
  }

  [data-rk][role=dialog] {
    top: 0; // rainbowkit modal backdrop should fill up all height
    height: 100%;
  }
`;
export default GlobalStyle;
