import { IButton, ThemedButton } from "@bosonprotocol/react-kit";
import { forwardRef } from "react";
import styled, { css } from "styled-components";

const StyledThemedButton = styled(ThemedButton)`
  ${({ size }) => {
    if (!size) {
      return css`
        height: auto;
      `;
    }
    return css``;
  }}
`;

export type ButtonProps = IButton;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <StyledThemedButton {...props} ref={ref} />;
});

export default Button;
