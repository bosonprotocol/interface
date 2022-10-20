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
function generateQuery(
  tokens: Props["tokens"],
  swap: boolean
): QueryProps[] | [] {
  return tokens && tokens.length
    ? tokens?.flatMap((token) => ({
        query: poolsQuery,
        variables: {
          token0: swap ? "USDC" : token.symbol,
          token1: swap ? token.symbol : "USDC"
        }
      }))
    : [];
}
interface Props {
  tokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
}
interface PromiseProps {
  status: string;
  value: {
    pools: Array<IPool>;
  };
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
  const tokensWithoutBoson = tokens?.filter((t) => t.symbol !== "BOSON") || [];
  // TODO BPNO_TASK: change !== to ===
  const isDev = process.env.NODE_ENV !== "development";
  const queries = generateQuery(tokensWithoutBoson, false);
  const swapQueries = generateQuery(tokensWithoutBoson, true);

  const allTokens = useQuery(
    ["pools-all"],
    async () => {
      const allPromises = [...queries, ...swapQueries].map(
        async ({ query, variables }: QueryProps) =>
          await request(UNISWAP_API_URL, query, variables)
      );
      const allPools = await Promise.allSettled(allPromises);
      const response = allPools.filter(
        (res) => res.status === "fulfilled"
      ) as PromiseProps[];

      return response?.flatMap((p: PromiseProps) => p?.value?.pools) || [];
    },
    {
      enabled: !!queries.length && !!swapQueries.length && !isDev
    }
  );

  const bosonToken = useQuery(
    ["pools-boson"],
    async () => {
      const allPromises = [
        {
          query: poolsQuery,
          variables: {
            token0: "WETH",
            token1: "BOSON"
          }
        },
        {
          query: poolsQuery,
          variables: {
            token0: "USDC",
            token1: "WETH"
          }
        }
      ].map(
        async ({ query, variables }: QueryProps) =>
          await request(UNISWAP_API_URL, query, variables)
      );
      const allPools = await Promise.allSettled(allPromises);
      console.log("allPools - boson", allPools);
      const response = allPools.filter(
        (res) => res.status === "fulfilled"
      ) as PromiseProps[];

      return response?.flatMap((p: PromiseProps) => p?.value?.pools) || [];
    },
    {
      enabled: !isDev
    }
  );

  return {
    data: {
      all: allTokens?.data || [],
      boson: bosonToken?.data || []
    },
    isSuccess: allTokens?.data && bosonToken?.data,
    allTokens,
    bosonToken
  };
}
