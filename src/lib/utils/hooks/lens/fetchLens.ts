import * as Sentry from "@sentry/browser";
import request, { RequestDocument } from "graphql-request";

export async function fetchLens<T, V = Record<string, unknown>>(
  lensApiLink: string,
  document: RequestDocument,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<T | null> {
  try {
    const data = await request<T, V>(lensApiLink, document, variables, {
      ...headers,
      Accept: "application/json",
      "Content-Type": "application/json"
    });
    return data;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
  return null;
}
