import { CSSProperties } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export const DCLLayout = styled.div<{
  width: "100%" | "auto" | CSSProperties["width"];
}>`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  width: ${({ width }) => width};

  ${breakpoint.s} {
    margin: 0 9.6875rem;
  }
`;
