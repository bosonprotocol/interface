// eslint-disable-next-line no-restricted-imports
import { flexColumnNoWrap } from "components/header/styles";
import { AutoColumn } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import { ExplorerDataType, getExplorerLink } from "lib/utils/getExplorerLink";
import { useChainId } from "lib/utils/hooks/connection/connection";
import useENS from "lib/utils/hooks/useENS";
import { ChangeEvent, ReactNode, useCallback } from "react";
import styled from "styled-components";

const InputPanel = styled.div`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: 1.25rem;
  background-color: ${colors.darkGrey};
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid
    ${({ error, theme }) =>
      error ? theme.accentFailure : theme.backgroundInteractive};
  transition: border-color 300ms
      ${({ error }) => (error ? "step-end" : "step-start")},
    color 500ms ${({ error }) => (error ? "step-end" : "step-start")};
  background-color: ${colors.darkGrey};
`;

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${colors.darkGrey};
  transition: color 300ms ${({ error }) => (error ? "step-end" : "step-start")};
  color: ${({ error, theme }) =>
    error ? theme.accentFailure : theme.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  &::placeholder {
    color: ${({ theme }) => theme.deprecated_text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.deprecated_text4};
  }
`;

export default function AddressInputPanel({
  id,
  className = "recipient-address-input",
  label,
  placeholder,
  value,
  onChange
}: {
  id?: string;
  className?: string;
  label?: ReactNode;
  placeholder?: string;
  // the typed string value
  value: string;
  // triggers whenever the typed value changes
  onChange: (value: string) => void;
}) {
  const chainId = useChainId();

  const { address, loading, name } = useENS(value);

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, "");
      onChange(withoutSpaces);
    },
    [onChange]
  );

  const error = Boolean(value.length > 0 && !loading && !address);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn $gap="md">
            <Grid>
              <Typography
                color={colors.lightGrey}
                fontWeight={500}
                fontSize={14}
              >
                {label ?? <>Recipient</>}
              </Typography>
              {address && chainId && (
                <a
                  href={getExplorerLink(
                    chainId,
                    name ?? address,
                    ExplorerDataType.ADDRESS
                  )}
                  style={{ fontSize: "14px" }}
                >
                  <>(View on Explorer)</>
                </a>
              )}
            </Grid>
            <Input
              className={className}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={placeholder ?? `Wallet Address or ENS name`}
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  );
}
