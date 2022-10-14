/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { useSignTypedData } from "wagmi";

import { WithRequired } from "../../../../types/helpers";
import { broadcastRequest } from "../broadcast/broadcast";
import { signedTypeData, SignTypedDataAsync } from "../ethers";
import { fetchLens } from "../fetchLens";
import {
  CreateSetProfileImageUriTypedDataDocument,
  CreateSetProfileImageUriViaDispatcherDocument,
  UpdateProfileImageRequest
} from "../graphql/generated";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getLensProfile } from "./useGetLensProfile";

type Props = Parameters<typeof setProfileImageUri>[0];

export default function useSetProfileImageUri(
  props: Props,
  options: {
    enabled?: boolean;
    accessToken: string;
  }
) {
  const { signTypedDataAsync } = useSignTypedData();

  const { enabled, accessToken } = options;
  return useQuery(
    ["set-profile-image-uri", props],
    async () => {
      return await setProfileImageUri(props, {
        accessToken,
        signTypedDataAsync
      });
    },
    {
      enabled
    }
  );
}

async function createSetProfileUriViaDispatcherRequest(
  request: UpdateProfileImageRequest,
  { accessToken }: { accessToken: string }
) {
  return (
    (await fetchLens(
      CreateSetProfileImageUriViaDispatcherDocument,
      { request },
      { "x-access-token": accessToken }
      // TODO: change any
    )) as any
  ).createSetProfileImageURIViaDispatcher;
}

const createSetProfileImageUriTypedData = async (
  request: UpdateProfileImageRequest,
  { accessToken }: { accessToken: string }
) => {
  return (
    (await fetchLens(
      CreateSetProfileImageUriTypedDataDocument,
      { request },
      { "x-access-token": accessToken }
      // TODO: change any
    )) as any
  ).createSetProfileImageURITypedData;
};

const signCreateSetProfileImageUriTypedData = async (
  request: UpdateProfileImageRequest,
  {
    accessToken,
    signTypedDataAsync
  }: { accessToken: string; signTypedDataAsync: SignTypedDataAsync }
) => {
  const result = await createSetProfileImageUriTypedData(request, {
    accessToken
  });
  console.log(
    "set profile image uri: createSetProfileImageUriTypedData",
    result
  );

  const typedData = result.typedData;
  console.log("set profile image uri: typedData", typedData);

  const signature = await signedTypeData(
    signTypedDataAsync,
    typedData.domain,
    typedData.types,
    typedData.value
  );
  console.log("set profile image uri: signature", signature);

  return { result, signature };
};

const setProfileImage = async (
  createProfileImageRequest: UpdateProfileImageRequest,
  {
    accessToken,
    signTypedDataAsync
  }: { accessToken: string; signTypedDataAsync: SignTypedDataAsync }
) => {
  const profileResult = await getLensProfile({
    profileId: createProfileImageRequest.profileId
  });
  if (!profileResult) {
    throw new Error("Could not find profile");
  }

  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult.dispatcher?.canUseRelay) {
    const dispatcherResult = await createSetProfileUriViaDispatcherRequest(
      createProfileImageRequest,
      { accessToken }
    );
    console.log(
      "set profile image url via dispatcher: createPostViaDispatcherRequest",
      dispatcherResult
    );

    if (dispatcherResult.__typename !== "RelayerResult") {
      console.error(
        "set profile image url via dispatcher: failed",
        dispatcherResult
      );
      throw new Error("set profile image url via dispatcher: failed");
    }

    return { txHash: dispatcherResult.txHash, txId: dispatcherResult.txId };
  } else {
    const signedResult = await signCreateSetProfileImageUriTypedData(
      createProfileImageRequest,
      { signTypedDataAsync, accessToken }
    );
    console.log(
      "set profile image url via broadcast: signedResult",
      signedResult
    );

    const broadcastResult = await broadcastRequest(
      {
        id: signedResult.result.id,
        signature: signedResult.signature
      },
      { accessToken }
    );

    if (broadcastResult.__typename !== "RelayerResult") {
      console.error(
        "set profile image url via broadcast: failed",
        broadcastResult
      );
      throw new Error("set profile image url via broadcast: failed");
    }

    console.log(
      "set profile image url via broadcast: broadcastResult",
      broadcastResult
    );
    return { txHash: broadcastResult.txHash, txId: broadcastResult.txId };
  }
};

async function setProfileImageUri(
  request: WithRequired<UpdateProfileImageRequest, "url">,
  {
    accessToken,
    signTypedDataAsync
  }: { accessToken: string; signTypedDataAsync: SignTypedDataAsync }
) {
  // hard coded to make the code example clear
  const setProfileImageUriRequestPayload = {
    profileId: request["profileId"],
    url: request["url"]
  };

  const result = await setProfileImage(setProfileImageUriRequestPayload, {
    accessToken,
    signTypedDataAsync
  });
  console.log("set profile image url gasless", result);

  console.log("set profile image url: poll until indexed");
  const indexedResult = await pollUntilIndexed(
    { txId: result.txId },
    { accessToken }
  );

  console.log("set profile image url: profile has been indexed", result);

  const logs = indexedResult.txReceipt!.logs;

  console.log("set profile image url: logs", logs);
  return true;
}
