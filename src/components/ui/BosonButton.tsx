import { Button, ButtonProps } from "@bosonprotocol/react-kit";
import { Fragment } from "react";
import styled, { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { zIndex } from "../../lib/styles/zIndex";
import Tooltip from "../tooltip/Tooltip";

interface IBosonButton extends ButtonProps {
  tooltip?: string;
}

const StyledBosonButton = styled(Button)`
  ${(props) => {
    switch (props.size) {
      case "small":
        return css`
          padding: 0.25rem 1rem;
          > * {
            font-size: 0.75rem !important;
          }
        `;
      case "large":
        return css`
          padding: 1.25rem 2rem;
          > * {
            font-size: 1.125rem !important;
          }
          ${breakpoint.xxs} {
            > * {
              font-size: 1rem !important;
            }
          }
        `;
      default:
        return css`
          padding: 0.75rem 2rem;
          > * {
            font-size: 1rem !important;
          }
          ${breakpoint.xxs} {
            > * {
              font-size: 0.875rem !important;
            }
          }
        `;
    }
  }}
`;

const ChildWrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: ${zIndex.Button};
`;

function BosonButton(props: IBosonButton) {
  const { tooltip, disabled, ...restProps } = props;
  const Wrapper = tooltip && disabled ? Tooltip : Fragment;
  const wrapperParams =
    tooltip && disabled ? { wrap: false, content: tooltip } : {};
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Wrapper {...wrapperParams}>
        <StyledBosonButton {...restProps} disabled={disabled}>
          <ChildWrapperButton data-child-wrapper-button>
            {props.children}
          </ChildWrapperButton>
        </StyledBosonButton>
      </Wrapper>
    </>
  );
}

export default BosonButton;
