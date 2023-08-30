import { ChainId } from "@uniswap/sdk-core";
import { Check } from "phosphor-react";
import styled from "styled-components";

import { getChainInfo } from "../../../lib/constants/chainInfo";
import { breakpointNumbers } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Spinner } from "../../loading/Spinner";

const LOGO_SIZE = 20;

const Container = styled.button<{ disabled: boolean }>`
  align-items: center;
  background: none;
  border: none;
  border-radius: 12px;
  color: ${colors.black};
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  justify-content: space-between;
  line-height: 20px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  padding: 10px 8px;
  text-align: left;
  transition: 250ms ease background-color;
  width: 240px;

  @media only screen and (max-width: ${breakpointNumbers.s}px) {
    width: 100%;
  }

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "none" : colors.lightGrey};
  }
`;

const Label = styled.div`
  grid-column: 2;
  grid-row: 1;
  font-size: 16px;
`;

const Status = styled.div`
  grid-column: 3;
  grid-row: 1;
  display: flex;
  align-items: center;
  width: ${LOGO_SIZE}px;
`;

const CaptionText = styled.div`
  /* color: ${colors.lightGrey}; */
  font-size: 12px;
  grid-column: 2;
  grid-row: 2;
`;

const Logo = styled.img`
  height: ${LOGO_SIZE}px;
  width: ${LOGO_SIZE}px;
  margin-right: 12px;
`;
interface ChainSelectorRowProps {
  disabled?: boolean;
  targetChain: ChainId;
  onSelectChain: () => void;
  label: string;
  isPending: boolean;
  active: boolean;
}
export default function ChainSelectorRow({
  disabled,
  targetChain,
  onSelectChain,
  label,
  isPending,
  active
}: ChainSelectorRowProps) {
  const chainInfo = getChainInfo(targetChain);
  const name = chainInfo?.label;
  const nameAndLabel = name ? `${name} (${label})` : label;
  const logoUrl = chainInfo?.logoUrl;

  return (
    <Container
      disabled={!!disabled}
      onClick={() => {
        if (!disabled) onSelectChain();
      }}
    >
      {logoUrl && <Logo src={logoUrl} alt={nameAndLabel} />}
      {nameAndLabel && <Label>{nameAndLabel}</Label>}
      {disabled && <CaptionText>Unsupported by your wallet</CaptionText>}
      {isPending && <CaptionText>Approve in wallet</CaptionText>}
      <Status>
        {active && (
          <Check
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            color={colors.secondary}
          />
        )}
        {!active && isPending && (
          <Spinner width={LOGO_SIZE} height={LOGO_SIZE} />
        )}
      </Status>
    </Container>
  );
}
