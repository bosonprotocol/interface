import fetch from "cross-fetch";

import { FetchError } from "./errors";

export type MultiQueryOpts = Partial<{
  first: number;
  skip: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
}>;

export async function fetchSubgraph<T>(
  subgraphUrl: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(subgraphUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    throw new FetchError({
      message: `Failed to fetch: ${response.status} ${response.statusText}`,
      statusCode: response.status,
      statusText: response.statusText
    });
  }

  const body = await response.json();
  const { data = {}, errors = [] } = body || {};

  if (errors.length > 0) {
    throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
  }

  return data as T;
}
