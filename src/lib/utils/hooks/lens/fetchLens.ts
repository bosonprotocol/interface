import request, { RequestDocument } from "graphql-request";

export async function fetchLens<T, V = Record<string, unknown>>(
  document: RequestDocument,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await request<T, V>(
      "https://api-mumbai.lens.dev", // TODO: change depending on chain
      document,
      variables,
      {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
