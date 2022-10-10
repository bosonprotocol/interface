/* eslint-disable @typescript-eslint/no-explicit-any */
// inspired by from https://github.dev/lens-protocol/api-examples/blob/master/src/indexer/has-transaction-been-indexed.ts

import { fetchLens } from "../fetchLens";
import {
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedRequest
} from "../graphql/generated";

const hasTxBeenIndexed = async (
  request: HasTxHashBeenIndexedRequest,
  { accessToken }: { accessToken: string }
) => {
  const result = await fetchLens<any>( // TODO: change any
    HasTxHashBeenIndexedDocument,
    {
      request
    },
    { "x-access-token": accessToken }
    // fetchPolicy: "network-only"
  );

  return result.hasTxHashBeenIndexed;
};

export const pollUntilIndexed = async (
  input: { txHash: string } | { txId: string },
  { accessToken }: { accessToken: string }
) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await hasTxBeenIndexed(input, { accessToken });

    if (response.__typename === "TransactionIndexedResult") {
      if (response.metadataStatus) {
        if (response.metadataStatus.status === "SUCCESS") {
          return response;
        }

        if (response.metadataStatus.status === "METADATA_VALIDATION_FAILED") {
          throw new Error(response.metadataStatus.status);
        }
      } else {
        if (response.indexed) {
          return response;
        }
      }
      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};
