/* eslint @typescript-eslint/no-explicit-any: "off" */
import styled, { css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";

const checkIfValueIsEmpty = (v: any) =>
  v == null ||
  (Object.prototype.hasOwnProperty.call(v, "length") && v.length === 0) ||
  (v.constructor === Object && Object.keys(v).length === 0);

export const FieldInput = styled.input.attrs((props: { error: any }) => ({
  error: props.error
}))`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.5rem;

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;
  font-family: "Plus Jakarta Sans";

  ${transition}

  :not(:disabled) {
    :focus,
    :hover {
      border: 1px solid var(--secondary);
    }
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.red};
          :not(:disabled) {
            :hover {
              border: 1px solid ${colors.red};
            }
          }
          :not(:disabled) {
            :focus {
              border: 1px solid var(--secondary);
            }
          }
        `
      : css`
          :not(:disabled) {
            :focus,
            :hover {
              border: 1px solid var(--secondary);
            }
          }
        `}
`;

export const FieldTextArea = styled.textarea.attrs((props: { error: any }) => ({
  error: props.error
}))`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.5rem;
  font-family: "Plus Jakarta Sans";

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;

  ${transition}

  :not(:disabled) {
    :focus,
    :hover {
      border: 1px solid var(--secondary);
    }
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.red};
          :not(:disabled) {
            :hover {
              border: 1px solid ${colors.red};
            }
          }
          :not(:disabled) {
            :focus {
              border: 1px solid var(--secondary);
            }
          }
        `
      : css`
          :not(:disabled) {
            :focus,
            :hover {
              border: 1px solid var(--secondary);
            }
          }
        `}
`;
