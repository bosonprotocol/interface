import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import { breakpointNumbers } from "../../../lib/styles/breakpoint";
import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { getChainInfo } from "./constants/chainInfo";
import { CheckMarkIcon } from "./icons";
import Loader from "./Icons/LoadingSpinner";

const LOGO_SIZE = 20;

const Container = styled.button<{ disabled: boolean }>`
  align-items: center;
  background: none;
  border: none;
  border-radius: 12px;
  /* color: ${({ theme }) => theme.textPrimary}; */
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
    /* background-color: ${({ disabled, theme }) =>
      disabled ? "none" : theme.backgroundOutline}; */
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
  /* color: ${({ theme }) => theme.textSecondary}; */
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
  onSelectChain: (targetChain: number) => void;
  isPending: boolean;
}
export default function ChainSelectorRow({
  disabled,
  targetChain,
  onSelectChain,
  isPending
}: ChainSelectorRowProps) {
  const { chainId } = useWeb3React();
  const active = chainId === targetChain;
  const chainInfo = getChainInfo(targetChain);
  const label = chainInfo?.label;
  const logoUrl = chainInfo?.logoUrl;
  const accentColor = useCustomStoreQueryParameter("accentColor");

  return (
    <Container
      disabled={!!disabled}
      onClick={() => {
        if (!disabled) onSelectChain(targetChain);
      }}
    >
      {logoUrl && <Logo src={logoUrl} alt={label} />}
      {label && <Label>{label}</Label>}
      {disabled && <CaptionText>Unsupported by your wallet</CaptionText>}
      {isPending && <CaptionText>Approve in wallet</CaptionText>}
      <Status>
        {active && (
          <CheckMarkIcon
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            color={accentColor}
          />
        )}
        {!active && isPending && (
          <Loader width={LOGO_SIZE} height={LOGO_SIZE} />
        )}
      </Status>
    </Container>
  );
}
