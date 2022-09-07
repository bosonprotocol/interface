import { IPool } from "../../lib/utils/hooks/useUniswapPools";

export interface RateProps {
  to: string;
  from: string;
  value: number;
}
export function handleRates(data: Array<IPool>): Array<RateProps> {
  return data && data.length
    ? data?.map((d: IPool) => {
        const swapTokens = (d?.token0?.symbol || "")
          .toLowerCase()
          .startsWith("usd");
        const token0 = swapTokens ? d?.token1?.symbol : d?.token0?.symbol;
        const token1 = swapTokens ? d?.token0?.symbol : d?.token1?.symbol;

        return {
          to: token0,
          from: token1,
          value: swapTokens ? Number(d?.token0Price) : Number(d?.token1Price)
        };
      })
    : [];
}
