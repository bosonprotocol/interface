import { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export const transition = css`
  transition: all 150ms ease-in-out;
`;

export const button = css`
  box-sizing: border-box;
  cursor: pointer;
  display: block;

  position: relative;
  overflow: hidden;

  ${transition}
`;
export const clamp = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;
export const boxShadow = css`
  box-shadow:
    0px 0px 4px rgba(0, 0, 0, 0.05),
    0px 0px 8px rgba(0, 0, 0, 0.05),
    0px 0px 16px rgba(0, 0, 0, 0.05),
    0px 0px 32px rgba(0, 0, 0, 0.05);
`;

export const text = css`
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 0.875rem;
  line-height: 24px;
`;

export const buttonText = css`
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;
`;

export const small = css`
  padding: 0.25rem 1rem;
  > * {
    font-size: 0.75rem !important;
  }
`;
export const regular = css`
  padding: 0.75rem 2rem;
  > * {
    font-size: 1rem !important;
  }
  ${breakpoint.xxs} {
    > * {
      font-size: 0.875rem !important;
    }
  }
`;
export const large = css`
  padding: 1.25rem 2rem;
  > * {
    font-size: 1.125rem !important;
  }
  ${breakpoint.xxs} {
    > * {
      font-size: 1rem !important;
    }
  }
`;
