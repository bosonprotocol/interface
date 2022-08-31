import { CircleNotch } from "phosphor-react";
import styled from "styled-components";

export const Spinner = styled(CircleNotch)`
  animation: spin 2s infinite linear;
  stroke: black;
  rect {
    stroke: transparent;
  }
  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }
`;
