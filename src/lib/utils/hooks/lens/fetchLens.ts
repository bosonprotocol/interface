import * as Sentry from "@sentry/browser";
import request, { RequestDocument } from "graphql-request";

import { CONFIG } from "../../../config";

export async function fetchLens<T, V = Record<string, unknown>>(
  document: RequestDocument,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await request<T, V>(
      CONFIG.lens.apiLink || "",
      document,
      variables,
      {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    throw error;
  }
}
