import { BigNumber, utils } from "ethers";
import styled from "styled-components";

import CryptoCurrency from "./CryptoCurrency";

const Root = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const CurrencyIcon = styled.div`
  img {
    height: 25px;
    width: 25px;
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  ...rest
}: IProps) {
  const symbolUpperCase = currencySymbol.toUpperCase();
  let formattedValue = "";
  try {
    formattedValue = utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (error) {
    console.error(error);
  }
  const [integer, fractions] = formattedValue.split(".");

  return (
    <Root {...rest} data-testid="price">
      <CurrencyIcon>
        <CryptoCurrency currencySymbol={currencySymbol} />
      </CurrencyIcon>
      {formattedValue ? (
        <span>{fractions === "0" ? integer : `${integer}.${fractions}`}</span>
      ) : (
        "-"
      )}{" "}
      <span>{symbolUpperCase}</span>
    </Root>
  );
}
