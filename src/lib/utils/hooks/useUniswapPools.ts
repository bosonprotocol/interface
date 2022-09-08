import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../../lib/types/offer";

const UNISWAP_API_URL =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const poolsQuery = gql`
  query GetPools($token0: String, $token1: String) {
    pools(
      where: {
        token0_: { symbol_contains_nocase: $token0 }
        token1_: { symbol_contains_nocase: $token1 }
      }
      orderBy: volumeUSD
      orderDirection: desc
    ) {
      token0 {
        symbol
      }
      token0Price
      token1 {
        symbol
      }
      token1Price
    }
  }
`;

interface QueryProps {
  query: string;
  variables: {
    token0: string;
    token1: string;
  };
}
function generateQuery(tokens: Props["tokens"]): QueryProps[] | [] {
  return tokens && tokens.length
    ? tokens?.flatMap((token) => ({
        query: poolsQuery,
        variables: {
          token0: token.symbol === "ETH" ? "USDC" : token.symbol,
          token1: token.symbol === "ETH" ? token.symbol : "USDC"
        }
      }))
    : [];
}
interface Props {
  tokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
}
interface PromiseProps {
  pools: Array<IPool>;
}
export interface IPool {
  token0: {
    symbol: string;
  };
  token0Price: string;
  token1: {
    symbol: string;
  };
  token1Price: string;
}

export function useUniswapPools({ tokens }: Props) {
  const isDev = process.env.NODE_ENV === "development";
  const queries = generateQuery(tokens);

  return useQuery(
    ["pools"],
    async () => {
      const queriesPromises = queries.map(
        async ({ query, variables }: QueryProps) =>
          await request(UNISWAP_API_URL, query, variables)
      );
      const pools = await Promise.all(queriesPromises);
      return pools?.flatMap((p: PromiseProps) => p?.pools) || [];
    },
    {
      enabled: !!queries.length && !isDev
    }
  );
}
