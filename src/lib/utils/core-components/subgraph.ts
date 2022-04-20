import { request } from "graphql-request";

export async function fetchSubgraph<T>(
  subgraphUrl: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const data = await request(subgraphUrl, query, variables);
  return data as T;
}
