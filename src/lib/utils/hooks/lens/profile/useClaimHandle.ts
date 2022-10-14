/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getLensProfile } from "./useGetLensProfile";

type ClaimHandleRequest = {
  handle: string;
};

type Props = Parameters<typeof claimHandle>[0];

export default function useClaimHandle(
  props: Props,
  options: {
    enabled?: boolean;
    accessToken: string;
  }
) {
  const { enabled, accessToken } = options;
  return useQuery(
    ["claim-handle", props],
    async () => {
      return await claimHandle(props, { accessToken });
    },
    {
      enabled
    }
  );
}

async function claimHandleRequest(
  request: ClaimHandleRequest,
  { accessToken }: { accessToken: string }
) {
  const query = gql`
    mutation ClaimHandle($handle: CreateHandle) {
      claim(request: { freeTextHandle: $handle }) {
        ... on RelayerResult {
          txHash
        }
        ... on RelayError {
          reason
        }
        __typename
      }
    }
  `;
  return (
    (await fetchLens(
      query,
      { handle: request.handle },
      { "x-access-token": accessToken }
      // TODO: change any
    )) as any
  ).claimHandle;
}

async function claimHandle(
  request: ClaimHandleRequest,
  { accessToken }: { accessToken: string }
) {
  const claimHandleResult = await claimHandleRequest(request, {
    accessToken
  });

  if (claimHandleResult.__typename === "RelayError") {
    console.error("claim handle: failed", claimHandleResult);
    throw new Error(
      claimHandleResult.reason ||
        "There has been an error while claiming your handle"
    );
  }

  await pollUntilIndexed({ txHash: claimHandleResult.txHash }, { accessToken });

  const profile = await getLensProfile({
    handle: request.handle
  });
  return profile.id;
}
