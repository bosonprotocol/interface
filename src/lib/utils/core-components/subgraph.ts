import { CONFIG } from "@lib/config";
import { request } from "graphql-request";

export async function fetchSubgraph<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: {
    subgraphUrl: string;
  }
): Promise<T> {
  try {
    const data = await request(
      options?.subgraphUrl || CONFIG.subgraphUrl,
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
