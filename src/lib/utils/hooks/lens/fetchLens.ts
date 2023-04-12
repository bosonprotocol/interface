import * as Sentry from "@sentry/browser";
import { GraphQLError } from "graphql";
import request, { rawRequest, RequestDocument } from "graphql-request";
import { Headers } from "graphql-request/dist/types.dom";

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

export async function fetchRawLens<T, V = Record<string, unknown>>(
  query: string,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<{
  data: T;
  extensions?: unknown;
  headers: Headers;
  errors?: GraphQLError[];
  status: number;
}> {
  try {
    const response = await rawRequest<T, V>(
      CONFIG.lens.apiLink || "",
      query,
      variables,
      {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    throw error;
  }
}
