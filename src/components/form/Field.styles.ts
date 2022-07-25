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

export const FileUploadWrapper = styled.div.attrs(
  (props: { choosen: any }) => ({
    choosen: props.choosen
  })
)`
  position: relative;
  overflow: hidden;
  display: flex;

  align-items: center;
  justify-content: center;
  padding: 0.5rem;

  width: 6rem;
  height: 6rem;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
    pointer-events: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
    + svg {
      display: none;
    }
  }

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;

  ${transition}

  :focus,
  :hover {
    border: 1px solid var(--secondary);
  }

  /* prettier-ignore */
  [data-disabled=true] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const FieldFileUpload = styled(FieldInput)`
  display: none;
`;

export const FieldFileUploadWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  :hover {
    [data-remove] {
      display: flex;
    }
  }
  [data-remove] {
    display: none;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 6rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;

    background: ${colors.black}80;
  }
`;

export const FieldTextArea = styled.textarea.attrs((props: { error: any }) => ({
  error: props.error
}))`
  width: 100%;
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

export const FormFieldWrapper = styled(Grid)`
  max-width: 50vw;
  margin-bottom: 3.5rem;

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

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;

  > div,
  > div svg {
    ${transition}
  }
  :hover {
    > div {
      border: 1px solid ${colors.secondary};
    }
    input {
      :not(:checked) {
        + div svg {
          opacity: 0.25;
        }
      }
    }
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;

    border: 1px solid ${colors.border};
    background: ${colors.lightGrey};

    margin-right: 0.5rem;
  }

  > input {
    :checked {
      + div svg {
        opacity: 1;
      }
    }
    :not(:checked) {
      + div svg {
        opacity: 0;
      }
    }
  }
`;
