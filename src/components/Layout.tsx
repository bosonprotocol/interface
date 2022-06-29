import { ReactNode } from "react";
import styled from "styled-components";

import { breakpoint } from "../lib/styles/breakpoint";

const Root = styled.div`
  margin: 0 auto;
  padding: 0 16px;

  max-width: 100vw;
  ${breakpoint.xs} {
    padding: 0 24px;
    max-width: 1500px;
  }
  ${breakpoint.s} {
    padding: 0 28px;
  }
  ${breakpoint.m} {
    padding: 0 32px;
  }
  ${breakpoint.xl} {
    padding: 0 36px;
  }
`;

interface IProps {
  children: ReactNode;
}

export default function Layout({ children, ...props }: IProps) {
  return <Root {...props}>{children}</Root>;
}
