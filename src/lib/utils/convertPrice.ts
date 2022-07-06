import { BigNumber, utils } from "ethers";

type Currency = "USD" | "PLN" | string;

export const convertPrice = async (
  value: string,
  decimals: string,
  currency: Currency
) => {
  return new Promise((resolve) => {
    const price = utils.formatUnits(BigNumber.from(value), Number(decimals));
    const [integer, fractions] = price.split(".");

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${currency}`
    )
      .then((response) => response.json())
      .then((data) =>
        resolve({
          price,
          integer,
          fractions,
          converted: (Number(data[`${currency}`]) * Number(price)).toFixed(2)
        })
      );
  });
};
