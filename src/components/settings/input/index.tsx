import { Grid } from "components/ui/Grid";
import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  display: flex;
  flex: 1;
  font-size: 1rem;
  border: 0;
  outline: none;
  background: transparent;
  text-align: right;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /* TODO: &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  } */
`;

export const InputContainer = styled(Grid)<{ error?: boolean }>`
  padding: 8px 16px;
  border-radius: 12px;
  width: auto;
  min-width: 100px;
  flex: 1;
  /* input {
    color: ${({ theme, error }) =>
    error ? theme.accentFailure : theme.textPrimary};
  }
  border: 1px solid
    ${({ theme, error }) =>
    error ? theme.accentFailure : theme.deprecated_bg3};
  ${({ theme, error }) =>
    error
      ? `
        border: 1px solid ${theme.accentFailure};
        &:focus-within {
          border-color: ${theme.accentFailureSoft};
        }
      `
      : `
        border: 1px solid ${theme.backgroundOutline};
        &:focus-within {
          border-color: ${theme.accentActiveSoft};
        }
      `} */
`;
