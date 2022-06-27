import { css } from "styled-components";

export const button = css`
  all: unset;
  cursor: pointer;
  display: block;

  position: relative;
  overflow: hidden;

  transition: all 300ms ease-in-out;
  &:before {
    transition: all 300ms ease-in-out;
    content: "";
    position: absolute;
    width: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    z-index: 0;
    height: 280px;
  }
  &:hover {
    &:before {
      width: 100%;
      transform: translate(-50%, -50%) rotate(-90deg);
    }
  }
`;
export const buttonText = css`
  display: flex;
  align-items: center;
  gap: 12px;

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
