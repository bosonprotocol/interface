import { request } from "graphql-request";

const offersGraphqlEndpoint = process.env
  .REACT_APP_SUBGRAPH_OFFERS_GRAPHQL_ENDPOINT as string;

export async function fetchSubgraph<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: {
    subgraphUrl: string;
  }
): Promise<T> {
  try {
    const data = await request(
      options?.subgraphUrl || offersGraphqlEndpoint,
      query,
      variables,
      {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    );
    return data as T;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
