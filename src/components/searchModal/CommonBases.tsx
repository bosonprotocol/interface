import { Currency } from "@uniswap/sdk-core";
import CurrencyLogo from "components/logo/CurrencyLogo";
import { AutoColumn } from "components/ui/column/index";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { COMMON_BASES } from "lib/constants/routing";
import { breakpoint } from "lib/styles/breakpoint";
import { currencyId } from "lib/utils/currencyId";
import { useTokenInfoFromActiveList } from "lib/utils/hooks/useTokenInfoFromActiveList";
import styled from "styled-components";

const MobileWrapper = styled(AutoColumn)`
  ${breakpoint.s} {
    // TODO: check
    display: none;
  }
`;

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid
    ${({ theme, disable }) =>
      disable ? theme.accentActive : theme.backgroundOutline};
  border-radius: 16px;
  display: flex;
  padding: 6px;
  padding-right: 12px;

  align-items: center;
  &:hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme }) => theme.hoverDefault};
  }

  color: ${({ theme, disable }) => disable && theme.accentActive};
  background-color: ${({ theme, disable }) =>
    disable && theme.accentActiveSoft};
`;

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency
}: {
  chainId?: number;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const bases = chainId !== undefined ? COMMON_BASES[chainId] ?? [] : [];

  return bases.length > 0 ? (
    <MobileWrapper $gap="md">
      <Grid gap="4px">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency);

          return (
            <BaseWrapper
              tabIndex={0}
              onKeyPress={(e) =>
                !isSelected && e.key === "Enter" && onSelect(currency)
              }
              onClick={() => !isSelected && onSelect(currency)}
              disable={isSelected}
              key={currencyId(currency)}
              data-testid={`common-base-${currency.symbol}`}
            >
              <CurrencyLogoFromList currency={currency} />
              <Typography fontWeight={500} fontSize={16}>
                {currency.symbol}
              </Typography>
            </BaseWrapper>
          );
        })}
      </Grid>
    </MobileWrapper>
  ) : null;
}

/** helper component to retrieve a base currency from the active token lists */
function CurrencyLogoFromList({ currency }: { currency: Currency }) {
  const token = useTokenInfoFromActiveList(currency);

  return <CurrencyLogo currency={token} style={{ marginRight: 8 }} />;
}
