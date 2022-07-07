import { BigNumber, utils } from "ethers";

type Currency = "USD" | "PLN" | string;

export interface IPrice {
  price: string;
  integer: string;
  fractions: string;
  converted: string;
}

export const convertPrice = async (
  value: string,
  decimals: string,
  currency: Currency
): Promise<IPrice | null> => {
  return new Promise((resolve) => {
    let price = "";

    try {
      price = utils.formatUnits(BigNumber.from(value), Number(decimals));
    } catch (e) {
      console.error(e);
      return null;
    }

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${currency}`
    )
      .then((response) => response.json())
      .then((data) => {
        const [integer, fractions] = price.split(".");
        resolve({
          price,
          integer,
          fractions,
          converted: (Number(data[`${currency}`]) * Number(price)).toFixed(2)
        });
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  });
};
