import { CSSProperties } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export const DCLLayout = styled.div<{
  width: "100%" | "auto" | CSSProperties["width"];
}>`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  padding-right: 4rem;
  padding-left: 4rem;
  width: ${({ width }) => width};
  margin: 0 auto;
  ${breakpoint.xs} {
    max-width: 93.75rem;
  }
`;
