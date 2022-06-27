import { ReactNode } from "react";
import styled from "styled-components";

import { breakpoint } from "../lib/styles/breakpoint";

const Root = styled.div`
  max-width: 1500px;
  margin: 0 auto;

  padding: 0 16px;
  ${breakpoint.xs} {
    padding: 0px 24px;
  }
  ${breakpoint.s} {
    padding: 0px 28px;
  }
  ${breakpoint.m} {
    padding: 0px 32px;
  }
  ${breakpoint.xl} {
    padding: 0px 36px;
  }
`;

interface IProps {
  children: ReactNode;
}

export default function Layout({ children, ...props }: IProps) {
  return <Root {...props}>{children}</Root>;
}
