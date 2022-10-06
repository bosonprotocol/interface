import { BaseIpfsStorage } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";
import { useState } from "react";
import { useSignTypedData } from "wagmi";

import { useIpfsStorage } from "../../useIpfsStorage";
import { broadcastRequest } from "../broadcast/broadcast";
import { signedTypeData } from "../ethers";
import { fetchLens } from "../fetchLens";
import {
  CreatePublicSetProfileMetadataUriRequest,
  CreateSetProfileMetadataViaDispatcherDocument
} from "../graphql/generated";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getLensProfile } from "./useGetLensProfile";

type SignTypedDataAsync = ReturnType<
  typeof useSignTypedData
>["signTypedDataAsync"];

type Params = Parameters<typeof setProfileMetadata>[0];

type Props = Params;

export default function useSetLensProfileMetadata(
  props: Props,
  options: {
    enabled?: boolean;
    accessToken: string;
  }
) {
  const { signTypedDataAsync } = useSignTypedData();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enabled, accessToken } = options;
  const storage = useIpfsStorage();
  const [data, setData] = useState<Awaited<
    ReturnType<typeof setProfileMetadata>
  > | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  // TODO: investigate why useSetLensProfileMetadata doesnt work well when used with useQuery
  return {
    refetch: () => {
      (async () => {
        setLoading(true);
        setData(null);
        setError(null);

        try {
          const result = await setProfileMetadata(props, {
            signTypedDataAsync,
            storage,
            accessToken
          });

          setData(result);
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      })();
    },
    isSuccess: !!data,
    data,
    error,
    isLoading: loading,
    isError: !!error
  };

  // return useQuery(
  //   ["set-lens-profile-metadata", props],
  //   async () => {
  //     console.log("[metadata - in progress] setMetadata!");

  //     const result = await setProfileMetadata(props, {
  //       signTypedDataAsync,
  //       storage,
  //       accessToken
  //     });
  //     console.log("[metadata - finished] setMetadata! ");
  //     return result;
  //   },
  //   {
  //     enabled
  //   }
  // );
}

async function createSetProfileMetadataTypedData(
  request: CreatePublicSetProfileMetadataUriRequest,
  accessToken: string
) {
  const query = gql`
    mutation createSetProfileMetadataTypedData(
      $request: CreatePublicSetProfileMetadataURIRequest!
    ) {
      createSetProfileMetadataTypedData(request: $request) {
        id
        expiresAt
        typedData {
          types {
            SetProfileMetadataURIWithSig {
              name
              type
            }
          }
          domain {
            name
            chainId
            version
            verifyingContract
          }
          value {
            nonce
            deadline
            profileId
            metadata
          }
        }
      }
    }
  `;
  const result = await fetchLens<any>(
    query,
    { request },
    { "x-access-token": accessToken }
  );
  return result.createSetProfileMetadataTypedData;
}

const signCreateSetProfileMetadataTypedData = async (
  request: CreatePublicSetProfileMetadataUriRequest,
  signTypedDataAsync: SignTypedDataAsync,
  accessToken: string
) => {
  const result = await createSetProfileMetadataTypedData(request, accessToken);

  const typedData = result.typedData;

  const signature = await signedTypeData(
    signTypedDataAsync,
    typedData.domain,
    typedData.types,
    typedData.value
  );

  return { result, signature };
};

async function createSetProfileMetadataViaDispatcherRequest(
  request: CreatePublicSetProfileMetadataUriRequest
) {
  return (
    await fetchLens<any>(CreateSetProfileMetadataViaDispatcherDocument, {
      request
    })
  ).createSetProfileMetadataViaDispatcher;
}

const setMetadata = async (
  createMetadataRequest: CreatePublicSetProfileMetadataUriRequest,
  {
    signTypedDataAsync,
    accessToken
  }: {
    signTypedDataAsync: SignTypedDataAsync;
    accessToken: string;
  }
) => {
  const profileResult = await getLensProfile({
    profileId: createMetadataRequest.profileId
  });
  if (!profileResult) {
    throw new Error("Could not find profile");
  }

  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult.dispatcher?.canUseRelay) {
    const dispatcherResult = await createSetProfileMetadataViaDispatcherRequest(
      createMetadataRequest
    );

    if (dispatcherResult.__typename !== "RelayerResult") {
      console.error(
        "create profile metadata via dispatcher: failed",
        dispatcherResult
      );
      throw new Error("create profile metadata via dispatcher: failed");
    }

    return { txHash: dispatcherResult.txHash, txId: dispatcherResult.txId };
  } else {
    const signedResult = await signCreateSetProfileMetadataTypedData(
      createMetadataRequest,
      signTypedDataAsync,
      accessToken
    );

    const broadcastResult = await broadcastRequest(
      {
        id: signedResult.result.id,
        signature: signedResult.signature
      },
      { accessToken }
    );

    if (broadcastResult.reason) {
      console.error(
        "create profile metadata via broadcast: failed",
        broadcastResult
      );
      throw new Error("create profile metadata via broadcast: failed");
    }

    return { txHash: broadcastResult.txHash, txId: broadcastResult.txId };
  }
};

const setProfileMetadata = async (
  args: {
    profileId: string;
    name: string;
    bio: string;
    cover_picture: string;
    attributes: {
      traitType: string;
      value: string;
      key: string;
    }[];
    version: string;
    metadata_id: string;
  },
  {
    signTypedDataAsync,
    storage,
    accessToken
  }: {
    signTypedDataAsync: SignTypedDataAsync;
    storage: BaseIpfsStorage;
    accessToken: string;
  }
) => {
  const cid = await storage.add(JSON.stringify(args));

  const createProfileMetadataRequest = {
    profileId: args.profileId,
    metadata: "ipfs://" + cid
  };

  const result = await setMetadata(createProfileMetadataRequest, {
    signTypedDataAsync,
    accessToken
  });

  await pollUntilIndexed({ txId: result.txId }, { accessToken });
  return result;
};
