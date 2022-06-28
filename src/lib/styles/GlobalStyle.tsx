import { createGlobalStyle } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const GlobalStyle = createGlobalStyle<{
  $primaryColor: string;
  $secondaryColor: string;
  $accentColor: string;
}>`
  * {
    box-sizing: border-box
  }
  // TODO: match with colors from lib
  :root {
    --primary: ${(props) =>
      props.$primaryColor ? props.$primaryColor : colors.navy};
    --secondary: ${(props) =>
      props.$secondaryColor ? props.$secondaryColor : colors.green};
    --accent: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.white};
    --accentDark: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.arsenic};

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

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;

    background-color: ${colors.white};
    color: ${colors.black};

    font-family: "Plus Jakarta Sans";
    font-style: normal;
  }
  html, body {
    overflow-x: hidden;
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

  input,
  select {
    -webkit-appearance: none;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 600;
    line-height: 1.2;
  }
  h2 {
    font-size: 2rem
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
    font-weight: 400;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }
  a, p, span, div {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;
export default GlobalStyle;
