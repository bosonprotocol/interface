import { Offer } from "../../lib/types/offer";
import { IPool } from "../../lib/utils/hooks/useUniswapPools";

export interface RateProps {
  to: string;
  from: string;
  value: number;
}
interface RatePools {
  all: Array<IPool>;
  boson: Array<IPool>;
}
export function handleRates(
  data: RatePools,
  tokens: Pick<Offer["exchangeToken"], "address" | "symbol">[]
): Array<RateProps> {
  const allRates = (
    data?.all?.map((d: IPool) => {
      const swapTokens = (d?.token0?.symbol || "")
        .toLowerCase()
        .startsWith("usd");
      const token0 = swapTokens ? d?.token1?.symbol : d?.token0?.symbol;
      const token1 = swapTokens ? d?.token0?.symbol : d?.token1?.symbol;
      const value = swapTokens
        ? Number(d?.token0Price)
        : Number(d?.token1Price);

      if (value === 0) {
        return null;
      }

      return {
        to: token0,
        from: token1,
        value
      };
    }) || []
  ).filter((n) => n !== null) as RateProps[];

  const bosonToEth =
    data?.boson?.find((d: IPool) => d?.token0?.symbol === "WETH") || null;
  const ethToUsd =
    data?.boson?.find((d: IPool) => d?.token0?.symbol === "USDC") || null;

  const bosonRate = {
    to: "BOSON",
    from: "USDC",
    value:
      Number(bosonToEth?.token0Price || 0) * Number(ethToUsd?.token0Price || 0)
  };

  const filteredRates = tokens?.map(
    (t: Pick<Offer["exchangeToken"], "address" | "symbol">) => {
      return allRates?.find((d: RateProps) => d?.to === t?.symbol) || null;
    }
  );

  return [...filteredRates, bosonRate].filter((n) => n !== null) as RateProps[];
}
