import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { breakpoint } from "../lib/styles/breakpoint";

export const LayoutPadding = css`
  padding: 0 1rem;

  ${breakpoint.xs} {
    padding: 0 1.5rem;
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

export const LayoutRoot = styled.div.attrs({ "data-layout-root": true })`
  margin: 0 auto;
  ${LayoutPadding};

  width: 100%;
  max-width: 100vw;

  ${breakpoint.xs} {
    max-width: 93.75rem;
  }
`;

interface IProps {
  children: ReactNode;
}

export default function Layout({ children, ...props }: IProps) {
  return <LayoutRoot {...props}>{children}</LayoutRoot>;
}
