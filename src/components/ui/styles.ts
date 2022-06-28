import { css } from "styled-components";

export const button = css`
  all: unset;
  cursor: pointer;
  display: block;

  position: relative;
  overflow: hidden;

  transition: all 150ms ease-in-out;
`;
export const buttonText = css`
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

export const small = css`
  padding: 0.25rem 1rem;
  > * {
    font-size: 14px;
  }
`;
export const regular = css`
  padding: 0.75rem 2rem;
  > * {
    font-size: 16px;
  }
`;
export const large = css`
  padding: 1.25rem 2rem;
  > * {
    font-size: 18px;
  }
`;
