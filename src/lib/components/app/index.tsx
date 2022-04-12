import Landing from "lib/pages/Landing";
import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  html, body {
    font-family: 'Barlow', sans-serif;
    font-weight: 400;
    margin: 0;
    display:flex;
    flex-direction:column;
    background-color: #222539;
    z-index: -2;
    color: white;
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Landing />
    </>
  );
}
