import { createGlobalStyle } from "styled-components";

import { scrollStyles } from "../../components/ui/styles";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const GlobalStyle = createGlobalStyle<{
  $primaryColor: string;
  $secondaryColor: string;
  $accentColor: string;
  $primaryBgColor: string;
}>`

  * {
    box-sizing: border-box;
  }
  :root {
    --l: 50%;
    --primary: ${(props) =>
      props.$primaryColor ? props.$primaryColor : colors.primary};
    --secondary: ${(props) =>
      props.$secondaryColor ? props.$secondaryColor : colors.secondary};
    --accent: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.white};
    --accentDark: ${(props) =>
      props.$accentColor ? props.$accentColor : colors.arsenic};
    --primaryBgColor: ${(props) =>
      props.$primaryBgColor ? props.$primaryBgColor : colors.primaryBgColor};
    --scrollbarThumb: ${(props) =>
      props.$primaryColor ? props.$primaryColor : colors.primary};
    --scrollbarBg: ${colors.black};
    --scrollbarWidth: 4px;

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

    background-color: var(--primaryBgColor);
    color: ${colors.black};

    font-family: "Plus Jakarta Sans";
    font-style: normal;

    ${scrollStyles}

    overflow-y: auto;
    overflow-x: hidden;
    ${scrollStyles}
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

  * > small {
    font-size: 65%;
    margin: 0 0.5rem;
    opacity: 0.75;
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
  img, svg, input {
    user-select: none;
  }
`;
export default GlobalStyle;
