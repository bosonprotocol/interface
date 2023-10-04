import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import { darken, lighten } from "polished";
import styled, { css } from "styled-components";

import {
  ActivationStatus,
  useActivationState
} from "../../../lib/connection/activate";
import { Connection } from "../../../lib/connection/types";
import { Spinner } from "../../loading/Spinner";
import { useToggleAccountDrawer } from "../accountDrawer";
import { flexColumnNoWrap, flexRowNoWrap } from "../styles";

const OptionCardLeft = styled.div`
  ${flexColumnNoWrap};
  flex-direction: row;
  align-items: center;
`;

const OptionCardClickable = styled.button<{ selected: boolean }>`
  align-items: center;
  background-color: unset;
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  opacity: ${({ disabled, selected }) => (disabled && !selected ? "0.5" : "1")};
  padding: 18px;
  transition: 125ms;
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `};
`;

const HeaderText = styled.div<{ $color: string }>`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 16px;
  font-weight: 600;
  padding: 0 8px;
`;
const IconWrapper = styled.div`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  img {
    border: 1px solid ${colors.border};
    border-radius: 12px;
  }
  & > img,
  span {
    height: 40px;
    width: 40px;
  }
  ${breakpoint.m} {
    align-items: flex-end;
  } ;
`;

const Wrapper = styled.div<{
  disabled: boolean;
  $hoverFocusBackgroundColor: string;
  $hoverTextColor: string;
}>`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;

  background-color: var(--secondaryBgColor);

  &:hover {
    cursor: ${({ disabled }) => !disabled && "pointer"};
    /* background-color: ${({ disabled }) =>
      !disabled &&
      css`color-mix(in srgb, var(--secondaryBgColor) 90%, black)`}; */
    background-color: ${({ disabled, $hoverFocusBackgroundColor }) =>
      !disabled && $hoverFocusBackgroundColor};
    ${HeaderText} {
      color: ${({ disabled, $hoverTextColor }) => !disabled && $hoverTextColor};
    }
  }
  &:focus {
    background-color: ${({ disabled, $hoverFocusBackgroundColor }) =>
      !disabled && $hoverFocusBackgroundColor};
    ${HeaderText} {
      color: ${({ disabled, $hoverTextColor }) => !disabled && $hoverTextColor};
    }
  }
`;

interface OptionProps {
  connection: Connection;
}
export default function Option({ connection }: OptionProps) {
  const { activationState, tryActivation } = useActivationState();
  const toggleAccountDrawer = useToggleAccountDrawer();
  const chainId = useChainId();
  const activate = () =>
    tryActivation(connection, toggleAccountDrawer, chainId);

  const isSomeOptionPending =
    activationState.status === ActivationStatus.PENDING;
  const isCurrentOptionPending =
    isSomeOptionPending && activationState.connection.type === connection.type;
  const headerTextColor = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--secondaryBgColor") || colors.secondary,
    color1: useCSSVariable("--textColor") || colors.black
  });
  const hoverHeaderBackground = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--secondaryBgColor") || colors.secondary,
    color1: darken(
      0.2,
      useCSSVariable("--secondaryBgColor") || colors.secondary
    ),
    defaultDarkColor1: darken(
      0.75,
      useCSSVariable("--secondaryBgColor") || colors.secondary
    ),
    defaultLightColor1: lighten(
      0.1,
      useCSSVariable("--secondaryBgColor") || colors.secondary
    )
  });
  return (
    <Wrapper
      disabled={isSomeOptionPending}
      $hoverFocusBackgroundColor={hoverHeaderBackground}
      $hoverTextColor={getColor1OverColor2WithContrast({
        color2: hoverHeaderBackground,
        color1: useCSSVariable("--textColor") || colors.black
      })}
    >
      <OptionCardClickable
        disabled={isSomeOptionPending}
        onClick={activate}
        selected={isCurrentOptionPending}
        data-testid={`wallet-option-${connection.type}`}
      >
        <OptionCardLeft>
          <IconWrapper>
            <img src={connection.getIcon?.(false)} alt={connection.getName()} />
          </IconWrapper>
          <HeaderText $color={headerTextColor}>
            {connection.getName()}
          </HeaderText>
        </OptionCardLeft>
        {isCurrentOptionPending && <Spinner />}
      </OptionCardClickable>
    </Wrapper>
  );
}
