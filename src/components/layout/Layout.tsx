import { ReactNode, useState } from "react";
import styled, { css, CSSProperties } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { LayoutContext } from "./Context";

const layoutPadding = css`
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

export const LayoutRoot = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  ${({ $fullWidth }) => {
    if ($fullWidth) {
      return css``;
    }
    return css`
      margin: 0 auto;
      ${layoutPadding};

      width: 100%;
      max-width: 100vw;

      ${breakpoint.xs} {
        max-width: 93.75rem;
      }
    `;
  }}
`;

export interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export default function Layout({
  children,
  fullWidth: initialFullWidth,
  ...props
}: LayoutProps) {
  const [fullWidth, setFullWidth] = useState<boolean>(!!initialFullWidth);
  return (
    <LayoutContext.Provider value={{ fullWidth: fullWidth, setFullWidth }}>
      <LayoutRoot {...props} $fullWidth={fullWidth} data-layout>
        {children}
      </LayoutRoot>
    </LayoutContext.Provider>
  );
}
