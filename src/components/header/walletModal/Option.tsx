import { useWeb3React } from "@web3-react/core";
import { breakpoint } from "lib/styles/breakpoint";
import { colors } from "lib/styles/colors";
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
`;

const HeaderText = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: center;
  color: var(--textColor);
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

const Wrapper = styled.div<{ disabled: boolean }>`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;

  background-color: var(--secondaryBgColor);

  &:hover {
    cursor: ${({ disabled }) => !disabled && "pointer"};
    background-color: ${({ disabled }) =>
      !disabled && css`color-mix(in srgb, var(--secondaryBgColor) 90%, black)`};
  }
  &:focus {
    background-color: ${({ disabled }) =>
      !disabled && css`color-mix(in srgb, var(--secondaryBgColor) 90%, black)`};
  }
`;

interface OptionProps {
  connection: Connection;
}
export default function Option({ connection }: OptionProps) {
  const { activationState, tryActivation } = useActivationState();
  const toggleAccountDrawer = useToggleAccountDrawer();
  const { chainId } = useWeb3React();
  const activate = () =>
    tryActivation(connection, toggleAccountDrawer, chainId);

  const isSomeOptionPending =
    activationState.status === ActivationStatus.PENDING;
  const isCurrentOptionPending =
    isSomeOptionPending && activationState.connection.type === connection.type;

  return (
    <Wrapper disabled={isSomeOptionPending}>
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
          <HeaderText>{connection.getName()}</HeaderText>
        </OptionCardLeft>
        {isCurrentOptionPending && <Spinner />}
      </OptionCardClickable>
    </Wrapper>
  );
}
