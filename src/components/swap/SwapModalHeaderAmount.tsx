import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import CurrencyLogo from "components/logo/CurrencyLogo";
import Tooltip from "components/tooltip/Tooltip";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography, { TypographyProps } from "components/ui/Typography";
import { breakpointNumbers } from "lib/styles/breakpoint";
import { formatNumber, NumberType } from "lib/utils/formatNumbers";
import { formatReviewSwapCurrencyAmount } from "lib/utils/formatNumbers";
import { useWindowSize } from "lib/utils/hooks/useWindowSize";
import { PropsWithChildren, ReactNode } from "react";
import { Field } from "state/swap/actions";
import styled from "styled-components";

export const Label = styled(Typography)<{ cursor?: string }>`
  cursor: ${({ cursor }) => cursor};
  color: ${({ theme }) => theme.textSecondary};
  margin-right: 8px;
`;

const ResponsiveHeadline = ({
  children,
  ...textProps
}: PropsWithChildren<TypographyProps>) => {
  const { width } = useWindowSize();

  if (width && width < breakpointNumbers.xs) {
    return <Typography {...textProps}>{children}</Typography>;
  }

  return (
    <Typography fontWeight={500} {...textProps}>
      {children}
    </Typography>
  );
};

interface AmountProps {
  field: Field;
  tooltipText?: ReactNode;
  label: ReactNode;
  amount: CurrencyAmount<Currency>;
  usdAmount?: number;
  // The currency used here can be different than the currency denoted in the `amount` prop
  // For UniswapX ETH input trades, the trade object will have WETH as the amount.currency, but
  // the user's real input currency is ETH, so show ETH instead
  currency: Currency;
}

export function SwapModalHeaderAmount({
  tooltipText,
  label,
  amount,
  usdAmount,
  field,
  currency
}: AmountProps) {
  return (
    <Grid alignItems="center" justifyContent="space-between" gap="md">
      <Column gap="xs">
        <Typography>
          <Tooltip content={tooltipText} disabled={!tooltipText}>
            <Label cursor="help">{label}</Label>
          </Tooltip>
        </Typography>
        <Column gap="xs">
          <ResponsiveHeadline data-testid={`${field}-amount`}>
            {formatReviewSwapCurrencyAmount(amount)} {currency?.symbol}
          </ResponsiveHeadline>
          {usdAmount && (
            <Typography color="textTertiary">
              {formatNumber(usdAmount, NumberType.FiatTokenQuantity)}
            </Typography>
          )}
        </Column>
      </Column>
      <CurrencyLogo currency={currency} size="36px" />
    </Grid>
  );
}
