/* eslint @typescript-eslint/no-explicit-any: "off" */
import { defaultFontFamily } from "lib/styles/fonts";
import styled, { css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { colors } from "../../lib/styles/colors";
import { checkIfValueIsEmpty } from "../../lib/utils/checkIfValueIsEmpty";
import { Grid } from "../ui/Grid";

export const CopyButton = styled.button`
  background: none;
  border: none;
`;

export const FieldInput = styled.input<{ error?: any }>`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;
  font-family: ${defaultFontFamily};

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid var(--secondary);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.orange};
          &:not(:disabled) {
            &:hover {
              border: 1px solid ${colors.orange};
            }
          }
          &:not(:disabled) {
            &:focus {
              border: 1px solid var(--secondary);
            }
          }
          &::placeholder {
            color: ${colors.orange};
            opacity: 1;
          }
          &:-ms-input-placeholder {
            color: ${colors.orange};
          }
          &::-ms-input-placeholder {
            color: ${colors.orange};
          }
        `
      : css`
          &:not(:disabled) {
            &:focus,
            &:hover {
              border: 1px solid var(--secondary);
            }
          }
        `}
`;

export const FileUploadWrapper = styled.div<{ error: unknown }>`
  position: relative;
  overflow: hidden;
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 0.5rem;
  width: 100%;
  min-width: 8rem;
  height: 8rem;

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
  border-radius: 0;
  outline: none;

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.orange};
        `
      : css`
          border: 1px solid ${colors.border};
        `}

  ${transition};

  &:focus,
  &:hover {
    border: 1px solid var(--secondary);
  }

  /* prettier-ignore */
  [data-disabled=true] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const FieldFileUploadWrapper = styled.div<{ $disabled: boolean }>`
  position: relative;
  display: inline-block;
  width: 8rem;
  height: 8rem;
  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `}
  &:hover {
    [data-remove] {
      display: flex;
    }
  }
  [data-remove] {
    display: none;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    transition: all 300ms ease-in-out;

    background: ${colors.black}80;
  }
`;

export const FieldTextArea = styled.textarea<{ error: unknown }>`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;
  font-family: ${defaultFontFamily};

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid var(--secondary);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.orange};
          &::placeholder {
            color: ${colors.orange};
            opacity: 1;
          }
          &:-ms-input-placeholder {
            color: ${colors.orange};
          }
          &::-ms-input-placeholder {
            color: ${colors.orange};
          }
          &:not(:disabled) {
            &:hover {
              border: 1px solid ${colors.orange};
            }
          }
          &:not(:disabled) {
            &:focus {
              border: 1px solid var(--secondary);
            }
          }
        `
      : css`
          &:not(:disabled) {
            &:focus,
            &:hover {
              border: 1px solid var(--secondary);
            }
          }
        `}
`;

export const FormFieldWrapper = styled(Grid)`
  margin-bottom: 3.5rem;
  p {
    line-height: 150%;
  }

  /* TODO: 
  input, textarea {
    background: ${colors.white};
    &:disabled {
      opacity: 1;
    }
  } */
  input + div {
    background: ${colors.white};
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
    margin: 0;
    font-weight: 400;
    font-size: 0.75rem;
    color: ${colors.darkGrey};
  }
`;

export const CheckboxWrapper = styled.label<{ error?: unknown }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  > input {
    &:disabled {
      + div {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    &:not(:disabled) {
      + div {
        cursor: pointer;
        &:hover {
          border: 1px solid ${colors.secondary};
          svg {
            opacity: 0.25;
          }
        }
      }
    }
  }

  > div,
  > div svg {
    ${transition}
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;

    background: ${colors.lightGrey};

    margin-right: 0.5rem;
  }

  > input {
    &:checked {
      + div svg {
        opacity: 1;
      }
    }
    &:not(:checked) {
      + div svg {
        opacity: 0;
      }
    }
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          > div {
            border: 1px solid ${colors.orange};
          }
        `
      : css`
          > div {
            border: 1px solid ${colors.border};
          }
        `}
`;

export const VideoPreview = styled.video`
  background: ${colors.lightGrey};
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
export const ImagePreview = styled.img`
  background: ${colors.lightGrey};
`;
