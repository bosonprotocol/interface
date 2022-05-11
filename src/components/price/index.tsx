import { BigNumber, utils } from "ethers";
import styled from "styled-components";

import bosonIcon from "./images/boson.svg";
import daiIcon from "./images/dai.svg";
import ethIcon from "./images/eth-icon.svg";

const Root = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const CurrencyIcon = styled.div`
  height: 25px;
  width: 25px;
`;

const Image = styled.img`
  height: 25px;
  width: 25px;
`;

interface IProps {
  value: string;
  decimals: string;
  currencySymbol: string;
}

const currencyImages = {
  DAI: daiIcon,
  BOSON: bosonIcon,
  ETH: ethIcon
};

export default function Price({
  value,
  decimals,
  currencySymbol,
  ...rest
}: IProps) {
  const symbolUpperCase =
    currencySymbol.toUpperCase() as keyof typeof currencyImages;

  let formattedValue = "";
  try {
    formattedValue = utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (error) {
    console.error(error);
  }
  const [integer, fractions] = formattedValue.split(".");

  return (
    <Root {...rest} data-testid="price">
      {currencyImages[symbolUpperCase] && (
        <CurrencyIcon>
          <Image src={currencyImages[symbolUpperCase]} alt="currency icon" />
        </CurrencyIcon>
      )}
      {formattedValue ? (
        <span>{fractions === "0" ? integer : `${integer}.${fractions}`}</span>
      ) : (
        "-"
      )}{" "}
      <span>{symbolUpperCase}</span>
    </Root>
  );
}
