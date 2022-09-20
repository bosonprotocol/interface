import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import { useState } from "react";
import styled, { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import ConvertedPrice from "./ConvertedPrice";
import { useConvertedPrice } from "./useConvertedPrice";

const Root = styled.div<{ $withBosonStyles: boolean }>`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  ${({ $withBosonStyles }) =>
    $withBosonStyles
      ? css`
          color: ${colors.black};
        `
      : ""}
  h3,
  h4 {
    padding-left: 2.5rem;
    ${breakpoint.m} {
      padding-left: 2rem;
    }
    position: relative;
  }

  *[data-currency] {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%) scale(0.75) rotate(-90deg);
    ${breakpoint.m} {
      transform: translate(-0.375rem, -50%) scale(0.75) rotate(-90deg);
    }
  }
  svg {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%) scale(1.25);
    ${breakpoint.m} {
      transform: translate(0, -50%) scale(1.5);
    }
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
  convert?: boolean;
  isExchange?: boolean;
  withBosonStyles?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  convert = false,
  isExchange = false,
  tag = "h4",
  withBosonStyles = false,
  ...rest
}: IProps) {
  const [isSymbolShown] = useState<boolean>(false); // TODO: remove once CSS :has is supported
  const price = useConvertedPrice({
    value,
    decimals,
    symbol: currencySymbol
  });

  return (
    <Root {...rest} $withBosonStyles={withBosonStyles} data-testid="price">
      {price ? (
        <Grid
          alignItems="baseline"
          justifyContent="flex-start"
          flexDirection={isExchange ? "column" : "row"}
        >
          <Typography
            tag={tag}
            style={{ fontWeight: "600", letterSpacing: "-1px", margin: "0" }}
            data-icon-price
            {...(isSymbolShown && { "data-with-symbol": true })}
          >
            <CurrencyDisplay
              currency={currencySymbol as Currencies}
              height={18}
            />
            {price?.currency ? (
              <>
                {price.fractions === "0"
                  ? price.integer
                  : `${price.integer}.${price.fractions}`}
              </>
            ) : (
              price.price
            )}
          </Typography>
          {convert && price?.currency && (
            <ConvertedPrice price={price} isExchange={isExchange} />
          )}
        </Grid>
      ) : (
        "-"
      )}
    </Root>
  );
}
