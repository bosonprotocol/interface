import { BigNumber, utils } from "ethers";
import styled from "styled-components";

import CurrencyIcon from "./CurrencyIcon";

const Root = styled.div`
  display: flex;
  gap: 5px;
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
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  ...rest
}: IProps) {
  let formattedValue = "";
  try {
    formattedValue = utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (error) {
    console.error(error);
  }
  const [integer, fractions] = formattedValue.split(".");

  return (
    <Root {...rest} data-testid="price">
      <CurrencyIconContainer>
        <CurrencyIcon currencySymbol={currencySymbol} />
      </CurrencyIconContainer>
      {formattedValue ? (
        <span>{fractions === "0" ? integer : `${integer}.${fractions}`}</span>
      ) : (
        "-"
      )}{" "}
    </Root>
  );
}
