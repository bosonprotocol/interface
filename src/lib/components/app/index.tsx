import Landing from "lib/pages/Landing";
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  html, body {
    font-family: 'Manrope', sans-serif;
    font-weight: 400;
    margin: 0;
    display:flex;
    flex-direction:column;
    background-color: #222539;
    z-index: -2;
    color: white;
  }
`;

const Footer = styled.footer`
  background-color: #3a364f;
  margin-top: 30px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: end;
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Landing />
      <Footer>
        <img
          src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/6058b6a3587b6e3e4e96ec24_logo.png"
          alt="Boson Protocol"
          height={80}
        ></img>
      </Footer>
    </>
  );
}
