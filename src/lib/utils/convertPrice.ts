interface Currency {
  ticker: "USD" | string;
  symbol: "$" | string;
}

export interface IPricePassedAsAProp {
  integer: string;
  fractions: string;
  converted: string | null;
  currency: Currency;
}

export interface IPrice {
  price: string | null;
  integer?: string;
  fractions?: string;
  converted?: string | null;
  currency?: Currency;
}

export const convertPrice = async (
  price: string | null,
  priceSymbol: string,
  currency: Currency
): Promise<IPricePassedAsAProp | null> => {
  return new Promise((resolve) => {
    // TODO: change that
    fetch(
      `https://api.exchangerate.host/convert?from=${priceSymbol}&to=${currency.ticker}&source=crypto`
    )
      .then((response) => response.json())
      .then((data) => {
        const conversionRate = data.result;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [integer, fractions] = price!.split(".");
        resolve({
          integer,
          fractions,
          converted:
            conversionRate === null
              ? null
              : (Number(conversionRate) * Number(price)).toFixed(2),
          currency
        });
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  });
};
