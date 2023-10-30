import { RateProps } from "../../components/convertion-rate/utils";
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
interface Props {
  price: string | null;
  symbol: string;
  currency: Currency;
  rates: Array<RateProps>;
  fixed: number;
}

export const convertPrice = ({
  price,
  symbol,
  currency,
  rates,
  fixed = 2
}: Props): IPricePassedAsAProp => {
  const conversionRate =
    rates && rates.length
      ? rates?.find((f: RateProps) => (f.to || "").includes(symbol))?.value
      : false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [integer, fractions] = price!.split(".");
  return {
    integer,
    fractions,
    converted: conversionRate
      ? (Number(conversionRate || 1) * Number(price)).toFixed(fixed)
      : null,
    currency
  };
};
