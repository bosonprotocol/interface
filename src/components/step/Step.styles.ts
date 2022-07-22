import styled, { css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import { StepState } from "./Step";

export const StepStyle = styled.div.attrs((props: { state: StepState }) => ({
  state: props.state
}))`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  min-width: 6rem;
  height: 1.25rem;
  ${({ state }) =>
    state !== StepState.Active &&
    css`
      :hover {
        cursor: pointer;
      }
    `}

  ${({ state }) =>
    state === StepState.Inactive &&
    css`
      background: ${colors.white};
      ${transition}

      :before {
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

      :hover {
        background: ${colors.lightGrey};
        :before {
          background: ${colors.darkGrey};
          width: 0.5rem;
          height: 0.5rem;
        }
      }

      > div {
        display: none;
      }
    `}

  ${({ state }) =>
    state === StepState.Active &&
    css`
      background: ${colors.black};

      :before {
        margin-left: -0.75rem;
      }
      :after {
        margin-left: 0.75rem;
      }
      > div,
      :before,
      :after {
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

  ${({ state }) =>
    state === StepState.Done &&
    css`
      background: var(--primary);

      :before,
      :after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        ${transition}
        background: ${colors.black};
      }
      :before {
        width: 0.35rem;
        height: 0.125rem;
        transform: translate(calc(-50% - 0.35rem), calc(-50% + 0.15rem))
          rotate(-135deg);
      }
      :after {
        width: 0.75rem;
        height: 0.125rem;
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      > div {
        display: none;
      }

      :hover {
        background: ${colors.black};
        :before,
        :after {
          background: var(--primary);
        }
      }
    `}
`;

export const MultiStepStyle = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;

  align-items: flex-start;
  p {
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    line-height: 200%;
    color: ${colors.darkGrey};
  }
`;

export const MultiStepWrapper = styled.div`
  display: flex;
  flex-grow: 1;

  flex-direction: row;
`;

export const StepWrapper = styled(Grid)`
  border: 1px solid ${colors.border};
`;
