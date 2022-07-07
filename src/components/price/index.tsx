import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";
import { convertPrice, IPrice } from "../../lib/utils/convertPrice";
import Typography from "../ui/Typography";
import CurrencyIcon from "./CurrencyIcon";

const Root = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const CurrencyIconContainer = styled.div`
  img {
    height: 25px;
    width: 25px;
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
  convert?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  convert = false,
  tag = "h4",
  ...rest
}: IProps) {
  const [price, setPrice] = useState<IPrice | null>(null);

  const getConvertedPrice = useCallback(async () => {
    const newPrice = await convertPrice(
      value,
      decimals,
      CONFIG.defaultCurrency
    );
    setPrice(newPrice);
  }, [value, decimals]);

  useEffect(() => {
    getConvertedPrice();
    const interval = setInterval(() => {
      getConvertedPrice();
    }, 1000 * 60); // It will update USD price every minute;
    return () => clearInterval(interval);
  }, [getConvertedPrice]);

  return (
    <Root {...rest} data-testid="price">
      <CurrencyIconContainer>
        <CurrencyIcon currencySymbol={currencySymbol} />
      </CurrencyIconContainer>
      {price ? (
        <Typography
          tag={tag}
          style={{ margin: "0", fontWeight: "600", letterSpacing: "-1px" }}
        >
          {price.fractions === "0"
            ? price.integer
            : `${price.integer}.${price.fractions}`}
          {convert && (
            <small>
              {" "}
              {price.converted} {CONFIG.defaultCurrency}
            </small>
          )}
        </Typography>
      ) : (
        "-"
      )}
    </Root>
  );
}
