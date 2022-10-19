/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from "@wagmi/core";
import { ethers } from "ethers";
import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount, useProvider } from "wagmi";

import {
  getLensTokenIdDecimal,
  getLensTokenIdHex
} from "../../../../../components/modal/components/CreateProfile/Lens/utils";
import { poll } from "../../../../../pages/create-product/utils";
import { CONFIG } from "../../../../config";
import { fetchRawLens } from "../fetchLens";
import { Profile } from "../graphql/generated";
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
  const { address = "" } = useAccount();
  const provider = useProvider();
  return useQuery(
    ["claim-handle", props],
    async () => {
      return await claimHandle(props, {
        accessToken,
        address,
        provider
      });
    },
    {
      enabled,
      retry: false
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
  try {
    const { data, errors } = await fetchRawLens<{
      claim:
        | { txHash: string; __typename: "RelayerResult" }
        | { reason: string; __typename: "RelayError" };
    }>(query, { handle: request.handle }, { "x-access-token": accessToken });

    const hasError = errors && errors.length;
    const isCanNotFreeTextError = hasError
      ? !!errors.find((error) => error.message === "CAN_NOT_FREE_TEXT")
      : false;
    if (hasError && !isCanNotFreeTextError) {
      throw new Error(errors[0].message);
    }
    return { data, isCanNotFreeTextError };
  } catch (error) {
    const errors =
      (error as { response: { data: null; errors: { message: string }[] } })
        ?.response?.errors || [];
    const hasError = errors && errors.length;
    const isCanNotFreeTextError = hasError
      ? !!errors.find((error) => error.message === "CAN_NOT_FREE_TEXT")
      : false;
    if (hasError && !isCanNotFreeTextError) {
      throw error;
    }

    return { data: null, isCanNotFreeTextError };
  }
}

async function claimHandle(
  request: ClaimHandleRequest,
  {
    accessToken,
    address,
    provider
  }: { accessToken: string; address: string; provider: Provider }
) {
  const blockNumber = await provider.getBlockNumber();
  const { data, isCanNotFreeTextError } = await claimHandleRequest(request, {
    accessToken
  });
  if (isCanNotFreeTextError) {
    const contract = new ethers.Contract(
      CONFIG.lens.LENS_PROFILES_CONTRACT_ADDRESS || "",
      CONFIG.lens.LENS_PROFILES_CONTRACT_PARTIAL_ABI || "",
      provider
    );
    const filter = contract.filters.Transfer(
      ethers.constants.AddressZero,
      address
    ); // mint action: from 0x0000000..000 to <USER_ACCOUNT>
    let profile: Profile | null = null;
    await poll(
      async () => {
        try {
          const events = await contract.queryFilter(filter, blockNumber);
          console.log("[useClaimHandle] events in polling", events);
          if (!events.length) {
            return false;
          }
          const tokenId = events[events.length - 1].args?.tokenId;
          profile = await getLensProfile({
            // to make sure we have an odd number of digits (otherwise it'll fail)
            profileId: getLensTokenIdHex(getLensTokenIdDecimal(tokenId))
          });
          return profile;
        } catch (error) {
          console.error("error while polling in useClaimHandle", error);
          return true;
        }
      },
      (profile) => {
        return !profile;
      },
      500
    );
    return (profile as unknown as Profile)?.id || "";
  } else {
    const claimHandleResult = (data as any)?.claim;
    if (claimHandleResult.__typename === "RelayError") {
      console.error("claim handle: failed", claimHandleResult);
      throw new Error(
        claimHandleResult.reason ||
          "There has been an error while claiming your handle"
      );
    }

    await pollUntilIndexed(
      { txHash: claimHandleResult.txHash },
      { accessToken }
    );

    const profile = await getLensProfile({
      handle: `${request.handle.trim()}${CONFIG.lens.lensHandleExtension}`
    });
    return profile.id;
  }
}
