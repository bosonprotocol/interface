import { useMemo } from "react";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import CurrencyIcon from "./CurrencyIcon";
import { useConvertedPrice } from "./useConvertedPrice";

const Root = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const CurrencyIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
  convert?: boolean;
  isExchange?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  address: string;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  convert = false,
  isExchange = false,
  tag = "h4",
  address,
  ...rest
}: IProps) {
  const price = useConvertedPrice({ value, decimals });

  const convertedPrice = useMemo(
    () =>
      convert &&
      price && (
        <small style={{ marginLeft: isExchange ? "-1rem" : "0" }}>
          {"   "}
          <span style={{ color: "#556072", opacity: "0.5" }}>
            {CONFIG.defaultCurrency.symbol}
          </span>{" "}
          {price?.converted}
        </small>
      ),
    [convert, price, isExchange]
  );

  return (
    <Root {...rest} data-testid="price">
      <CurrencyIconContainer>
        <CurrencyIcon currencySymbol={currencySymbol} address={address} />
      </CurrencyIconContainer>
      {price ? (
        <Grid
          alignItems="baseline"
          justifyContent="flex-start"
          flexDirection={isExchange ? "column" : "row"}
        >
          <Typography
            tag={tag}
            style={{ fontWeight: "600", letterSpacing: "-1px", margin: "0" }}
          >
            {price.fractions === "0"
              ? price.integer
              : `${price.integer}.${price.fractions}`}
          </Typography>
          {convertedPrice}
        </Grid>
      ) : (
        "-"
      )}
    </Root>
  );
}
