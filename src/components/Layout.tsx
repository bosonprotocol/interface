import { ReactNode } from "react";
import styled from "styled-components";

import { breakpoint } from "../lib/styles/breakpoint";

const Root = styled.div`
  margin: 0 auto;
  padding: 0 1rem;

  width: 100%;
  max-width: 100vw;

  ${breakpoint.xs} {
    padding: 0 1.5rem;
    max-width: 1500px;
  }
  ${breakpoint.s} {
    padding: 0 1.75rem;
  }
  ${breakpoint.m} {
    padding: 0 2rem;
  }
  ${breakpoint.xl} {
    padding: 0 2.25rem;
  }
`;

interface IProps {
  children: ReactNode;
}

export default function Layout({ children, ...props }: IProps) {
  return <Root {...props}>{children}</Root>;
}
