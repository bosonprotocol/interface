import styled, { css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import { StepState } from "./Step";

export const StepStyle = styled.div<{
  state: StepState;
  disabled: boolean;
  isLteS?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  min-width: 6rem;
  height: 1.25rem;
  ${({ state, disabled }) =>
    state !== StepState.Active &&
    !disabled &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${({ state, disabled }) =>
    state === StepState.Inactive &&
    css`
      background: ${colors.white};
      ${transition}

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #d3d5db;

        ${transition}

        width: 0.25rem;
        height: 0.25rem;
      }
      ${!disabled &&
      css`
        &:hover {
          background: ${colors.greyLight};
          &:before {
            background: ${colors.greyDark};
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      `}

      > div {
        display: none;
      }
    `}

  ${({ state }) =>
    state === StepState.Active &&
    css`
      background: ${colors.black};

      &:before {
        margin-left: -0.75rem;
      }
      &:after {
        margin-left: 0.75rem;
      }
      > div,
      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        ${transition}
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background: var(--primary);
      }
    `}

  ${({ state, disabled }) =>
    state === StepState.Done &&
    css`
      background: var(--primary);

      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        ${transition}
        background: ${colors.black};
      }
      &:before {
        width: 0.35rem;
        height: 0.125rem;
        transform: translate(calc(-50% - 0.35rem), calc(-50% + 0.15rem))
          rotate(-135deg);
      }
      &:after {
        width: 0.75rem;
        height: 0.125rem;
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      > div {
        display: none;
      }
      ${!disabled &&
      css`
        &:hover {
          background: ${colors.black};
          &:before,
          &:after {
            background: var(--primary);
          }
        }
      `}
    `}
`;

export const MultiStepStyle = styled.div<{ $isLteS: boolean }>`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  div div {
    display: ${({ $isLteS }) => $isLteS && "none"};
  }

  p {
    text-align: center;
    margin: 0;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.5;
    color: ${colors.greyDark};
  }
`;

export const MultiStepWrapper = styled.div<{ $isLteS: boolean }>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  position: ${({ $isLteS }) => $isLteS && "absolute"};
  left: ${({ $isLteS }) => $isLteS && "50%"};
  transform: ${({ $isLteS }) => $isLteS && "translate(-50%, 0)"};
`;

export const StepWrapper = styled.div`
  display: flex;
  gap: 0;
  flex-grow: 1;

  flex-direction: row;
  flex-wrap: nowrap;
  border: 1px solid ${colors.border};
  &:empty + p {
    display: none;
  }
  &:empty {
    display: none;
  }
`;
