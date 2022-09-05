import { createGlobalStyle } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const GlobalStyle = createGlobalStyle<{
  $primaryBgColor: string;
  $secondaryBgColor: string;
  $accentColor1: string;
  $accentColor2: string;
  $textColor: string;
}>`

  * {
    box-sizing: border-box;
  }
  :root {
    --l: 50%;
    --primary: ${(props) =>
      props.$primaryBgColor ? props.$primaryBgColor : colors.primary};
    --secondary: ${(props) =>
      props.$secondaryBgColor ? props.$secondaryBgColor : colors.secondary};
    --accent: ${(props) =>
      props.$accentColor1 ? props.$accentColor1 : colors.white};
    --accentDark: ${(props) =>
      props.$accentColor2 ? props.$accentColor2 : colors.arsenic};
    --primaryBgColor: ${(props) =>
      props.$primaryBgColor ? props.$primaryBgColor : colors.primaryBgColor};
    --secondaryBgColor: ${(props) =>
      props.$secondaryBgColor ? props.$secondaryBgColor : colors.secondary};

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
    color: ${colors.black};

    font-family: "Plus Jakarta Sans";
    font-style: normal;

    overflow-y: auto;
    overflow-x: hidden;

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
  }
`;
export default GlobalStyle;
