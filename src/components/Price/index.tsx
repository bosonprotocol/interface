import { utils } from "ethers";
import styled from "styled-components";

import bosonIcon from "./images/boson.svg";
import daiIcon from "./images/dai.svg";
import ethIcon from "./images/eth-icon.svg";

const Root = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const EthIcon = styled.div`
  height: 25px;
  width: 25px;
`;

const Image = styled.img`
  height: 25px;
  width: 25px;
`;

interface IProps {
  weiValue: string;
  currencySymbol: string;
}

const Price = ({ weiValue, currencySymbol, ...rest }: IProps) => {
  const currencyImages: Record<string, string> = {
    DAI: daiIcon,
    BOSON: bosonIcon,
    ETH: ethIcon
  };

  const symbolUpperCase = currencySymbol.toUpperCase();
  const formattedValue = utils.formatEther(weiValue);
  const [integer, fractions] = formattedValue.split(".");

  return (
    <Root {...rest}>
      <EthIcon>
        <Image src={currencyImages[symbolUpperCase]} alt="currency icon" />
      </EthIcon>
      <span>{fractions === "0" ? integer : `${integer}.${fractions}`}</span>{" "}
      <span>{symbolUpperCase}</span>
    </Root>
  );
};

export default Price;
