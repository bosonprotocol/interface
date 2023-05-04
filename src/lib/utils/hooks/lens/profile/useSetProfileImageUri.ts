import * as Sentry from "@sentry/browser";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signer, utils } from "ethers";
import { useMutation } from "react-query";
import { useSigner, useSignTypedData } from "wagmi";

import { WithRequired } from "../../../../types/helpers";
import { useLensLogin } from "../authentication/useLensLogin";
import { broadcastRequest } from "../broadcast/broadcast";
import { signedTypeData, SignTypedDataAsync } from "../ethers";
import { fetchLens } from "../fetchLens";
import {
  CreateSetDispatcherTypedDataDocument,
  CreateSetProfileImageUriTypedDataDocument,
  CreateSetProfileImageUriViaDispatcherDocument,
  SetDispatcherRequest,
  UpdateProfileImageRequest
} from "../graphql/generated";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getLensHub } from "../lens-hub";
import { getLensProfile } from "./useGetLensProfile";

type Props = Parameters<typeof setProfileImageUri>[0] & {
  accessToken?: string;
};

export default function useSetProfileImageUri() {
  const { signTypedDataAsync } = useSignTypedData();
  const { data: signer } = useSigner();
  const { mutateAsync: lensLogin } = useLensLogin();
  return useMutation(async (props: Props) => {
    if (!signer) {
      throw new Error("[useSetProfileImageUri] signer is falsy");
    }
    const accessToken = props.accessToken
      ? props.accessToken
      : (
          await lensLogin({
            address: await signer.getAddress()
          })
        ).accessToken;
    return await setProfileImageUri(props, {
      accessToken,
      signTypedDataAsync,
      signer: signer!
    });
  });
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

const enableDispatcherWithTypedData = async (
  request: SetDispatcherRequest,
  { accessToken }: { accessToken: string }
) => {
  return (
    (await fetchLens(
      CreateSetDispatcherTypedDataDocument,
      { request },
      { "x-access-token": accessToken }
      // TODO: change any
    )) as any
  ).createSetDispatcherTypedData;
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

  const typedData = result.typedData;

  const signature = await signedTypeData(
    signTypedDataAsync,
    typedData.domain,
    typedData.types,
    typedData.value
  );

  return { result, signature };
};

const setProfileImage = async (
  createProfileImageRequest: UpdateProfileImageRequest,
  {
    accessToken,
    signTypedDataAsync,
    signer
  }: {
    accessToken: string;
    signTypedDataAsync: SignTypedDataAsync;
    signer: Signer;
  }
) => {
  const profileId = createProfileImageRequest.profileId;
  let profileResult = await getLensProfile({
    profileId
  });
  if (!profileResult) {
    throw new Error("Could not find profile");
  }

  if (!profileResult.dispatcher) {
    const result = await enableDispatcherWithTypedData(
      {
        profileId
        // leave it blank if you want to use the lens API dispatcher!
        // dispatcher: '0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF',
      },
      { accessToken }
    );

    const typedData = result.typedData;

    const signature = await signedTypeData(
      signTypedDataAsync,
      typedData.domain,
      typedData.types,
      typedData.value
    );

    const { v, r, s } = utils.splitSignature(signature);

    await getLensHub(signer).setDispatcherWithSig({
      profileId: typedData.value.profileId,
      dispatcher: typedData.value.dispatcher,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline
      }
    });
  }

  profileResult = await getLensProfile({
    profileId
  });

  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult.dispatcher?.canUseRelay) {
    const dispatcherResult = await createSetProfileUriViaDispatcherRequest(
      createProfileImageRequest,
      { accessToken }
    );

    if (dispatcherResult.__typename !== "RelayerResult") {
      console.error(
        "set profile image url via dispatcher: failed",
        dispatcherResult
      );
      const error = new Error("set profile image url via dispatcher: failed");
      Sentry.captureException(error);
      throw error;
    }

    return { txHash: dispatcherResult.txHash, txId: dispatcherResult.txId };
  } else {
    const signedResult = await signCreateSetProfileImageUriTypedData(
      createProfileImageRequest,
      { signTypedDataAsync, accessToken }
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
      const error = new Error("set profile image url via broadcast: failed");
      Sentry.captureException(error);
      throw error;
    }

    return { txHash: broadcastResult.txHash, txId: broadcastResult.txId };
  }
};

async function setProfileImageUri(
  request: WithRequired<UpdateProfileImageRequest, "url">,
  {
    accessToken,
    signTypedDataAsync,
    signer
  }: {
    accessToken: string;
    signTypedDataAsync: SignTypedDataAsync;
    signer: Signer;
  }
) {
  const setProfileImageUriRequestPayload = {
    profileId: request["profileId"],
    url: request["url"]
  };
  try {
    const result = await setProfileImage(setProfileImageUriRequestPayload, {
      accessToken,
      signTypedDataAsync,
      signer
    });
    await pollUntilIndexed({ txId: result.txId }, { accessToken });
  } catch (error) {
    console.error("useSetProfileImageUri error", error);
    Sentry.captureException(error);
    const signedResult = await signCreateSetProfileImageUriTypedData(
      setProfileImageUriRequestPayload,
      {
        accessToken,
        signTypedDataAsync
      }
    );

    const typedData = signedResult.result.typedData;

    const { v, r, s } = utils.splitSignature(signedResult.signature);

    await getLensHub(signer).setProfileImageURIWithSig({
      profileId: typedData.value.profileId,
      imageURI: typedData.value.imageURI,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline
      }
    });
  }
  return true;
}
