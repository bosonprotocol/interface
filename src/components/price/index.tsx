import styled from "styled-components";

import { CONFIG } from "../../lib/config";
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
  tag?: keyof JSX.IntrinsicElements;
  address: string;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  convert = false,
  tag = "h4",
  address,
  ...rest
}: IProps) {
  const price = useConvertedPrice({ value, decimals });

  return (
    <Root {...rest} data-testid="price">
      <CurrencyIconContainer>
        <CurrencyIcon currencySymbol={currencySymbol} address={address} />
      </CurrencyIconContainer>
      {price ? (
        <Typography
          tag="div"
          style={{ margin: "0", display: "flex", alignItems: "end" }}
        >
          <Typography
            tag={tag}
            style={{ fontWeight: "600", letterSpacing: "-1px", margin: "0" }}
          >
            {price.fractions === "0"
              ? price.integer
              : `${price.integer}.${price.fractions}`}
          </Typography>
          {convert && (
            <small style={{ margin: "0 0 0.3rem 0", display: "block" }}>
              {"   "}
              <span style={{ color: "#556072", opacity: "0.5" }}>
                {CONFIG.defaultCurrency.symbol}
              </span>{" "}
              {price.converted}
            </small>
          )}
        </Typography>
      ) : (
        "-"
      )}
    </Root>
  );
}
