import { Button, ButtonProps, ButtonSize } from "@bosonprotocol/react-kit";
import styled, { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

const StyledBosonButton = styled(Button)`
  ${(props) => {
    switch (props.size) {
      case ButtonSize.Small:
        return css`
          padding: 0.25rem 1rem;
          > * {
            font-size: 12px !important;
          }
        `;
      case ButtonSize.Large:
        return css`
          padding: 1.25rem 2rem;
          > * {
            font-size: 18px !important;
          }
          ${breakpoint.xxs} {
            > * {
              font-size: 16px !important;
            }
          }
        `;
      default:
        return css`
          padding: 0.75rem 2rem;
          > * {
            font-size: 16px !important;
          }
          ${breakpoint.xxs} {
            > * {
              font-size: 14px !important;
            }
          }
        `;
    }
  }}
  height: auto;
`;

function BosonButton(props: ButtonProps) {
  return <StyledBosonButton {...props} />;
}

export default BosonButton;
