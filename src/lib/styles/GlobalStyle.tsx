import { cssVars } from "@bosonprotocol/react-kit";
import { createGlobalStyle } from "styled-components";

import barlowRegular from "../../assets/fonts/Barlow-Regular.ttf";
import neuropolitical_rg from "../../assets/fonts/neuropolitical_rg.ttf";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { defaultFontFamily } from "./fonts";

const GlobalStyle = createGlobalStyle<{
  $withBosonStyles?: boolean;
  $headerBgColor?: string;
  $headerTextColor?: string;
  $primaryBgColor?: string;
  $secondaryBgColor?: string;
  $accentColor?: string;
  $textColor?: string;
  $footerBgColor?: string;
  $footerTextColor?: string;
  $fontFamily?: string;
  $buttonBgColor?: string;
  $buttonTextColor?: string;
  $upperCardBgColor?: string;
  $lowerCardBgColor?: string;
}>`
  img {
    pointer-events: none;
  }
  @font-face {
    font-family: barlow;
    src: url(${barlowRegular});
    font-weight: normal;
  }
  @font-face {
    font-family: neuropolitical_rg;
    src: url(${neuropolitical_rg});
    font-weight: normal;
  }
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
        : colors.greyDark};
    --primary: ${(props) =>
      props.$primaryBgColor && !props.$withBosonStyles
        ? props.$primaryBgColor
        : colors.green};
    --secondary: ${(props) =>
      props.$secondaryBgColor && !props.$withBosonStyles
        ? props.$secondaryBgColor
        : colors.greyLight};
    --accent: ${(props) =>
      props.$accentColor && !props.$withBosonStyles
        ? props.$accentColor
        : colors.violet};
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
        : colors.white};
    --secondaryBgColor: ${(props) =>
      props.$secondaryBgColor && !props.$withBosonStyles
        ? props.$secondaryBgColor
        : colors.violet};
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
        : colors.green};
    --buttonTextColor: ${(props) =>
      props.$buttonTextColor && !props.$withBosonStyles
        ? props.$buttonTextColor
        : colors.black};
    --upperCardBgColor: ${(props) =>
      props.$upperCardBgColor && !props.$withBosonStyles
        ? props.$upperCardBgColor
        : colors.white};
    --lowerCardBgColor: ${(props) =>
      props.$lowerCardBgColor && !props.$withBosonStyles
        ? props.$lowerCardBgColor
        : colors.white};

    ${cssVars};

    font-size: 0.75rem;
    ${breakpoint.xs} {
      font-size: 0.75rem;
    }
    ${breakpoint.s} {
      font-size: 0.875rem;
    }
    ${breakpoint.m} {
      font-size: 0.875rem;
    }
    ${breakpoint.l} {
      font-size: 1rem;
    }
    ${breakpoint.xl} {
      font-size: 1rem;
    }
  }

  button {
    all: unset;
    box-sizing: border-box;
  }

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;

    background-color: var(--primaryBgColor);
    color: var(--textColor);

    font-family: ${(props) => props.$fontFamily || defaultFontFamily};
    font-style: normal;

    max-height: 100vh;
  }



  a,
  button,
  input,
  select,
  textarea, [data-anchor] {
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
  a, p, span, div, [data-anchor] {
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
