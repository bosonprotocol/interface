import { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export const button = css`
  all: unset;
  cursor: pointer;
  display: block;

  position: relative;
  overflow: hidden;

  transition: all 150ms ease-in-out;
`;
export const clamp = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
`;
export const text = css`
  letter-spacing: 0.5px;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`;
export const buttonText = css`
  letter-spacing: 0.5px;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

export const small = css`
  padding: 0.25rem 1rem;
  > * {
    font-size: 12px !important;
  }
`;
export const regular = css`
  padding: 0.75rem 2rem;
  > * {
    font-size: 16px !important;
  }
  ${breakpoint.xxs} {
    > * {
      font-size: 14px !important;
    }
  }
`;
export const large = css`
  padding: 1.25rem 2rem;
  > * {
    font-size: 18px !important;
  }
  ${breakpoint.xxs} {
    > * {
      font-size: 16px !important;
    }
  }
`;
