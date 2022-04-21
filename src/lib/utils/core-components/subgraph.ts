import { request } from "graphql-request";

export async function fetchSubgraph<T>(
  subgraphUrl: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await request(subgraphUrl, query, variables, {
      Accept: "application/json",
      "Content-Type": "application/json"
    });
    return data as T;
  } catch (err) {
    console.error(err);
  }
  return null as unknown as T;
}
