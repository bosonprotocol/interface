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
    console.log("pool until indexed: result", response);

    if (response.__typename === "TransactionIndexedResult") {
      console.log("pool until indexed: indexed", response.indexed);
      console.log(
        "pool until metadataStatus: metadataStatus",
        response.metadataStatus
      );

      console.log(response.metadataStatus);
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

      console.log(
        "pool until indexed: sleep for 1500 milliseconds then try again"
      );
      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};
