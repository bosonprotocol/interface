/* eslint @typescript-eslint/no-explicit-any: "off" */
import styled, { css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";

const checkIfValueIsEmpty = (v: any) =>
  v == null ||
  (Object.prototype.hasOwnProperty.call(v, "length") && v.length === 0) ||
  (v.constructor === Object && Object.keys(v).length === 0);

export const FieldInput = styled.input.attrs((props: { error: any }) => ({
  error: props.error
}))`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;

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

export const FieldTextArea = styled.textarea.attrs((props: { error: any }) => ({
  error: props.error
}))`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;

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

export const FormFieldWrapper = styled(Grid)`
  max-width: 50vw;
  :not(:last-of-type) {
    margin-bottom: 3.5rem;
  }

  p {
    font-family: "Plus Jakarta Sans";
    font-style: normal;
    line-height: 150%;
  }

  [data-header] {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
    color: ${colors.black};
    + div button {
      margin-left: 0.5rem;
      padding: 0;
    }
  }
  [data-subheader] {
    font-weight: 400;
    font-size: 0.75rem;
    color: ${colors.darkGrey};
  }
`;
