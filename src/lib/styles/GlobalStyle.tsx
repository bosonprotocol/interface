import { createGlobalStyle } from "styled-components";

import { colors } from "../../lib/styles/colors";

const GlobalStyle = createGlobalStyle<{
  $primaryColor: string;
  $secondaryColor: string;
  $accentColor: string;
}>`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
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
  }

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;
    display :flex;
    flex-direction: column;
    background-color: ${colors.white}
    z-index: -2;
    color: ${colors.black}
  }
  // TYPOGRAPHY
  h1, h2, h3, h4, h5, h6, p, a, span, div {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    font-weight: 600;
  }
  h1 {
    font-size: 56px;
    line-height: 120%;
  }
  h2 {
    font-size: 32px;
    line-height: 120%;
  }
  h3 {
    font-size: 24px;
    line-height: 150%;
  }
  h4, h5, h6 {
    font-size: 20px;
    line-height: 150%;
    margin: 0 0 1rem 0;
    font-weight: 400;
  }
  a, p, span, div {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }
`;
export default GlobalStyle;
