import { defaultFontFamily } from "lib/styles/fonts";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";

export const CTAButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  :disabled {
    border: 2px solid ${colors.darkGrey};
  }
  :hover:not(:disabled) {
    border: 2px solid var(--primary);
  }
`;

export const ProtocolStrong = styled.strong`
  margin-right: 0.25rem;
`;

export const InputWrapper = styled(Grid)<{ $hasError?: boolean }>`
  flex: 1;
  gap: 1rem;

  margin-top: -1rem;
  padding: 1.125rem 1rem;
  max-height: 3.5rem;
  background: ${colors.darkGrey};
  ${({ $hasError }) =>
    $hasError &&
    `
    border: 0.0625rem solid ${colors.red};
    `}
`;

export const Input = styled.input`
  background: transparent;
  border: none;
  flex: 1;

  font-family: ${defaultFontFamily};
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.white};
  &:focus {
    outline: none;
  }
`;

export const AmountWrapper = styled.div`
  width: 100%;
`;
