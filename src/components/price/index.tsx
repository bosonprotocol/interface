import { BigNumber, utils } from "ethers";
import styled from "styled-components";

import Typography from "../ui/Typography";
import CurrencyIcon from "./CurrencyIcon";

const Root = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const CurrencyIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 25px;
    width: 25px;
  }
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
  address: string;
}

export default function Price({
  value,
  decimals,
  currencySymbol,
  address,
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
        <CurrencyIcon currencySymbol={currencySymbol} address={address} />
      </CurrencyIconContainer>
      {formattedValue ? (
        <Typography
          tag="h4"
          style={{ margin: "0", fontWeight: "600", letterSpacing: "-1px" }}
        >
          {fractions === "0" ? integer : `${integer}.${fractions}`}
        </Typography>
      ) : (
        "-"
      )}{" "}
    </Root>
  );
}
