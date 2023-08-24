import * as Sentry from "@sentry/browser";
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
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    throw error;
  }
}
